import { RegisterForm } from '@/components/auth/register-form';
import { cn } from '@/lib/utils';
import { BlackHole, TagPrice, UFO2 } from 'solar-icon-set';
import MobileCarrousel from './MobileCarrousel';

interface IInfoCardProps {
    title: string;
    content: string[];
    className?: string;
    icon?: React.ReactNode;
}

const InfoCardsContent: IInfoCardProps[] = [
    {
        title: 'Solución integral para tu negocio',
        content: [
            'Automatización e IA para optimizar operaciones y mejorar la experiencia del cliente.',
        ],
        icon: <BlackHole size={24} />,
    },
    {
        title: 'Precio accesible y escalable',
        content: ['Comienza con lo básico y crece sin grandes inversiones.'],
        icon: <TagPrice size={24} />,
    },
    {
        title: 'Implementación rápida y flexible',
        content: ['Automatiza procesos sin necesidad de conocimientos técnicos.'],
        icon: <UFO2 size={24} />,
    },
];

const first3Cards = InfoCardsContent.slice(0, 3);
const last3Cards = InfoCardsContent.slice(3);

const InfoCard = ({ title, content, className, icon }: IInfoCardProps) => {
    return (
        <div
            className={cn(
                'group h-fit max-w-[30rem] rounded-lg p-4 pl-0 transition-all duration-300 hover:translate-y-[-0.5rem]',
                className,
            )}
        >
            <div className="flex items-start justify-start space-x-2">
                <div className="transition-all duration-300 group-hover:text-primary-lola">
                    {icon}
                </div>
                <h1 className="mb-3 text-lg font-semibold leading-[1.24rem] transition-all duration-300 group-hover:text-primary-lola">
                    {title}
                </h1>
            </div>
            {content.map((paragraph, index) => (
                <div key={index} className="mb-2 flex items-center text-base last:mb-0">
                    <p>{paragraph}</p>
                </div>
            ))}
        </div>
    );
};

const SquaresWithInfo = () => {
    return (
        <>
            <div className="mx-auto mt-4 flex w-full max-w-sm flex-col justify-center overflow-hidden md:hidden">
                <div className="flex flex-row gap-4 overflow-auto">
                    <MobileCarrousel
                        slides={InfoCardsContent.map((card, index) => (
                            <InfoCard
                                key={index}
                                {...card}
                                className="w-[22rem] flex-shrink-0 space-x-2"
                            />
                        ))}
                    />
                </div>
            </div>
            <div className="hidden gap-4 md:grid md:grid-cols-1">
                <div className="mb-4 grid h-fit gap-4 md:mb-0">
                    {first3Cards.map((card, index) => (
                        <InfoCard key={index} {...card} />
                    ))}
                </div>
                <div className="grid h-fit gap-4">
                    {last3Cards.map((card, index) => (
                        <InfoCard key={index} {...card} />
                    ))}
                </div>
            </div>
        </>
    );
};

const RegisterPage = () => {
    return (
        <>
            <div className="flex w-screen flex-col items-center justify-between overflow-x-hidden px-2 md:px-4">
                <div className="mt-16 flex w-full flex-col items-center md:flex-row md:items-start md:justify-evenly">
                    <div className="flex flex-col items-start">
                        <SquaresWithInfo />
                    </div>
                    <RegisterForm />
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
