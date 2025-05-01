export interface TextFormat {
    text: string;
    className?: string;
    format?: string;
}

export interface Link {
    name: TextFormat;
    link: string;
}

export interface BaseProps {
    className?: string;
}

export interface NavbarProps extends BaseProps {
    links: Link[];
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
}

export interface HeaderProps extends BaseProps {
    title: TextFormat;
    subtitle?: TextFormat;
    ctaText?: TextFormat;
    ctaLink?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
}

export interface HeroProps extends BaseProps {
    title: TextFormat;
    description: TextFormat;
    image: string;
    ctaText?: TextFormat;
    ctaLink?: string;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
}

export interface InfoGridProps extends BaseProps {
    title: TextFormat;
    items: {
        title: TextFormat;
        description: TextFormat;
        icon?: string;
    }[];
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
}

export interface ComponentConfig {
    componente: string;
    variacionComponente?: number;
    title?: string;
    subtitle?: string;
    ctaText?: string;
    ctaLink?: string;
    link?: string;
    image?: string;
    description?: string;
    items?: Array<{
        title: string;
        description: string;
        icon: string;
    }>;
    links?: Array<{
        name: string;
        link: string;
    }>;
    text?: string;
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
        // Also support an optional default layout if needed
        componentes?: ComponentConfig[];
    };
    paginas: PageConfig[];
    _id?: string;
    __v?: number;
}
