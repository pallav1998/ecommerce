import ProductCard, { ProductCardSkelaton } from "@/components/ProductCard";
import prisma from "@/db/db";
import { Product } from "@prisma/client";
import React, { Suspense } from "react";

function getProducts() {
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { name: "asc" },
  });
}

export default function ProductsPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Suspense
        fallback={
          <>
            <ProductCardSkelaton />
            <ProductCardSkelaton />
            <ProductCardSkelaton />
            <ProductCardSkelaton />
            <ProductCardSkelaton />
            <ProductCardSkelaton />
          </>
        }
      >
        {<ProductsSuspense />}
      </Suspense>
    </div>
  );
}

async function ProductsSuspense() {
  const products = await getProducts();
  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
