import { redirect } from "next/navigation";
import { connectToDB } from "@/utils/mongoDB";
import { currentUser } from "@/lib/auth";
import Pedido from "@/models/Pedidos/Pedido";

export default async function PedidosPage() {
  const user = await currentUser();
  console.log("Current user:", user);
  console.log("User ID:", process.env.LOLA_USER_ID);
  console.log("User email:", user?.id);

  if (!user) {
    console.log("No user session found. Redirecting to /auth/login.");
    redirect("/auth/login");
  }
  await connectToDB();
  const pedidos = await Pedido.find({
    userId: process.env.LOLA_USER_ID,
    "informacionCliente.email": user.email,
  })
    .lean();

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Mis Pedidos</h1>
      {pedidos.length === 0 ? (
        <p className="text-gray-600">No hay pedidos.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pedidos.map((pedido: any) => (
            <div
              key={pedido._id}
              className="bg-white border border-gray-200 shadow-md rounded-lg p-6 hover:shadow-xl transition">
              <h2 className="text-xl font-semibold mb-2">Pedido: {pedido._id}</h2>
              <p className="mb-1">
                <strong>Cliente:</strong> {pedido.informacionCliente?.nombre || "Sin nombre"}
              </p>
              <p className="mb-1">
                <strong>Email:</strong> {pedido.informacionCliente?.email}
              </p>
              <p className="mb-1">
                <strong>Status:</strong> {pedido.statusPedido}
              </p>
              <p className="mb-1">
                <strong>Total Pedido:</strong> {pedido.precioTotalPedido ?? "N/A"}
              </p>
              <p className="mb-1">
                <strong>Creado:</strong> {new Date(pedido.createdAt).toLocaleDateString()}
              </p>
              {/* Productos de la orden */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Productos:</h3>
                {pedido.productos?.length ? (
                  pedido.productos.map((productoItem: any, index: number) => (
                    <div key={index} className="flex items-center mb-2">
                      <img
                        src={productoItem.producto?.imagen || "/placeholder.jpg"}
                        alt={productoItem.nombreProducto}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <p className="font-semibold">{productoItem.nombreProducto}</p>
                        <p>Cantidad: {productoItem.cantidad}</p>
                        <p>Precio: {productoItem.precioProducto}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No hay productos en este pedido.</p>
                )}
              </div>
              {/* ...existing code... */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
