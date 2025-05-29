import { NextRequest, NextResponse } from "next/server";
import Blog from "@/models/blogs/Blog";
import { connectToDB } from "@/utils/mongoDB";

export async function GET(req: NextRequest) {
  await connectToDB();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return new NextResponse("userId is required", { status: 400 });
  }

  const blogs = await Blog.find({ userId }).lean();

  // Agrupar por categoría
  const grouped = blogs.reduce((acc: any, blog: any) => {
    acc[blog.category] = acc[blog.category] || [];
    acc[blog.category].push(blog);
    return acc;
  }, {});

  return NextResponse.json({ blogs, grouped }, { status: 200 });
}
