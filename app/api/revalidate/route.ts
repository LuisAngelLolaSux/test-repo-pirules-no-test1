import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { secret, path } = await req.json();
  if (secret !== process.env.REVALIDATE_TOKEN) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  try {
    // Revalida en segundo plano
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=${path}&secret=${secret}`);
    return NextResponse.json({ revalidated: true, path });
  } catch (err) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
