import { useAppSelector } from "@/app/redux/hook";
import GameCard from "./gameCard";
import Link from "next/link";
import { selectPlayer } from "@/app/redux/playerSlice";
const dummyGameList = [
    {
        id: "tictactoe",
        title: "틱택토",
        tags: ["2인용", "쉬운"],
    },
];

export default () => {
    return (
        <ul className="grid grid-cols-3 w-full gap-4">
            {dummyGameList.map((game, index) => {
                return (
                    <li key={index}>
                        <Link href={`/games/${game.id}`}>
                            <GameCard
                                title={game.title}
                                tags={game.tags}
                                id={game.id}
                            />
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
