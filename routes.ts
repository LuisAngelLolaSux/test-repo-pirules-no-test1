/**
 * An array of routes that are accessible to the public.
 * These routes will not require authentication
 * @type {string[]}
 */
export const publicRoutes = [
    '/',
    '/auth/new-verification',
    '/pedido',
    '/aviso-de-privacidad',
    '/agentes',
    '/carrito',
    '/crear-orden',
    '/checkout',
    '/seguimiento',
    '/successAutomatico',
    '/successManual',
    '/successOrden',
    '/agente-ia',
    '/sistema-de-envios',
    '/posicionamiento-web',
    '/media-ads',
    '/automatic-e-flows',
    '/ux-ui',
    '/web-functions',
    '/erp-integrado',
    '/contacto',
    '/pricing',
];

/**
 * An array of routes that are accessible only to the devs
 * @type {string[]}
 */
export const devRoutes = [
    '/dashboard/agentes-whatsapp/testingFacebook',
    '/dashboard/stripe-connect',
    '/AmPm',
    '/dashboard/whatsapp-templates',
    '/dashboard/whatsapp-templates/crear',
    '/dashboard/whatsapp-templates/[wabaId]/[templateId]',
    '/dashboard/whatsapp-templates/[wabaId]/[templateId]/enviar',
    '/dashboard/openAi',
    '/dashboard/webModular',
];

/**
 * An array of routes that are used for authentication.
 * @type {string[]}
 */
export const authRoutes = [
    '/auth/login',
    '/auth/register',
    '/auth/error',
    '/auth/reset',
    '/auth/new-password',
];

/**
 * The API routes that have this prefix are for authentication
 * @type {string}
 */
export const apiAuthPrefix = '/api/auth';

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = '/page';

// SIDE BAR
import {
    FaceScanCircle,
    Tag,
    GalleryRemove,
    UserId,
    Box,
    MoneyBag,
    Calculator,
    BoxMinimalistic,
    DangerTriangle,
    UserRounded,
} from 'solar-icon-set';

/**
 * An array of routes that are used for dev role sidebar.
 * @type {{label: string, url: string, icon: React.ElementType}[]}
 */
export const sidebarDevRoutes = [
    { label: 'Test Embeddings Facebook', url: '/dashboard/agentes-whatsapp/testingFacebook' },
    { label: 'Stripe connect', url: '/dashboard/stripe-connect' },
    { label: 'Pago Clientes', url: '/dashboard/pagos-lola' },
    { label: 'Templates whatsapp', url: '/dashboard/whatsapp-templates' },
    { label: 'Ai Helper', url: '/dashboard/openAi' },
    { label: 'WebModular', url: '/dashboard/webModular' },
];

/**
 * An array of routes that are ready for the sidebar on production.
 * @type {{label: string, url: string, icon: React.ElementType}[]}
 */
export const sidebarProductionRoutes = [
    {
        label: 'Agentes',
        url: '/dashboard/agentes-whatsapp',
        icon: FaceScanCircle,
    },
    { label: 'Productos', url: '/dashboard/productos', icon: Tag },
    { label: 'Pedidos', url: '/dashboard/pedidos', icon: BoxMinimalistic },
    { label: 'Clientes', url: '/dashboard/clientes', icon: UserRounded },
    { label: 'Quitar Fondo', url: '/dashboard/quitar-fondo', icon: GalleryRemove },
    { label: 'Codigos Error', url: '/dashboard/productos/codigos-error', icon: DangerTriangle },
];

export const sidebarConfiguracionNegocioRoutes = [
    {
        label: 'General',
        url: '/dashboard/configuracion/negocio',
        icon: UserId,
    },
    // {
    //     label: 'Equipo y permisos',
    //     url: '/dashboard/configuracion/negocio/equipo-permisos',
    //     icon: UsersGroupTwoRounded,
    // },
    {
        label: 'Envios y almacenes',
        url: '/dashboard/configuracion/negocio/envios-almacenes',
        icon: Box,
    },
    {
        label: 'Pagos',
        url: '/dashboard/configuracion/negocio/pagos',
        icon: MoneyBag,
        subItems: [
            {
                label: 'Balance',
                url: '/dashboard/configuracion/negocio/pagos/balance',
            },
            {
                label: 'Transacciones',
                url: '/dashboard/configuracion/negocio/pagos/transacciones',
            },
        ],
    },
    // {
    //     label: 'Dominios',
    //     url: '/dashboard/configuracion/negocio/dominios',
    //     icon: Global,
    // },
    {
        label: 'Billing',
        url: '/dashboard/configuracion/negocio/billing',
        icon: Calculator,
    },
];
