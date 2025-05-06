import Producto from "@/models/Productos";
import { connectToDB } from "@/utils/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req: NextRequest, { params }: { params: { id?: string } }) {
  try {
    await connectToDB();
    const product = await Producto.findById(params.id).lean();
    if (!product) {
      return new NextResponse("Product not Found", { status: 404 });
    }
    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.log("[PRODUCT_GET_BY_ID]", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
