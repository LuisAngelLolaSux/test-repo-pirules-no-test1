import { NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';
import { connectToDB } from '@/utils/mongoDB';
import User from '@/models/auth/User';
import { currentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        // Obtener parámetros de paginación y date range
        // Obtener parámetros de paginación y date range
        const { searchParams } = new URL(request.url);
        const lastItemId = searchParams.get('lastItemId');
        const startDate = searchParams.get('startDate'); // expecting ISO date or similar format
        const endDate = searchParams.get('endDate');

        // Obtener el usuario autenticado actual
        const user = await currentUser();
        if (!user) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
        }
        await connectToDB();
        // Obtener stripeAccountId del usuario en la base de datos
        const existingAccountInfo = await User.findById(user?.id);
        if (!existingAccountInfo || !existingAccountInfo.stripeAccountId) {
            return NextResponse.json({ error: 'Cuenta de Stripe no encontrada' }, { status: 404 });
        }
        // Usar el stripeAccountId para obtener transacciones

        const stripeAccountId = existingAccountInfo.stripeAccountId;

        // Configurar parámetros de listado, incluyendo paginación y filtro por fecha si se proporcionan
        const listParams: any = { limit: 100 };
        if (lastItemId) {
            listParams.starting_after = lastItemId;
        }
        if (startDate || endDate) {
            listParams.created = {};
            if (startDate) {
                listParams.created.gte = Math.floor(new Date(startDate).getTime() / 1000);
            }
            if (endDate) {
                listParams.created.lte = Math.floor(new Date(endDate).getTime() / 1000);
            }
        }
        if (startDate || endDate) {
            listParams.created = {};
            if (startDate) {
                listParams.created.gte = Math.floor(new Date(startDate).getTime() / 1000);
            }
            if (endDate) {
                listParams.created.lte = Math.floor(new Date(endDate).getTime() / 1000);
            }
        }
        // Directly retrieve charges from the connected account using stripeAccount option
        const transactionsAll = await stripe.charges.list(listParams, {
            stripeAccount: stripeAccountId,
        });
        // Mapear transacciones para añadir una fecha formateada basada en el campo "created"
        const formattedTransactions = transactionsAll.data.map((transaction: any) => ({
            ...transaction,
            formattedDate: new Date(transaction.created * 1000).toLocaleString(),
        }));
        return NextResponse.json({ data: formattedTransactions }, { status: 200 });
    } catch (error) {
        console.error('Error al obtener las transacciones:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
