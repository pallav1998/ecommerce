import { NextResponse } from "next/server";

export async function middleware(req: NextResponse) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("UnAuthorized", {
      status: 401,
      headers: { "WWW-Authenticate": "Basic" },
    });
  }
}

async function isAuthenticated(req: NextResponse) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader == null) return false;

  const [userName, password] = Buffer.from(authHeader.split(" ")[1], "base64")
    .toString()
    .split(":");

  return (
    userName === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASS
  );
}

export const config = {
  matcher: "/admin/:path*",
};
