// Interface for individual product
interface ProductMailType {
    nombre: string;
    imagen: string;
    cantidad: number;
    precio: number;
    variante: string | null;
    subvariante: string | null;
    currency?: string;
}

// Interface for order details
interface OrderDetails {
    nombreCliente: string;
    correoCliente: string;
    digitosTarjeta: string; // No aplica en orden creada
    typoTarjeta: string; // No aplica en orden creada
    numeroGuia: string; // No aplica en orden creada
    linkGuía: string; // No aplica en orden creada
    tiempoRecoleccion: number | string; // No aplica en orden creada
    tiempoDeEntrega: number; // No aplica en orden creada
    direccionDeEnvio: string;
    numeroTelefono: string;
}

interface ManualOrderDetails {
    nombreCliente: string;
    correoCliente: string;
    digitosTarjeta: string; // No aplica en orden creada
    typoTarjeta: string; // No aplica en orden creada
    linkGuía: string; // No aplica en orden creada
    direccionDeEnvio: string;
    numeroTelefono: string;
    tipoEnvio: string;
    diasEstimadosEntrega: string;
}

interface CompanyDataForOrder {
    nombre: string;
    email: string;
    logo: string;
    colors?: {
        primario: string;
        texto: string;
    };
}

// Main interface for the order
interface OrderData {
    usuarioLola: CompanyDataForOrder;
    productos: ProductMailType[];
    idDelPedido: string;
    detalles: OrderDetails;
    exchangeRate?: number;
}
// Interface for manual order details
interface ManualOrderData {
    usuarioLola: CompanyDataForOrder;
    productos: ProductMailType[];
    idDelPedido: string;
    detalles: ManualOrderDetails;
    exchangeRate?: number;
}

export type { OrderDetails, OrderData, ProductMailType, ManualOrderData };
