import { Button } from "@/components/ui/button";
import prisma from "@/db/db";
import { formatCurrency } from "@/lib/formatters";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import React from "react";
import Stripe from "stripe";

import { Resend } from "resend";
import { NextResponse } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { payment_intent: string };
}) {
  const email = "jain.pallav1998@gmail.com";
  const paymentIntent = await stripe.paymentIntents.retrieve(
    searchParams.payment_intent
  );
  const productId = paymentIntent.metadata.productId;
  if (productId === null) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });
  if (product === null) return notFound();

  const isSuccess = paymentIntent.status === "succeeded";
  console.log("paymentIntent", paymentIntent);

  if (isSuccess) {
    const pricePaid = paymentIntent.amount_received;
    const userFields = {
      email,
      orders: { create: { productId, pricePaid } },
    };

    const {
      orders: [order],
    } = await prisma.user.upsert({
      where: { email },
      create: userFields,
      update: userFields,
      select: { orders: { orderBy: { createdAt: "desc" }, take: 1 } },
    });

    const downloadVerifacation = await prisma.downloadVerification.create({
      data: { productId, expiresAt: new Date(Date.now() + 1000 * 60) },
    });

    await resend.emails.send({
      from: `Support <${process.env.RESEND_SENDER_EMAIL}>`,
      to: email,
      subject: "Order Confirmation",
      react: <h1>Order Confirmed</h1>,
    });

    // return new NextResponse("Order Confirmed", { status: 200 });
  }

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8">
      <h1 className="text-4xl font-bold">
        {isSuccess ? "Success!" : "Error!"}
      </h1>
      <div className="flex gap-4 items-center">
        <div className="aspect-video flex-shrink-0 w-1/3 relative">
          <Image
            fill
            className="object-cover"
            src={product.imagePath}
            alt={product.name}
          />
        </div>

        <div>
          <div className="text-xl">{formatCurrency(product.price)}</div>
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="line-clamp-3 text-muted-foreground">
            {product.description}
          </div>

          <Button className="mt-4" asChild>
            {isSuccess ? (
              <a
                href={`/products/download/${await createDownloadVerifacationId(
                  product.id
                )}`}
              >
                Download
              </a>
            ) : (
              <Link href={`/products/${product.id}/purchase`}>Try Again</Link>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

async function createDownloadVerifacationId(productId: string) {
  return (
    await prisma.downloadVerification.create({
      data: {
        productId,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      },
    })
  ).id;
}
