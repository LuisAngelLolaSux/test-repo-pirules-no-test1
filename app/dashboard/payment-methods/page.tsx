import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import { stripe } from "@/lib/utils";
import User from "@/models/auth/User";

export default async function PaymentMethodsPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }

  await connectToDB();
  const dbUser = await User.findById(user.id);
  // Example check for existing Stripe customer or setup
  // const setupIntent = await stripe.setupIntents.create({ customer: dbUser.stripeCustomerId });

  return (
    <div>
      <h1>Métodos de Pago</h1>
      {/* ...UI that uses setupIntent, or lists existing payment methods... */}
    </div>
  );
}
