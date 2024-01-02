interface IStatusSection {
    children: React.ReactElement;
    title: String;
}
export default ({ children, title }: IStatusSection) => {
    return (
        <div className="flex flex-col items-center grow">
            <h1 className="text-5xl font-bold text-center mb-10">
                테오
                <br />
                플레이그라운드
            </h1>
            <h2 className="mb-10 text-4xl font-bold">게임명 : {title}</h2>
            {children}
        </div>
    );
};
