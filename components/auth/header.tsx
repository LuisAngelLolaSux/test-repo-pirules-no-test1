interface HeaderProps {
    label?: string;
    title?: string;
}

export const Header = ({ label, title }: HeaderProps) => {
    return (
        <div className="flex w-full flex-col gap-y-2 pt-3 font-bold">
            <h1 className="text-3xl font-semibold">{title}</h1>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
};
