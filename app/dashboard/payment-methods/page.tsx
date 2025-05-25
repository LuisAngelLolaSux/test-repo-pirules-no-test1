import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import User from "@/models/auth/User";
import PaymentMethodsClient from "./PaymentMethodsClient";

export default async function PaymentMethodsPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }

  await connectToDB();
  const dbUser = await User.findById(user.id);
  const stripeCustomerId = dbUser?.stripeCustomerId || "";

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Métodos de Pago</h1>
      {/* Render durante la gestión de métodos de pago */}
      <PaymentMethodsClient stripeCustomerId={stripeCustomerId} />
    </div>
  );
}
