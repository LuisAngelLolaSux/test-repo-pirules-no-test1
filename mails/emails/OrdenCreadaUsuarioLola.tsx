import * as React from 'react';
import { Button, Container, Hr, Img, Heading, Row, Column } from '@react-email/components';
import { OrderData, ProductMailType } from '../types';
import BaseEmail from '../components/BaseEmail';
import ProductListItem from '../components/ProductoListItem';

interface IOrdenCreadaUsuarioLolaEmailProps {
    orden: OrderData;
}

// for testing uncomment the following constant
// const MOCK_ORDER: OrderData = {
//     usuarioLola: {
//         nombre: 'HorumyPrise',
//         email: 'correo@test.com',
//         logo: 'https://i.ibb.co/zZQmmyL/image.png',
//         colors: {
//             primario: '#F5A9B8',
//             texto: '#FFFFFF',
//         },
//     },
//     productos: [
//         {
//             nombre: 'Producto 1',
//             imagen: 'https://www.lolasux.com/L.png',
//             cantidad: 1,
//             precio: 100,
//             variante: 'Variante 1',
//             subvariante: 'Subvariante 1',
//         },
//         {
//             nombre: 'Producto 2',
//             imagen: 'https://www.lolasux.com/L.png',
//             cantidad: 2,
//             precio: 200,
//             variante: 'Variante 2',
//             subvariante: 'Subvariante 2',
//         },
//     ],
//     idDelPedido: '123456789',
//     detalles: {
//         nombreCliente: 'HorumyPrise',
//         correoCliente: 'correo@test.com',
//         tiempoDeEntrega: 3,
//         digitosTarjeta: '1234',
//         linkGuía: 'https://www.lolasux.com/L.png',
//         typoTarjeta: 'Visa',
//         numeroGuia: '123456789',
//         tiempoRecoleccion: 10,
//         direccionDeEnvio: 'Direccion 1',
//         numeroTelefono: '123456789',
//     },
// };

export function OrdenCreadaUsuarioLolaEmail({ orden }: IOrdenCreadaUsuarioLolaEmailProps) {
    const { productos, idDelPedido, detalles, usuarioLola } = orden;
    // for testing uncomment the following line
    // const { productos, idDelPedido, detalles } = orden || MOCK_ORDER;
    const exchangeRate = orden.exchangeRate ?? 1; // Example exchange rate from USD to MXN, default to 1 if undefined
    const total = productos.reduce((acum, producto) => {
        const productTotal = producto.cantidad * producto.precio;
        return acum + (producto.currency === 'USD' ? productTotal * exchangeRate : productTotal);
    }, 0);

    return (
        <BaseEmail
            footer={
                <Button
                    href="mailto:soporte@lolasux.com"
                    className="flex w-full items-center justify-start text-start text-gray-700"
                >
                    <Heading my={4} as="h5" className="font-thin">
                        soporte@lolasux.com
                    </Heading>
                </Button>
            }
        >
            <Container className="w-fit rounded-xl border border-gray-300 bg-white sm:p-8">
                <Container
                    style={{ backgroundColor: usuarioLola?.colors?.primario }}
                    className="text-center"
                >
                    <Img
                        src={usuarioLola.logo || 'https://www.lolasux.com/L.png'}
                        alt="LolaSux"
                        className="mx-auto max-h-9 w-auto"
                        width={36}
                        height={36}
                    />
                    <Heading as="h2" mb={0} className="text-xl font-bold">
                        ¡Nueva Cotización Generada!
                    </Heading>
                    <Heading as="h2" my={2} className="text-lg font-thin">
                        Aquí tienes los detalles para procesarla.
                    </Heading>
                </Container>
                <Hr />
                <Container className="text-start">
                    <Heading as="h3" mb={2} className="text-lg">
                        Detalles del Cliente:
                    </Heading>
                    <Heading my={0} as="h4" className="sm:text-md text-sm font-normal">
                        Nombre: {detalles.nombreCliente}
                    </Heading>
                    <Heading my={0} as="h4" className="sm:text-md text-sm font-normal">
                        Email: {detalles.correoCliente}
                    </Heading>
                    <Heading my={0} as="h4" className="sm:text-md text-sm font-normal">
                        Teléfono: {detalles.numeroTelefono}
                    </Heading>
                    <Heading mt={0} as="h4" className="sm:text-md line-clamp-1 text-sm font-normal">
                        Dirección de envío: {detalles.direccionDeEnvio}
                    </Heading>
                </Container>
                <Hr />
                <Container className="text-start">
                    <Heading as="h3" mb={2}>
                        Detalles de la Orden:
                    </Heading>
                    <Heading as="h4" my={0} className="sm:text-md text-sm font-normal">
                        Número de Orden: {idDelPedido}
                    </Heading>
                    <Heading as="h4" mt={0} className="sm:text-md text-sm font-normal">
                        Fecha:{' '}
                        {new Date().toLocaleDateString('es', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </Heading>
                </Container>
                <Container className="mt-2 text-start sm:p-4">
                    <Heading as="h4" my={0} className="font-medium sm:font-normal">
                        Artículos:{' '}
                    </Heading>
                    <Container className="mt-4 flex flex-col justify-between">
                        {productos.map((producto: ProductMailType) => (
                            <ProductListItem
                                key={producto.nombre}
                                producto={producto}
                                exchangeRate={orden.exchangeRate}
                            />
                        ))}
                    </Container>
                    <Container className="mt-10 flex items-end justify-end">
                        <Heading as="h1" mr={34} my={0} className="text-2xl font-medium">
                            Total:{' '}
                            {total.toLocaleString('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                            })}
                        </Heading>
                    </Container>
                </Container>
                <Hr />
                <div className="flex flex-row-reverse items-center justify-between text-start">
                    <Row>
                        <Column className="sm:w-2/4">
                            <Heading mx={0} as="h4" className="sm:text-md w-fit text-xs">
                                Estado de la Orden:
                            </Heading>
                        </Column>
                        <Column className="items-center justify-end sm:w-full">
                            <div className="flex w-fit flex-row-reverse items-center justify-between rounded-[8px] bg-[#FFE5BA] px-1 py-2 sm:ml-10">
                                <Heading as="h6" mx={0} my={0} className="w-fit text-xs">
                                    Pendiente de confirmación
                                </Heading>
                            </div>
                        </Column>
                    </Row>
                </div>
                <Hr />
                <Container className="mb-8 text-center">
                    <Heading as="h3" className="text-sm font-medium sm:text-lg">
                        ¿List@ para iniciar el seguimiento?
                    </Heading>
                    <Button
                        href={`https://wa.me/${detalles.numeroTelefono.replace('+', '')}`}
                        style={{
                            backgroundColor: '#34C85A',
                            color: '#FFFFFF',
                        }}
                        className="cursor-pointer rounded-[10px] px-16 py-3 font-bold text-white"
                    >
                        Contactar Cliente
                    </Button>
                </Container>
                <Hr />
                <Container className="text-center">
                    <Heading as="h3" className="text-sm font-light italic sm:text-lg">
                        ¡Gracias por utilizar el sistema de Lola!
                    </Heading>
                </Container>
            </Container>
        </BaseEmail>
    );
}

export default OrdenCreadaUsuarioLolaEmail;
