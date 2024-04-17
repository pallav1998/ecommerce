import prisma from "@/db/db";
import { notFound } from "next/navigation";
import Stripe from "stripe";
import CheckoutForm from "./_components/CheckoutForm";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export default async function PurchasePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (product == null) return notFound();

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: product.price,
    currency: "INR",
    metadata: { productId: product.id },
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  if (paymentIntent.client_secret == null)
    throw Error("Stripe Failed to create Payment Intet");

  //   res.send({
  //     clientSecret: paymentIntent.client_secret,
  //   });

  return (
    <CheckoutForm
      product={product}
      clientSecret={paymentIntent.client_secret}
    />
  );
}
