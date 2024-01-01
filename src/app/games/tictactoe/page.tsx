"use client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const changeTurn = () => {
        setPlayers((prev: string[]) => {
            return prev.reverse();
        });
    };

    const onClick = (y: number, x: number) => {
        if (boardData[y][x].value) return false;

        const player = players[0];
        setBoardData((prev: IGameCell[][]) => {
            prev[y][x].value = true;
            prev[y][x].player = player;
            changeTurn();
            return [...prev];
        });
    };

    useEffect(() => {
        setBoardData(createGridBoard(3, 3));
    }, []);
    return (
        <>
            <GameSection>
                <GameBoard gridBoard={boardData} cellClick={onClick} />
            </GameSection>
            <StatusSection>
                <div></div>
            </StatusSection>
        </>
    );
};
