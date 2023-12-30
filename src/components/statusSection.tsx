export default ({ children }: { children: React.ReactElement }) => {
    return (
        <div className="flex flex-col items-center grow">
            <h2 className="text-5xl font-bold text-center mb-10">
                테오
                <br />
                플레이그라운드
            </h2>
            {children}
        </div>
    );
};
