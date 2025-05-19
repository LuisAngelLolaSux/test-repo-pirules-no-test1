import { NextResponse } from 'next/server';
import { stripe } from '@/lib/utils';
import { connectToDB } from '@/utils/mongoDB';
import User from '@/models/auth/User';
import { currentUser } from '@/lib/auth';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const lastItemId = searchParams.get('lastItemId');
        // Extraer parámetros de fecha
        const startDateStr = searchParams.get('startDate');
        const endDateStr = searchParams.get('endDate');
        let startTimestamp, endTimestamp;
        if (startDateStr && endDateStr) {
            startTimestamp = parseInt(startDateStr);
            endTimestamp = parseInt(endDateStr);
        } else {
            // Usar inicio y fin del mes actual
            const now = new Date();
            const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
            const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            startTimestamp = Math.floor(currentMonthStart.getTime() / 1000);
            endTimestamp = Math.floor(currentMonthEnd.getTime() / 1000);
        }

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
        const stripeAccountId = existingAccountInfo.stripeAccountId;
        const balance = await stripe.balance.retrieve({ stripeAccount: stripeAccountId });
        const availableAmount = balance.available?.[0]?.amount ?? 0;
        const pendingAmount = balance.pending?.[0]?.amount ?? 0;
        const currency = balance.available?.[0]?.currency?.toUpperCase() || 'MXN';
        const formatCurrency = (amount: number) =>
            (amount / 100).toLocaleString('en-US', { style: 'currency', currency });
        const balanceSummary = {
            onTheWay: formatCurrency(availableAmount),
            upcoming: formatCurrency(pendingAmount),
            total: formatCurrency(availableAmount + pendingAmount),
        };

        const listParams: any = { limit: 100 };
        if (lastItemId) {
            listParams.starting_after = lastItemId;
        }
        const payoutsList = await stripe.payouts.list(listParams, {
            stripeAccount: stripeAccountId,
        });

        // Calcular total de ingresos mensuales usando el rango
        const totalMonthlyIncomeRaw = payoutsList.data.reduce((sum: number, payout: any) => {
            if (payout.created >= startTimestamp && payout.created <= endTimestamp) {
                return sum + payout.amount;
            }
            return sum;
        }, 0);
        const totalMonthlyIncome = formatCurrency(totalMonthlyIncomeRaw);

        const formattedPayouts = await Promise.all(
            payoutsList.data.map(async (payout: any) => {
                let bankAccount = null;
                if (payout.destination) {
                    try {
                        bankAccount = await stripe.accounts.retrieveExternalAccount(
                            stripeAccountId,
                            payout.destination,
                        );
                    } catch (err) {
                        console.error('Error retrieving bank account for payout:', payout.id, err);
                    }
                }
                return {
                    ...payout,
                    bankAccount,
                    formattedDate: new Date(payout.created * 1000).toLocaleString(),
                };
            }),
        );

        return NextResponse.json(
            { data: formattedPayouts, balanceSummary, totalMonthlyIncome },
            { status: 200 },
        );
    } catch (error) {
        console.error('Error al obtener los payouts:', error);
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
}
