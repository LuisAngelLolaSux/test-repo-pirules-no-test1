import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import User from "@/models/auth/User";
import { stripe } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { paymentMethodId } = await req.json();
    if (!paymentMethodId) {
      return NextResponse.json({ error: "paymentMethodId is required" }, { status: 400 });
    }
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const dbUser = await User.findById(user.id);
    const stripeCustomerId = dbUser?.stripeCustomerId;
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 });
    }
    await stripe.customers.update(stripeCustomerId, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
