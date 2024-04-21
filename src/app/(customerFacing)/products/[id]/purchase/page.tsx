import prisma from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import { CheckoutForm } from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: Readonly<{
  params: { id: string };
}>) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price,
    currency: "INR",
    metadata: { productId: product.id },
  });

  if (paymentIntent.client_secret == null)
    throw Error("Stripe Failed to create Payment Intet");

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
