import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import User from "@/models/auth/User";
import { stripe } from "@/lib/utils";

const parentAccount = process.env.LOLA_USER_ID; // Ensure LOLA_USER_ID is set in your environment

export async function GET(req: NextRequest) {
  try {
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

    // List payment methods using the parent account (connected account)
    const paymentMethodsData = await stripe.paymentMethods.list(
      {
        customer: stripeCustomerId,
        type: "card",
      },
      { stripeAccount: parentAccount }
    );

    const paymentMethods = paymentMethodsData.data;

    // Retrieve the customer using the parent account
    const customer = (await stripe.customers.retrieve(stripeCustomerId, {
      stripeAccount: parentAccount,
    })) as any;
    const defaultMethod = customer?.invoice_settings?.default_payment_method || null;

    return NextResponse.json({ paymentMethods, defaultMethod });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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
    console.log("user", user);
    const dbUser = await User.findById(user.id);
    console.log("dbUser", dbUser);
    const stripeCustomerId = dbUser?.stripeCustomerId;
    console.log("stripeCustomerId", stripeCustomerId);
    if (!stripeCustomerId) {
      return NextResponse.json({ error: "Stripe customer not found" }, { status: 404 });
    }

    await stripe.paymentMethods.attach(
      paymentMethodId,
      { customer: stripeCustomerId },
      { stripeAccount: parentAccount }
    );

    // Update default payment method using the parent account
    await stripe.customers.update(
      stripeCustomerId,
      {
        invoice_settings: { default_payment_method: paymentMethodId },
      },
      { stripeAccount: parentAccount }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
