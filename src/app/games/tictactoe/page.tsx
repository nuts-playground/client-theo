"use client";
import { motion } from "framer-motion";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]);
    const [isStart, setIsStart] = useState<Boolean>(false);
    const [winner, setWinner] = useState<string>("");

    const gameStart = () => {
        setIsStart(true);
    };

    const changeTurn = () => {
        setCurrentPlayer((prev) => {
            return prev === players[0] ? players[1] : players[0];
        });
    };

    const checkGameOver = () => {
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
                    (item) => item.player.trim() === currentPlayer.trim()
                )
            ) {
                setWinner(currentPlayer);
                return;
            }
        }

        let cellArray = boardData.reduce(function (prev, next) {
            return prev.concat(next);
        });

        if (cellArray.every((cell) => cell.value)) {
            setWinner("drow");
        }
    };

    const onClick = (y: number, x: number) => {
        if (boardData[y][x].value) return false;

        setBoardData((prev: IGameCell[][]) => {
            prev[y][x].value = true;
            prev[y][x].player = currentPlayer;
            changeTurn();
            checkGameOver();
            return [...prev];
        });
    };

    const resetBoard = () => {
        setIsStart(false);
        setCurrentPlayer(players[0]);
        setBoardData(createGridBoard(3, 3));
        setWinner("");
    };

    useEffect(() => {
        setBoardData(createGridBoard(3, 3));
    }, []);

    return (
        <>
            <GameSection>
                <GameBoard
                    gridBoard={boardData}
                    cellClick={onClick}
                    isStart={isStart}
                ></GameBoard>
            </GameSection>
            <StatusSection
                title={"틱택토"}
                description={
                    "O와 X가 서로 번갈아 가며 그립니다. 가로, 세로, 대각선을 먼저 만든 사람이 이깁니다."
                }
            >
                <>
                    {isStart ? (
                        <div>
                            <div className="flex text-6xl font-bold">
                                <span className="relative">
                                    {players[0]}
                                    {currentPlayer === players[0] ? (
                                        <div className="absolute text-2xl left-1/2 whitespace-nowrap -translate-x-1/2">
                                            <motion.div
                                                layout
                                                layoutId="player"
                                            >
                                                {players[0]}의 차례!
                                            </motion.div>
                                        </div>
                                    ) : null}
                                </span>
                                <span className="mx-4">VS</span>
                                <span className="relative">
                                    {players[1]}
                                    {currentPlayer === players[1] ? (
                                        <div className="absolute text-2xl left-1/2 whitespace-nowrap -translate-x-1/2">
                                            <motion.div
                                                layout
                                                layoutId="player"
                                            >
                                                {players[1]}의 차례!
                                            </motion.div>
                                        </div>
                                    ) : null}
                                </span>
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

                    {players.some((player) => player === winner) ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 flex justify-center items-center w-screen h-screen"
                        >
                            <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
                            <motion.div
                                layout
                                layoutId="player"
                                className="relative px-8 py-4 text-6xl font-bold bg-gray-200 rounded-lg border-4 border-gray-900"
                            >
                                {winner}의 승리!
                                <motion.button
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 70 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute inset-x-0 bottom-0 text-center text-3xl hover:underline"
                                    type="button"
                                    onClick={resetBoard}
                                >
                                    다시하기
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ) : null}

                    {winner === "drow" ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="fixed inset-0 flex justify-center items-center w-screen h-screen"
                        >
                            <div className="absolute inset-0 bg-gray-900 opacity-20"></div>
                            <motion.div
                                layout
                                layoutId="player"
                                className="relative px-8 py-4 text-6xl font-bold bg-gray-200 rounded-lg border-4 border-gray-900"
                            >
                                무승부!
                                <motion.button
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 70 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute inset-x-0 bottom-0 text-center text-3xl hover:underline"
                                    type="button"
                                    onClick={resetBoard}
                                >
                                    다시하기
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ) : null}
                </>
            </StatusSection>
        </>
    );
};
