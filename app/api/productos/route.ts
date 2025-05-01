import Producto from "@/models/Productos";
import { SubVariante, Variante } from "@/types/types";
import { connectToDB } from "@/utils/mongoDB";
import { NextRequest, NextResponse } from "next/server";

const LOLA_USER_ID = process.env.LOLA_USER_ID;

export const GET = async (req: NextRequest) => {
    try {
        await connectToDB();
        const products = await Producto.find({ userId: LOLA_USER_ID });
        if (!products) {
            return new NextResponse("Products not Found", { status: 404 });
        }
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.log("[PRODUCT_GET]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { formInfo } = await req.json();
        if (
            !formInfo.nombre ||
            (formInfo.variantes.length === 0 &&
                (!formInfo.precio || !formInfo.inventario || !formInfo.descripcion)) ||
            formInfo.variantes.some(
                (variante: Variante) =>
                    (variante.subVariantes.length === 0 &&
                        (!variante.precio ||
                            !variante.inventario ||
                            !variante.variableType ||
                            !variante.variable ||
                            !variante.descripcion)) ||
                    (variante.subVariantes.length > 0 &&
                        variante.subVariantes.some(
                            (subVariante: SubVariante) =>
                                !subVariante.precio ||
                                !subVariante.inventario ||
                                !subVariante.variableType ||
                                !subVariante.variable ||
                                !subVariante.descripcion
                        ))
            )
        ) {
            return new NextResponse("Not enough data to create product", {
                status: 400,
            });
        }
        const product = await Producto.create({
            ...formInfo,
            userId: LOLA_USER_ID || null,
        });
        await product.save();
        return new NextResponse("Product created", { status: 200 });
    } catch (error) {
        console.log("[PRODUCT_POST]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
};

export const PUT = async (req: NextRequest) => {
    try {
        await connectToDB();
        const { formInfo } = await req.json();
        if (
            !formInfo.id ||
            !formInfo.nombre ||
            (formInfo.variantes.length === 0 &&
                (!formInfo.precio || !formInfo.inventario || !formInfo.descripcion)) ||
            formInfo.variantes.some(
                (variante: Variante) =>
                    (variante.subVariantes.length === 0 &&
                        (!variante.precio ||
                            !variante.inventario ||
                            !variante.variableType ||
                            !variante.variable ||
                            !variante.descripcion)) ||
                    (variante.subVariantes.length > 0 &&
                        variante.subVariantes.some(
                            (subVariante: SubVariante) =>
                                !subVariante.precio ||
                                !subVariante.inventario ||
                                !subVariante.variableType ||
                                !subVariante.variable ||
                                !subVariante.descripcion
                        ))
            )
        ) {
            return new NextResponse("Not enough data to update product", {
                status: 400,
            });
        }
        const { id, ...formInfoWithoutId } = formInfo;
        const product = await Producto.findByIdAndUpdate(formInfo.id, {
            ...formInfoWithoutId,
            userId: LOLA_USER_ID || null,
        });
        if (!product) {
            return new NextResponse("Product not Found", { status: 404 });
        }
        return new NextResponse("Product updated", { status: 200 });
    } catch (error) {
        console.log("[PRODUCT_PUT]", error);
        return new NextResponse("Internal server error", { status: 500 });
    }
};
