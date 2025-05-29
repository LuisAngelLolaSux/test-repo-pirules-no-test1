import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs/Blog";
import { connectToDB } from "@/utils/mongoDB";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDB();
  const { id } = params;
  const blog = await Blog.findById(id).lean();
  if (!blog) {
    return new NextResponse("Blog not found", { status: 404 });
  }
  return NextResponse.json(blog, { status: 200 });
}
