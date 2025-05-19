'use server';
import Stripe from 'stripe';
import { connectToDB } from './mongoDB';
import { currentUser } from '@/lib/auth';
import User from '@/models/auth/User';
import BillingEmpresa from '@/models/billingEmpresas/BillingEmpresas';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

/**
 * Creates a new Stripe customer and checks if there is already a customerId attatched.
 * @returns {Promise<string>} The created Stripe customer id.
 */
export async function getStripeCustomer() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        // Connect to the database
        await connectToDB();

        // Check if the user already has a Stripe customer ID
        const existingAccountInfo = await User.findOne({ _id: user.id });
        if (existingAccountInfo && existingAccountInfo.stripeCustomerId) {
            console.log(
                'User already has a Stripe customer ID:',
                existingAccountInfo.stripeCustomerId,
            );
            const existingCustomer = await stripe.customers.retrieve(
                existingAccountInfo.stripeCustomerId,
            );
            return existingCustomer.id.toString();
        }

        const customer = await stripe.customers.create({
            email: user.email?.toString(),
        });

        // Update the user model with the new Stripe customer ID
        if (existingAccountInfo) {
            await User.findOneAndUpdate({ _id: user.id }, { stripeCustomerId: customer.id });
        }

        return customer.id.toString();
    } catch (error) {
        console.error('Error creating Stripe customer:', error);
        throw error;
    }
}

/**
 * Attaches a payment method to a Stripe customer and makes the paymentMethod the default one.
 * @param stripeCustomerId - The Stripe customer ID.
 * @param paymentMethodId - The payment method ID to attach.
 * @returns {Promise<string>} A message indicating the process is done.
 */
export async function attachPaymentMethodToCustomer(
    stripeCustomerId: string,
    paymentMethodId: string,
): Promise<string> {
    try {
        // Attach the payment method to the customer
        await stripe.paymentMethods.attach(paymentMethodId, {
            customer: stripeCustomerId,
        });

        // Set the payment method as the default for the customer
        await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return 'Payment method attached and set as default successfully';
    } catch (error) {
        console.error('Error attaching payment method to customer:', error);
        throw error;
    }
}

/**
 * Changes the default payment method for a Stripe customer.
 * @param stripeCustomerId - The Stripe customer ID.
 * @param paymentMethodId - The payment method ID to set as default.
 * @returns The updated Stripe customer object.
 */
export async function changeDefaultPaymentMethod(
    stripeCustomerId: string,
    paymentMethodId: string,
) {
    try {
        // Set the payment method as the default for the customer
        const customer = await stripe.customers.update(stripeCustomerId, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });

        return customer;
    } catch (error) {
        console.error('Error changing default payment method:', error);
        throw error;
    }
}

/**
 * Retrieves a Stripe customer by ID.
 * @param customerId - The Stripe customer ID.
 * @returns The Stripe customer object.
 */
/* export async function getStripeCustomer(customerId: string) {
    try {
        const customer = await stripe.customers.retrieve(customerId);
        return customer;
    } catch (error) {
        console.error('Error retrieving Stripe customer:', error);
        throw error;
    }
} */

// Add more Stripe-related functions as needed
/**
 * Retrieves all payment methods for a Stripe customer.
 * @param stripeCustomerId - The Stripe customer ID.
 * @returns A list of payment methods associated with the customer.
 */
export async function getCustomerPaymentMethods(stripeCustomerId: string) {
    try {
        const paymentMethods = await stripe.paymentMethods.list({
            customer: stripeCustomerId,
            type: 'card',
        });
        return paymentMethods.data;
    } catch (error) {
        console.error('Error retrieving customer payment methods:', error);
        throw error;
    }
}

/**
 * Retrieves all payment methods for a Stripe customer using userId.
 * @param stripeCustomerId - The Stripe customer ID.
 * @returns A list of payment methods associated with the customer.
 */
export async function getUserPaymentMethods() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        // Connect to the database
        await connectToDB();

        // Check if the user already has a Stripe customer ID
        const existingAccountInfo = await User.findOne({ _id: user.id });
        if (existingAccountInfo && existingAccountInfo.stripeCustomerId) {
            const paymentMethods = await stripe.paymentMethods.list({
                customer: existingAccountInfo.stripeCustomerId,
                type: 'card',
            });
            return paymentMethods.data;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error retrieving customer payment methods:', error);
        throw error;
    }
}

export async function deletePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        await connectToDB();
        const billing = await BillingEmpresa.findOne({ userId: user.id });
        if (billing?.paymentMethod[0].stripePaymentMethodId === paymentMethodId) {
            billing.paymentMethod = [{ stripePaymentMethodId: paymentMethodId }];
            billing.recargaAutomatica.activada = false;
            await billing.save();
        }
        const existingAccountInfo = await User.findOne({ _id: user.id });
        if (existingAccountInfo && existingAccountInfo.stripeCustomerId) {
            await stripe.paymentMethods.detach(paymentMethodId);
            return true;
        } else {
            throw new Error('Stripe customer ID not found for user');
        }
    } catch (error) {
        console.error('Error deleting payment method:', error);
        return false;
    }
}

export async function updateBillingEmpresaPaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        await connectToDB();

        const result = await BillingEmpresa.findOneAndUpdate(
            { userId: user.id },
            { $set: { paymentMethod: [{ stripePaymentMethodId: paymentMethodId }] } },
            { new: true },
        );

        // Update the default payment method in Stripe
        const userRecord = await User.findOne({ _id: user.id });
        if (userRecord && userRecord.stripeCustomerId) {
            await stripe.customers.update(userRecord.stripeCustomerId, {
                invoice_settings: {
                    default_payment_method: paymentMethodId,
                },
            });
        }

        return !!result;
    } catch (error) {
        console.error('Error updating billingEmpresa paymentMethodId:', error);
        return false;
    }
}
export async function getBillingEmpresaPaymentMethod() {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        await connectToDB();

        const billingEmpresa = await BillingEmpresa.findOne({ userId: user.id });
        if (billingEmpresa && billingEmpresa.paymentMethod[0]?.stripePaymentMethodId) {
            const paymentMethod = await stripe.paymentMethods.retrieve(
                billingEmpresa.paymentMethod[0].stripePaymentMethodId,
            );
            return JSON.stringify(paymentMethod);
        } else {
            return JSON.stringify(null);
        }
    } catch (error) {
        console.error('Error retrieving billingEmpresa payment method:', error);
        return undefined;
    }
}

export async function updateAutomaticRechargeSettings(
    automaticRecharge: boolean,
    minimumCredits: number | null | undefined,
    rechargaAmount: number | null | undefined,
): Promise<boolean> {
    try {
        const user = await currentUser();
        if (!user) {
            throw new Error('User not found');
        }

        await connectToDB();

        const result = await BillingEmpresa.findOneAndUpdate(
            { userId: user.id },
            {
                $set: {
                    recargaAutomatica: {
                        activada: automaticRecharge,
                        ...(minimumCredits ? { minimoCreditos: minimumCredits } : {}),
                        ...(rechargaAmount ? { cantidadDeRecarga: rechargaAmount } : {}),
                    },
                },
            },
            { new: true },
        );

        return !!result;
    } catch (error) {
        console.error('Error updating automatic recharge settings:', error);
        return false;
    }
}

export async function lolaCreditsIntent(userId: string, cantidadCreditos: number) {
    try {
        await connectToDB();

        const existingAccountInfo = await User.findOne({ _id: userId });
        if (existingAccountInfo && existingAccountInfo.stripeCustomerId) {
            const customer = await stripe.customers.retrieve(existingAccountInfo.stripeCustomerId);
            if (!customer.deleted) {
                const defaultPaymentMethodId = customer.invoice_settings?.default_payment_method;

                const paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(cantidadCreditos * 100),
                    currency: 'mxn',
                    customer: existingAccountInfo.stripeCustomerId,
                    payment_method: defaultPaymentMethodId?.toString(),
                    description: 'Pago creditos Lola Automatizado',
                    receipt_email: customer.email ?? undefined,
                    metadata: {
                        userId: userId,
                        creditosAdquiridos: cantidadCreditos,
                    },
                    off_session: true,
                    confirm: true,
                });

                return paymentIntent.client_secret;
            }
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error creating payment intent:', error);
        throw error;
    }
}
