import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // Log the cookies from the incoming request
  const cookieHeader = request.headers.get("cookie");
  console.log("Incoming cookies:", cookieHeader);
  return NextResponse.json({ cookie: cookieHeader });
}
