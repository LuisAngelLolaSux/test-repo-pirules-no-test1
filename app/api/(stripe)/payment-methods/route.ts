import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import SubUser from "@/models/auth/SubUser";
import User from "@/models/auth/User";
import { stripe } from "@/lib/utils";

const parentAccount = process.env.LOLA_USER_STRIPE_ID;

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const dbUser = await SubUser.findById(user.id);
    const stripeCustomerId = dbUser?.customerStripeId;
    if (!stripeCustomerId) {
      return NextResponse.json({ paymentMethods: [], defaultMethod: null }, { status: 200 });
    }

    // List payment methods using the parent account (connected account)
    let paymentMethods: any[] = [];
    let defaultMethod: string | null = null;
    try {
      const paymentMethodsData = await stripe.paymentMethods.list(
        {
          customer: stripeCustomerId,
          type: "card",
        },
        { stripeAccount: parentAccount }
      );
      paymentMethods = paymentMethodsData.data;

      // Retrieve the customer using the parent account
      const customer = (await stripe.customers.retrieve(stripeCustomerId, {
        stripeAccount: parentAccount,
      })) as any;
      defaultMethod = customer?.invoice_settings?.default_payment_method || null;
    } catch (err: any) {
      // If the customer or payment methods do not exist, return empty
      return NextResponse.json({ paymentMethods: [], defaultMethod: null }, { status: 200 });
    }

    return NextResponse.json({ paymentMethods, defaultMethod }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { paymentMethodId } = await req.json();
    if (!paymentMethodId) {
      console.log("No paymentMethodId provided");
      return NextResponse.json({ error: "paymentMethodId is required" }, { status: 400 });
    }

    const user = await currentUser();
    if (!user) {
      console.log("No current user");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectToDB();
    const dbUser = await SubUser.findById(user.id);
    console.log("SubUser found:", dbUser);

    let stripeCustomerId = dbUser?.customerStripeId;

    // If no customerStripeId, create a new customer in the connected account
    if (!stripeCustomerId) {
      console.log("No customerStripeId found, creating new Stripe customer...");
      const customer = await stripe.customers.create(
        {
          email: dbUser?.email,
          name: dbUser?.name,
        },
        { stripeAccount: parentAccount }
      );
      stripeCustomerId = customer.id;
      dbUser.customerStripeId = stripeCustomerId;
      await dbUser.save();
      console.log("Created new Stripe customer:", customer);
    } else {
      console.log("Existing customerStripeId:", stripeCustomerId);
    }

    // Attach the payment method to the customer in the connected account
    console.log(
      "Attaching payment method",
      paymentMethodId,
      "to customer",
      stripeCustomerId,
      "on account",
      parentAccount
    );

    // Quick check: PaymentMethods created on the platform cannot be attached to connected accounts
    // This is a frontend integration issue, but we add a backend guard for clarity
    try {
      await stripe.paymentMethods.attach(
        paymentMethodId,
        { customer: stripeCustomerId },
        { stripeAccount: parentAccount }
      );
    } catch (err: any) {
      console.error(
        "Attach failed. Most likely, the PaymentMethod was not created in the connected account context.",
        err
      );
      return NextResponse.json(
        {
          error:
            "Failed to attach payment method. Make sure to create the payment method directly in the connected account context using Stripe.js with the connected account's publishable key and stripeAccount option.",
          details: err.message,
        },
        { status: 400 }
      );
    }
    console.log("Payment method attached");

    // Update default payment method using the parent account
    console.log("Updating default payment method for customer", stripeCustomerId);
    await stripe.customers.update(
      stripeCustomerId,
      {
        invoice_settings: { default_payment_method: paymentMethodId },
      },
      { stripeAccount: parentAccount }
    );
    console.log("Default payment method updated");

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error in POST /payment-methods:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
