import { LoginForm } from "@/components/auth/login-form";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const user = await currentUser();
  if (user) {
    redirect("/page"); // o '/' según tu flujo
  }
  return <LoginForm />;
}
