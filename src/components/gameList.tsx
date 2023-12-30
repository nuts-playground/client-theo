import GameCard from "./gameCard";
import Link from "next/link";
const dummyGameList = [
    {
        id: "tictactoe",
        title: "틱택토",
        tags: ["멀티플레이", "복불복", "심리"],
    },
];

export default () => {
    return (
        <ul className="grid grid-cols-3 w-full gap-4">
            {dummyGameList.map((game, index) => {
                return (
                    <li key={index}>
                        <Link href={`/games/${game.id}`}>
                            <GameCard title={game.title} tags={game.tags} />
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
