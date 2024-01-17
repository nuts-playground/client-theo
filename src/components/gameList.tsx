import { useAppSelector } from "@/app/redux/hook";
import GameCard from "./gameCard";
import Link from "next/link";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectJoinModal } from "@/app/redux/joinModalSlice";
const dummyGameList = [
    {
        id: "tictactoe",
        title: "틱택토",
        tags: ["2인용", "쉬운"],
    },
];

export default () => {
    const player = useAppSelector(selectPlayer);
    const joinModal = useAppSelector(selectJoinModal);
    return (
        <ul className="grid grid-cols-3 w-full gap-4">
            {dummyGameList.map((game, index) => {
                return (
                    <li key={index}>
                        {player.id ? (
                            <Link href={`/games/${game.id}`}>
                                <GameCard
                                    title={game.title}
                                    tags={game.tags}
                                    id={game.id}
                                />
                            </Link>
                        ) : (
                            <div onClick={() => joinModal.onOpen()}>
                                <GameCard
                                    title={game.title}
                                    tags={game.tags}
                                    id={game.id}
                                />
                            </div>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
