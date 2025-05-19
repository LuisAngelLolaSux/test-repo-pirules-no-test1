import { language } from 'googleapis/build/src/apis/language';
import * as z from 'zod';
import { PaymentMethod as StripePaymentMethod } from '@stripe/stripe-js';

const SocialNetworksSchema = z.object({
    name: z.string(),
    url: z.string(),
});
const paymentMethods = z.object({
    name: z.string(),
    isActive: z.boolean(),
});

const appointmentSchema = z.object({
    day: z.string(),
    startTime: z.string(),
    endTime: z.string(),
});

export const addNewWarehouseSchema = z.object({
    active: z.boolean(),
    warehouseName: z.string(),
    street: z.string(),
    intNumber: z.string(),
    extNumber: z.string(),
    neighborhood: z.string(),
    postalCode: z.string(),
    city: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string(),
    email: z.string().email(),
    contactName: z.string(),
    availableDays: z.array(appointmentSchema),
});

export const ShippingAndWarehousesSchema = z.object({
    offerShipping: z.boolean(),
});

export const AddLolaCreditsSchema = z.object({
    credits: z
        .number({
            required_error: 'Debe agregar al menos 50 créditos.',
            invalid_type_error: 'El monto de créditos debe ser un número.',
        })
        .min(50, { message: 'Debe agregar al menos 50 créditos.' }),
    paymentMethod: z.object({
        type: z.literal<StripePaymentMethod['type']>('card'),
        card: z.object({
            id: z.string(),
            brand: z.string(),
            exp_month: z.number(),
            exp_year: z.number(),
            last4: z.string(),
        }),
    }),
    automaticRecharge: z.boolean().optional(),
    minimumCredits: z.number().optional(),
    rechargeAmount: z
        .number({
            required_error: 'El monto de recarga es obligatorio.',
            invalid_type_error: 'El monto de recarga debe ser un número.',
        })
        .min(50, { message: 'El monto mínimo de recarga es 50 pesos.' })
        .optional(),
});

export const AutomaticRechargeSchema = z.object({
    paymentMethod: z.object({
        type: z.literal<StripePaymentMethod['type']>('card'),
        card: z.object({
            id: z.string(),
            brand: z.string(),
            exp_month: z.number(),
            exp_year: z.number(),
            last4: z.string(),
        }),
    }),
    minimumCredits: z.number().optional(),
    rechargeAmount: z.number().optional(),
});

export const locationSchema = z.object({
    country: z.string({
        required_error: 'Please select a country',
    }),
    locations: z.array(
        z.string({
            required_error: 'Please select a location',
        }),
    ),
});

export const AddPaymentMethodSchema = z.object({
    paymentMethod: z
        .object({
            holderName: z.string(),
        })
        .required(),
    country: z.string(),
});

export const GeneralSettingsSchema = z.object({
    companyName: z.string(),
    email: z.string().email(),
    image: z.string().optional(),
    website: z.string().optional(),
    phone: z.string(),
    colors: z.object({
        mainColor: z.string(),
        secondaryColor: z.string(),
        highlightColor: z.string(),
        textColor: z.string(),
        bgColor: z.string(),
        secondaryBgColor: z.string(),
    }),
    socialNetworks: z.array(SocialNetworksSchema).optional(),
    foundationYear: z.number(),
    industry: z.string(),
    slogan: z.string().optional(),
    description: z.string(),
});

export const PaymentSettingsSchema = z.object({
    paymentMethods: z.array(paymentMethods).optional(),
});

export const DatosFacturacionSchema = z.object({
    razonSocial: z.string().min(1, 'Este campo es requerido'),
    rfc: z.string().min(1, 'Este campo es requerido'),
    calle: z.string().min(1, 'Este campo es requerido'),
    colonia: z.string().min(1, 'Este campo es requerido'),
    numInt: z.string(),
    numExt: z.string(),
    codigoPostal: z.string().min(1, 'Este campo es requerido'),
    pais: z.string().min(1, 'Este campo es requerido'),
    estado: z.string().min(1, 'Este campo es requerido'),
    ciudad: z.string().min(1, 'Este campo es requerido'),
    email: z.string().email('Correo electrónico inválido'),
    telefono: z.string().min(1, 'Este campo es requerido'),
});

export const SettingsSchema = z
    .object({
        // Fields from the User model
        name: z.optional(z.string()),
        email: z.optional(z.string().email()),
        isTwoFactorEnabled: z.optional(z.boolean()),

        // Fields from the ConfiguracionUsuario model
        emailSecundario: z.optional(z.string().email().nullable()),
        dispositivos: z.optional(
            z.array(
                z.object({
                    dispositivo: z.optional(z.string().nullable()),
                    ubicacion: z.optional(z.string().nullable()),
                    ultimo_acceso: z.optional(z.date().nullable()),
                    estado: z.optional(z.boolean().nullable()),
                }),
            ),
        ),
        language: z.optional(z.enum(['es', 'en', 'fr'])),
        timeZone: z.optional(z.string().nullable()),
        phone: z.optional(z.string().nullable()),
        numeroTelefono: z.optional(z.string().nullable()),
        nombre: z.optional(z.string().nullable()),
        lastName: z.optional(z.string().nullable()),
        infoEmpresa: z.optional(
            z.object({
                imagenUrl: z.optional(z.string().nullable()),
                colorEmpresa: z.optional(z.string().nullable()),
                nombreEmpresa: z.optional(z.string().nullable()),
                emailEmpresa: z.optional(z.string().email().nullable()),
                paginaWeb: z.optional(z.string().nullable()),
                telefonoEmpresa: z.optional(z.string().nullable()),
                anoFundacion: z.optional(z.number().nullable()),
                industria: z.optional(z.string().nullable()),
                slogan: z.optional(z.string().nullable()),
                descripcion: z.optional(z.string().nullable()),
                redesSociales: z.optional(
                    z.array(
                        z.object({
                            nombre: z.optional(z.string().nullable()),
                            enlace: z.optional(z.string().nullable()),
                        }),
                    ),
                ),
            }),
        ),

        // Password fields with validation
        password: z.optional(z.string().min(6)),
        newPassword: z.optional(z.string().min(6)),
        confirmNewPassword: z.optional(z.string().min(6)),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false;
            }
            return true;
        },
        {
            message: 'Ingresa una nueva contraseña!',
            path: ['newPassword'],
        },
    )
    .refine(
        (data) => {
            if (data.newPassword && !data.password) {
                return false;
            }
            return true;
        },
        {
            message: 'Ingresa una contraseña!',
            path: ['password'],
        },
    )
    .refine(
        (data) => {
            if (data.newPassword !== data.confirmNewPassword) {
                return false;
            }
            return true;
        },
        {
            message: 'Las contraseñas no coinciden!',
            path: ['confirmNewPassword'],
        },
    );

export const LoginShema = z.object({
    email: z.string().email({
        message: 'El correo no cumple el formato',
    }),
    password: z.string().min(1, { message: 'Ingresa la contraseña' }),
    code: z.optional(z.string()),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: 'El correo no cumple el formato',
    }),
});

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: 'Ingresa minimo 6 caracteres!',
    }),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: 'El correo no cumple el formato',
    }),
    password: z.string().min(6, { message: 'Minimo 6 caracteres' }),
    name: z.string().min(1, {
        message: 'Ingresar tu nombre completo',
    }),
});
