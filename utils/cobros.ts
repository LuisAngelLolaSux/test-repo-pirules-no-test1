'use server';

import { sendLowCreditsEmail } from '@/lib/mail';
import User from '@/models/auth/User';
import EmailStatus from '@/models/emailStatus/EmailStatus';
import BillingEmpresa from '@/models/billingEmpresas/BillingEmpresas';
import { lolaCreditsIntent } from './stripeUtils';
import { connectToDB } from './mongoDB';

export const validarCreditos = async (userId: string | undefined | null, creditos: number) => {
    if (!userId) {
        return false;
    }
    try {
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return false; // Si no existe el usuario, no se puede continuar
        }

        // Manejo de créditos iniciales para usuarios OG
        if (user.lolaCredits === null || user.lolaCredits === undefined) {
            user.lolaCredits = 100; // Primeros 100 créditos gratis
        }

        if (user.lolaCredits - creditos < 0 && user.role !== 'ADMIN' && user.role !== 'DEV') {
            return false; // No se puede continuar si no hay suficientes créditos y el usuario no es admin/dev
        }

        return true;
    } catch (error) {
        console.error('Error al checar creditos', error);
        return false;
    }
};

export const cobrarCreditos = async (
    userId: string | undefined | null,
    creditos: number,
    descripcion: string,
) => {
    if (!userId) {
        return false;
    }
    try {
        await connectToDB();
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return false; // Si no existe el usuario, no se puede continuar
        }

        // Manejo de créditos iniciales para usuarios OG
        if (user.lolaCredits === null || user.lolaCredits === undefined) {
            user.lolaCredits = 100; // Primeros 100 créditos gratis
        }

        if (user.lolaCredits - creditos < 0 && user.role !== 'ADMIN' && user.role !== 'DEV') {
            return false; // No se puede continuar si no hay suficientes créditos y el usuario no es admin/dev
        }

        // Resta de créditos para usuarios normales
        if (user.role !== 'ADMIN' && user.role !== 'DEV') {
            user.lolaCredits = user.lolaCredits - creditos;
        }

        // Encuentra o crea el modelo BillingEmpresa asociado al usuario
        const billingEmpresa = await BillingEmpresa.findOneAndUpdate(
            { userId }, // Filtro por userId
            { $setOnInsert: { userId } }, // Si no existe, inicializa con userId
            { upsert: true, new: true }, // upsert asegura creación si no existe
        );

        // Agrega el nuevo registro de uso de créditos
        billingEmpresa.usoCreditos.push({
            fecha: new Date(),
            cantidad: creditos,
            descripcion,
        });

        // Guarda los cambios en los modelos
        await billingEmpresa.save();
        await user.save();

        if (
            billingEmpresa.recargaAutomatica.activada &&
            billingEmpresa.recargaAutomatica.cantidadDeRecarga &&
            billingEmpresa.recargaAutomatica.cantidadDeRecarga > 0 &&
            billingEmpresa.recargaAutomatica.minimoCreditos
        ) {
            if (user.lolaCredits <= billingEmpresa.recargaAutomatica.minimoCreditos) {
                // Funcion para recargar creditos automatico
                // Ej. await recargarCreditosAutomatico(userId, billingEmpresa.recargaAutomatica.cantidadDeRecarga)
                await lolaCreditsIntent(userId, billingEmpresa.recargaAutomatica.cantidadDeRecarga);
            }
        } else if (
            (!billingEmpresa.recargaAutomatica.activada ||
                !billingEmpresa.recargaAutomatica.cantidadDeRecarga ||
                !billingEmpresa.recargaAutomatica.minimoCreditos) &&
            user.lolaCredits < 30
        ) {
            // Envio de correo de aviso de créditos bajos
            const emailStatus = await EmailStatus.findOne({ userId: user._id });

            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

            if (!emailStatus) {
                await sendLowCreditsEmail(user.email, 30);
                await EmailStatus.create({
                    userId: user._id,
                    emailService: [
                        {
                            serviceName: 'sendLowCreditsEmail',
                            lastSent: new Date(),
                        },
                    ],
                });
            } else {
                const service = emailStatus.emailService.find(
                    (s) => s.serviceName === 'sendLowCreditsEmail',
                );
                if (!service || !service.lastSent || service.lastSent < oneWeekAgo) {
                    await sendLowCreditsEmail(user.email, 30);
                    if (service) {
                        service.lastSent = new Date();
                    } else {
                        emailStatus.emailService.push({
                            serviceName: 'sendLowCreditsEmail',
                            lastSent: new Date(),
                        });
                    }
                    await emailStatus.save();
                }
            }
        }

        return true;
    } catch (error) {
        console.error('Error al actualizar uso de créditos en BillingEmpresa:', error);
        return false;
    }
};
