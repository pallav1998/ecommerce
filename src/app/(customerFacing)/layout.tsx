import { Nav, NavLink } from "@/components/Nav";
import { ReactNode } from "react";

export const dynamic = "force-dynamic";

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Nav>
        <NavLink href="/">Dashboard</NavLink>
        <NavLink href="/products">My Products</NavLink>
        <NavLink href="/orders">My Orders</NavLink>
      </Nav>
      <div className="my-6 container">{children}</div>
    </>
  );
}
