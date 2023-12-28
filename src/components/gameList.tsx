import GameCard from "./gameCard";
import Link from "next/link";
const dummyGameList = [
    {
        title: "틱택토",
        tags: ["멀티플레이", "복불복", "심리"],
    },
    {
        title: "오목",
        tags: ["2인용", "복불복", "심리"],
    },
    {
        title: "테트리스",
        tags: ["심리", "1인용"],
    },
    {
        title: "높이 뛰기",
        tags: ["1인용"],
    },
    {
        title: "카드 맞추기",
        tags: ["1인용", "기억력"],
    },
    {
        title: "카드 맞추기",
        tags: ["1인용", "기억력"],
    },
    {
        title: "오목",
        tags: ["2인용", "복불복", "심리"],
    },
    {
        title: "틱택토",
        tags: ["멀티플레이", "복불복", "심리"],
    },
    {
        title: "테트리스",
        tags: ["심리", "1인용"],
    },
    {
        title: "높이 뛰기",
        tags: ["1인용"],
    },
    {
        title: "카드 맞추기",
        tags: ["1인용", "기억력"],
    },
    {
        title: "카드 맞추기",
        tags: ["1인용", "기억력"],
    },
];

export default () => {
    return (
        <ul className="grid grid-cols-3 w-full gap-4">
            {dummyGameList.map((game, index) => {
                return (
                    <li key={index}>
                        <Link href={`/games/${game.title}`}>
                            <GameCard title={game.title} tags={game.tags} />
                        </Link>
                    </li>
                );
            })}
        </ul>
    );
};
