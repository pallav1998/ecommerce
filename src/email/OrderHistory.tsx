import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import React from "react";

type OrderHistoryEmailProps = {
  orders: {
    id: string;
    pricePaid: number;
    createdAt: Date;
    downloadVerificationId: string;
    product: {
      name: string;
      imagePath: string;
      description: string;
    };
  }[];
};

OrderHistoryEmail.PreviewProps = {
  orders: [
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaid: 10000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name",
        description: "Some description",
        imagePath:
          "https://cdn.shopify.com/s/files/1/0070/7032/files/product-label-design.jpg?v=1680902906",
      },
    },
    {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      pricePaid: 2000,
      downloadVerificationId: crypto.randomUUID(),
      product: {
        name: "Product name 2",
        description: "Some other desc",
        imagePath:
          "https://cdn.shopify.com/s/files/1/0070/7032/files/product-label-design.jpg?v=1680902906",
      },
    },
  ],
} satisfies OrderHistoryEmailProps;

export default function OrderHistoryEmail({
  orders,
}: Readonly<OrderHistoryEmailProps>) {
  return (
    <Html>
      <Preview>Order History and Downloads</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Order History</Heading>
            {orders.map((order, index) => (
              <React.Fragment key={order.id}>
                <OrderInformation
                  order={order}
                  product={order.product}
                  downloadVerificationId={order.downloadVerificationId}
                />
                {index < orders.length - 1 && <Hr />}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
