import ProductCard, { ProductCardSkelaton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import prisma from "@/db/db";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { cache } from "@/lib/cache";

const getMostPopularProduct = cache(
  () => {
    // await wait(2000);
    return prisma.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProduct"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProduct = cache(() => {
  // await wait(5000);
  return prisma.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProduct"]);

// function wait(durations: number) {
//   return new Promise((resolve) => setTimeout(resolve, durations));
// }

export default function HomePage() {
  return (
    <main className="space-y-12">
      <ProductGridSection
        title="Most Popular"
        productFetcher={getMostPopularProduct}
      />
      <ProductGridSection
        title="Most Newest"
        productFetcher={getNewestProduct}
      />
    </main>
  );
}

type ProductGridSectionProp = {
  title: string;
  productFetcher: () => Promise<Product[]>;
};
async function ProductGridSection({
  title,
  productFetcher,
}: ProductGridSectionProp) {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <h2 className="text-3xl font-bold">{title}</h2>

        <Button variant="outline" asChild>
          <Link href="/products" className="space-x-2">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkelaton />
              <ProductCardSkelaton />
              <ProductCardSkelaton />
            </>
          }
        >
          <ProductSuspense productFetcher={productFetcher} />
        </Suspense>
      </div>
    </div>
  );
}

async function ProductSuspense({
  productFetcher,
}: {
  productFetcher: () => Promise<Product[]>;
}) {
  return (await productFetcher()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
