interface IStatusSection {
    children: React.ReactElement;
    title?: String;
    description?: String;
}
export default ({ children, title, description }: IStatusSection) => {
    return (
        <div className="flex flex-col justify-center items-center grow">
            {title ? (
                <h2 className="mb-10 text-4xl font-bold">{title}</h2>
            ) : null}
            {description ? (
                <p className="mb-6 px-10 text-xl">{description}</p>
            ) : null}
            {children}
        </div>
    );
};
