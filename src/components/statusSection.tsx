interface IStatusSection {
    children: React.ReactElement;
    title: string;
}
export default ({ children, title }: IStatusSection) => {
    return (
        <section className="flex flex-col justify-center w-full max-w-80">
            <h2 className="mb-4 text-2xl font-bold">{title}</h2>
            {children}
        </section>
    );
};
