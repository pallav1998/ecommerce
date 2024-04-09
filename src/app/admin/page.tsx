import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/db/db";
import { formatCurrency, formatNumber } from "@/lib/formatters";

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaid: true },
    _count: true,
  });

  //   await wait(2000);

  return {
    amount: data._sum.pricePaid ?? 0,
    numberOfSales: data._count,
  };
}

// async function wait(duration: number) {
//   return new Promise((resolve) => setTimeout(resolve, duration));
// }

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaid: true },
    }),
  ]);

  return {
    userCount,
    averageValuePerUser:
      userCount === 0 ? 0 : (orderData._sum.pricePaid ?? 0) / userCount,
  };
}

async function getProductData() {
  const [activeCount, inActiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ]);

  return { activeCount, inActiveCount };
}

export default async function AdminDashboard() {
  const [salesData, userData, productData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        desc={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />

      <DashboardCard
        title="Customers"
        desc={`${formatCurrency(userData.averageValuePerUser)} Average Value`}
        body={formatNumber(userData.userCount)}
      />

      <DashboardCard
        title="Active Products"
        desc={`${formatNumber(productData.inActiveCount)} Inactive`}
        body={formatNumber(productData.activeCount)}
      />
    </div>
  );
}

type DashboardCardProps = {
  title: string;
  desc: string;
  body: string;
};

function DashboardCard({ title, desc, body }: Readonly<DashboardCardProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  );
}
