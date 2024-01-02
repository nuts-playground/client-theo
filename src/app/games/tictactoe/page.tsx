"use client";
import { motion } from "framer-motion";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<String>("O");
    const [timer, setTimer] = useState<number>(0);
    const [isStart, setIsStart] = useState<Boolean>(false);

    const gameStart = () => {
        setIsStart(true);
    };

    const changeTurn = () => {
        setPlayers((prev: string[]) => [...prev.reverse()]);
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
                return;
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
        setInterval(() => {
            setTimer((prev) => prev + 1);
        }, 1000);
        setBoardData(createGridBoard(3, 3));
    }, []);
    return (
        <>
            <GameSection>
                <GameBoard
                    gridBoard={boardData}
                    cellClick={onClick}
                ></GameBoard>
            </GameSection>
            <StatusSection title={"틱택토"}>
                <>
                    {isStart ? (
                        <div>
                            <div className="text-3xl">
                                {players[0]}과 {players[1]}의 승부!
                            </div>
                            <div className="text-2xl">{timer}초 경과</div>
                            <div className="text-2xl">
                                {currentPlayer}의 차례!
                            </div>
                        </div>
                    ) : (
                        <motion.button
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={gameStart}
                            className="py-1 px-5 text-2xl font-bold border-2 border-gray-600 rounded-lg bg-gray-100"
                            type="button"
                        >
                            게임 시작!
                        </motion.button>
                    )}
                </>
            </StatusSection>
        </>
    );
};
