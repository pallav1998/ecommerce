import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { formatCurrency } from "@/lib/formatters";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  imagePath: string;
};

export default function ProductCard({
  id,
  name,
  price,
  description,
  imagePath,
}: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative w-full h-auto aspect-video ">
        <Image fill src={imagePath} alt={name} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(price)}</CardDescription>
      </CardHeader>

      <CardContent>
        <p className="line-clamp-4">{description}</p>
      </CardContent>

      <CardFooter>
        <Button size="lg" className="w-full">
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkelaton() {
  return (
    <Card className="flex flex-col overflow-hidden animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-6 rounded-fullbg-gray-300" />
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="w-full h-6 rounded-full bg-gray-300" />
        <div className="w-full h-6 rounded-full bg-gray-300" />
        <div className="w-3/4 h-6 rounded-full bg-gray-300" />
      </CardContent>

      <CardFooter>
        <Button size="lg" className="w-full" disabled></Button>
      </CardFooter>
    </Card>
  );
}
