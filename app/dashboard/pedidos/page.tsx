import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import Pedido from "@/models/Pedidos/Pedido"; // Uncomment to access the model

export default async function PedidosPage() {
  const user = await currentUser();
  if (!user) {
    redirect("/auth/login");
  }

  await connectToDB();
  const pedidos = await Pedido.find({
    userId: process.env.LOLA_USER_ID,
    "informacionCliente.email": user.email,
  });
  console.log("Pedidos:", pedidos);

  return (
    <div>
      <h1>Mis Pedidos</h1>
    </div>
  );
}
