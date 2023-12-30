"use client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    useEffect(() => {
        setBoardData(createGridBoard(3, 3));
    }, []);
    return (
        <>
            <GameSection>
                <GameBoard gridBoard={boardData} setGrid={setBoardData} />
            </GameSection>
            <StatusSection>
                <div></div>
            </StatusSection>
        </>
    );
};
