import * as React from 'react';
import { Button, Container, Hr, Img, Heading, Row, Column } from '@react-email/components';
import { ManualOrderData, ProductMailType } from '../types';
import BaseEmail from '../components/BaseEmail';
import ProductListItem from '../components/ProductoListItem';
import CardProviderIcon from '../components/CardProviderIcon';

interface ICompraCreadaClienteFinalEmailProps {
    orden: ManualOrderData;
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

export function CompraCreadaClienteFinalEmail({ orden }: ICompraCreadaClienteFinalEmailProps) {
    const { productos, usuarioLola, idDelPedido, detalles } = orden;
    // for testing uncomment the following line
    // const { productos, usuarioLola, idDelPedido, detalles } = orden || MOCK_ORDER;
    const exchangeRate = orden.exchangeRate ?? 1; // Example exchange rate from USD to MXN, default to 1 if undefined
    const total = productos.reduce((acum, producto) => {
        const productTotal = producto.cantidad * producto.precio;
        return acum + (producto.currency === 'USD' ? productTotal * exchangeRate : productTotal);
    }, 0);
    return (
        <BaseEmail
            footer={
                <Button
                    href={`mailto:${usuarioLola.email}`}
                    className="flex w-full items-center justify-start text-start text-gray-700"
                >
                    <Heading my={4} as="h5" className="font-thin">
                        {usuarioLola.email}
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
                        className="mx-auto"
                        width={36}
                        height={36}
                    />
                    <Heading as="h2" mb={0} className="text-xl font-bold">
                        ¡Gracias por tu compra,{' '}
                        {detalles.nombreCliente?.split(',')[1] || detalles.nombreCliente}!
                    </Heading>
                    <Heading as="h2" mt={2} className="text-lg font-thin">
                        De parte del equipo de{' '}
                        <strong className="font-semibold">{usuarioLola.nombre}</strong>,<br />{' '}
                        gracias por confiar en nosotros.
                    </Heading>
                </Container>
                <Hr />
                <Container className="mt-2 text-start sm:p-4">
                    <Heading as="h4" my={0} className="font-semibold">
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
                        <Heading as="h1" mr={34} my={0} className="text-2xl font-semibold">
                            Total:{' '}
                            {new Intl.NumberFormat('es-MX', {
                                style: 'currency',
                                currency: 'MXN',
                            }).format(total)}
                        </Heading>
                    </Container>
                </Container>
                <Hr />
                <Container className="mt-2 text-start sm:p-4">
                    <Container className="items-center justify-between px-0 text-start">
                        <Row className="w-full">
                            <Column className="w-full">
                                <Heading as="h3" my={0} className="text-lg">
                                    Detalles de Transacción
                                </Heading>
                            </Column>
                            <Column className="items-center justify-end sm:w-full"></Column>
                        </Row>
                        <Row className="mt-4 w-full">
                            <Column className="w-1/2">
                                <Heading
                                    as="h4"
                                    my={0}
                                    mx={0}
                                    className="sm:text-md text-sm font-normal"
                                >
                                    Método de Pago:
                                </Heading>
                            </Column>
                            <Column className="flex w-full items-center justify-end gap-2 text-end text-sm">
                                <div className="flex w-full justify-end pl-10">
                                    <CardProviderIcon isMail provider={detalles.typoTarjeta} />
                                    <h1 className="text-xs">
                                        **** **** **** {detalles.digitosTarjeta}
                                    </h1>
                                </div>
                            </Column>
                        </Row>
                        <Row className="mt-2">
                            <Column className="">
                                <Heading as="h4" my={0} className="sm:text-md text-sm font-normal">
                                    Estado: Completado
                                </Heading>
                            </Column>
                            <Column className="flex items-center justify-end gap-2 pl-[300px] text-end text-sm sm:w-full">
                                <Img
                                    src="https://lolasux.com/static/mail-icons/CheckCircle.png"
                                    alt="check"
                                    height={20}
                                    width={20}
                                />
                            </Column>
                        </Row>
                    </Container>
                </Container>
                <Hr />

                <Container className="mt-2 text-start sm:p-4">
                    {/* Updated shipping details to match UsuarioLola format */}
                    <Heading as="h3" mb={2} className="text-lg">
                        Detalles de Envío:
                    </Heading>
                    <Heading my={0} as="h4" className="sm:text-md text-sm font-normal">
                        {detalles.direccionDeEnvio}
                    </Heading>
                    <Heading my={0} as="h4" className="sm:text-md mb-6 text-sm font-normal">
                        Tu pedido sera entregado en:{' '}
                        <strong>{detalles.diasEstimadosEntrega}</strong>
                    </Heading>
                    <div className="w-full text-center">
                        <Button
                            href={`https://www.lolasux.com/seguimiento?pedidoId=${idDelPedido}`}
                            style={{
                                backgroundColor: '#34C85A',
                                color: '#FFFFFF',
                            }}
                            className="mb-6 cursor-pointer rounded-[10px] px-16 py-3 font-bold text-white"
                        >
                            Rastrear mi pedido
                        </Button>
                    </div>
                </Container>
                <Hr />
                <Container className="text-center">
                    <Heading as="h3" className="text-sm font-light italic sm:text-lg">
                        Gracias por confiar en {usuarioLola.nombre}
                    </Heading>
                </Container>
            </Container>
        </BaseEmail>
    );
}

export default CompraCreadaClienteFinalEmail;
