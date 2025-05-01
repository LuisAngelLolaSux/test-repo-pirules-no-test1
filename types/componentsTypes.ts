export interface BaseProps {
    className?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
}

export interface TextFormat {
    text: string;
    className?: string;
}

export interface ChatAIProps extends BaseProps {
    botName?: TextFormat;
    initialMessage?: TextFormat | { path: string; message: string }[];
}

export interface TestimonialProps extends BaseProps {
    photo?: string;
    name: TextFormat;
    rating: number;
    comment: TextFormat;
}

export interface GalleryProps extends BaseProps {
    title: TextFormat;
    images: string[];
}

export interface PromotionHeaderProps extends BaseProps {
    text: TextFormat;
    link: string;
}

export interface JobOffersProps extends BaseProps {
    title: TextFormat;
    description: TextFormat;
    requirements: TextFormat[];
    contact: TextFormat[];
}

export interface CountdownProps extends BaseProps {
    date: string;
    text?: TextFormat;
    buttonText?: TextFormat;
    buttonlink?: string;
}

export interface TabsProps extends BaseProps {
    tabs: {
        tabTitle: TextFormat;
        image?: string;
        title: TextFormat;
        description: TextFormat;
        buttonText?: TextFormat;
        buttonlink?: string;
    }[];
}

export interface BrandSliderAwardsProps extends BaseProps {
    items: { image: string; link?: string }[];
}

export interface TeamProps extends BaseProps {
    title: TextFormat;
    text?: TextFormat;
    members: {
        photo: string;
        name: TextFormat;
        role: TextFormat;
        contact?: TextFormat[];
    }[];
}

export interface BranchesProps extends BaseProps {
    branches: {
        title: TextFormat;
        address: TextFormat;
        latitud: string;
        longitud: string;
        buttons?: { text: TextFormat; link: string }[];
    }[];
}

export interface NavbarProps extends BaseProps {
    links: {
        name: TextFormat;
        link: string;
    }[];
    logo?: string;
}

export interface HeroProps extends BaseProps {
    image: string;
    title: TextFormat;
    text?: TextFormat;
    ctaText?: TextFormat;
    ctaLink?: string;
    ctaText2?: TextFormat;
    ctaLink2?: string;
}

export interface FooterProps extends BaseProps {
    logo: string;
    links: { name: TextFormat; url: string }[];
    socialMedia: { platform: TextFormat; link: string }[];
    contactInfo?: TextFormat[];
}

export interface ArticlesProps extends BaseProps {
    image: string;
    title: TextFormat;
    author: TextFormat;
    date: string;
    references?: TextFormat[];
    index?: { title: TextFormat }[]; // Make sure the title is the same as the content to the link to work
    content: TextFormat | { text: TextFormat; image?: string; title: TextFormat };
    comments?: { user: TextFormat; comment: TextFormat }[];
    tags?: TextFormat[];
}

export interface FAQProps extends BaseProps {
    categories:
        | { question: TextFormat; answer: TextFormat }[]
        | {
              category: TextFormat;
              questions: { question: TextFormat; answer: TextFormat }[];
          }[];
}

export interface RichTextProps extends BaseProps {
    title: TextFormat;
    content: TextFormat;
    buttons?: { text: TextFormat; link: string }[];
}

export interface InfoGridProps extends BaseProps {
    items: {
        image?: string;
        title: TextFormat;
        text: TextFormat;
        buttonText?: TextFormat;
        buttonLink?: string;
    }[];
}

export interface FormProps extends BaseProps {
    title: TextFormat;
    description?: TextFormat;
    fields: { label: TextFormat; type: string; name: string; required?: boolean }[];
    submitButtonText: TextFormat;
}

export interface BookingProps extends BaseProps {
    title: TextFormat;
    calendar: string;
    timeSlots: TextFormat[];
    notes?: TextFormat;
    buttonText: TextFormat;
}

export interface CalendarProps extends BaseProps {
    events: { title: TextFormat; date: string; details?: TextFormat }[];
}

export interface CartProps extends BaseProps {
    products: {
        name: TextFormat;
        variant?: TextFormat;
        price: number;
        quantity: number;
        image?: string;
    }[];
    type: 'orden' | 'pedido';
}

export interface FrequentlyBoughtTogetherProps extends BaseProps {
    title: TextFormat;
    products: { name: TextFormat; variant?: TextFormat; price: number; image: string }[];
    buttons?: { text: TextFormat; link: string }[];
}

export interface OrderTrackingProps extends BaseProps {
    logo?: string;
    orderInfo: TextFormat;
    shippingStatus: TextFormat;
}

export interface CategoriesProps extends BaseProps {
    categories: { image?: string; title: TextFormat; text?: TextFormat; link: string }[];
}

export interface ProductGridProps extends BaseProps {
    filterOptions?: TextFormat[];
    products: {
        image?: string;
        title: TextFormat;
        label?: TextFormat;
        price: number;
        brand?: TextFormat;
        description?: TextFormat;
        specs?: TextFormat;
        link: string;
        buttonText: TextFormat;
        buttonLink: string;
    }[];
}

export interface ProductDetailsProps extends BaseProps {
    product: {
        image?: string;
        title: TextFormat;
        label?: TextFormat;
        price: number;
        brand?: TextFormat;
        description?: TextFormat;
        specs?: TextFormat;
        link: string;
        buttonText: TextFormat;
        buttonLink: string;
    };
}

export interface CheckoutProps extends BaseProps {
    shippingInfo: TextFormat;
    orderSummary: TextFormat;
}

export interface PricingProps extends BaseProps {
    pricingCards: { title: TextFormat; price: TextFormat; features: TextFormat[] }[];
    pricingTable?: {
        options: TextFormat;
        row: {
            feature: TextFormat;
            includedOrText: (TextFormat | boolean)[];
        };
    };
}

export interface UserSettingsProps extends BaseProps {
    profilePicture?: string;
    name: TextFormat;
    email: TextFormat;
    password?: string;
    addresses?: TextFormat[];
    paymentMethods?: TextFormat[];
}

export interface ComponentConfig {
    componente: string;
    title?: TextFormat;
    subtitle?: TextFormat;
    ctaText?: TextFormat;
    ctaLink?: string;
    link?: string;
    image?: string;
    description?: TextFormat;
    items?: Array<{
        title: TextFormat;
        description: TextFormat;
        icon: string;
    }>;
    links?: Array<{
        name: TextFormat;
        link: string;
    }>;
    text?: TextFormat;
}

export interface PageConfig {
    ruta: string;
    componentes: ComponentConfig[];
}

export interface SiteConfig {
    colores: {
        primary: string;
        secondary: string;
        text: string;
    };
    layout: {
        header?: { componentes: ComponentConfig[] };
        leftSidebar?: { componentes: ComponentConfig[] };
        rightSidebar?: { componentes: ComponentConfig[] };
        footer?: { componentes: ComponentConfig[] };
        componentes?: ComponentConfig[];
    };
    paginas: PageConfig[];
    _id?: string;
    __v?: number;
}
