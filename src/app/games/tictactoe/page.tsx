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

    const checkGameOver = (boardData: IGameCell[][], player: string) => {
        const lineArray = [
            // 가로 3줄
            [boardData[0][0], boardData[0][1], boardData[0][2]],
            [boardData[1][0], boardData[1][1], boardData[1][2]],
            [boardData[2][0], boardData[2][1], boardData[2][2]],
            // 세로 3줄
            [boardData[0][0], boardData[1][0], boardData[2][0]],
            [boardData[0][1], boardData[1][1], boardData[2][1]],
            [boardData[0][2], boardData[1][2], boardData[2][2]],
            // 대각선 2줄
            [boardData[0][0], boardData[1][1], boardData[2][2]],
            [boardData[0][2], boardData[1][1], boardData[2][0]],
        ];
        for (let i = 0; i < lineArray.length; i++) {
            if (
                lineArray[i].every(
                    (item) => item.player.trim() === player.trim()
                )
            ) {
                alert(`${player}의 승리`);
                resetBoard();
                break;
            }
        }

        let cellArray = boardData.reduce(function (prev, next) {
            return prev.concat(next);
        });

        if (cellArray.every((cell) => cell.value)) {
            alert("무승부!");
            resetBoard();
        }
    };

    const onClick = (y: number, x: number) => {
        if (boardData[y][x].value) return false;

        const player = players[0];
        setBoardData((prev: IGameCell[][]) => {
            prev[y][x].value = true;
            prev[y][x].player = player;
            changeTurn();
            checkGameOver([...prev], player);
            return [...prev];
        });
    };

    const resetBoard = () => {
        setBoardData(createGridBoard(3, 3));
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
