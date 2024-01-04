"use client";
import { motion } from "framer-motion";
import {
    Button,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@nextui-org/react";
import { io } from "socket.io-client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { ReactElement, useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]);
    const [isStart, setIsStart] = useState<Boolean>(false);
    const [winner, setWinner] = useState<string>("");
    const [player, setPlayer] = useState<string>("");
    const [isJoin, setIsJoin] = useState<boolean>(false);

    var socket = io("http://localhost:3001");

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPlayer(e.target.value);
    };
    const onJoin = () => {
        if (player) {
            setIsJoin(true);
            console.log(player, "player", "roomId");
            // socket.emit("join_room", roomId);
        } else {
            alert("Please fill in player and Room Id");
        }
    };

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
                title={"Tictactoe"}
                description={
                    "O and X are drawn alternately. The first person to create horizontal, vertical, and diagonal lines wins."
                }
            >
                <>
                    {isStart ? (
                        <div>
                            <div className="flex items-end text-6xl font-bold">
                                <span className="relative">
                                    {players[0]}
                                    {currentPlayer === players[0] ? (
                                        <div className="absolute text-2xl left-1/2 whitespace-nowrap -translate-x-1/2">
                                            <motion.div
                                                layout
                                                layoutId="player"
                                            >
                                                {players[0]}'s turn!
                                            </motion.div>
                                        </div>
                                    ) : null}
                                </span>
                                <span className="mx-1 text-base">VS</span>
                                <span className="relative">
                                    {players[1]}
                                    {currentPlayer === players[1] ? (
                                        <div className="absolute text-2xl left-1/2 whitespace-nowrap -translate-x-1/2">
                                            <motion.div
                                                layout
                                                layoutId="player"
                                            >
                                                {players[1]}'s turn!
                                            </motion.div>
                                        </div>
                                    ) : null}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <div>
                            {isJoin ? null : (
                                <>
                                    <div className="flex mb-2">
                                        <Input
                                            className="w-60 mr-2"
                                            type="text"
                                            color="primary"
                                            size="sm"
                                            value={player}
                                            placeholder="Enter your name and join"
                                            onChange={onChange}
                                        />
                                        {player ? (
                                            <Button
                                                type="button"
                                                color="primary"
                                                size="lg"
                                                onClick={onJoin}
                                            >
                                                Join
                                            </Button>
                                        ) : (
                                            <Popover placement="right">
                                                <PopoverTrigger>
                                                    <Button
                                                        type="button"
                                                        color="primary"
                                                        size="lg"
                                                    >
                                                        Join
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div className="px-1 py-2">
                                                        <div className="text-small font-bold">
                                                            The name is empty.
                                                        </div>
                                                        <div className="text-tiny">
                                                            Please enter your
                                                            name for
                                                            multiplayer.
                                                        </div>
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={gameStart}
                                        color="primary"
                                        type="button"
                                        size="lg"
                                    >
                                        Local play
                                    </Button>
                                </>
                            )}
                        </div>
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
                                {winner}'s victory
                                <motion.button
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 70 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute inset-x-0 bottom-0 text-center text-3xl hover:underline"
                                    type="button"
                                    onClick={resetBoard}
                                >
                                    Again
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
                                Draw!
                                <motion.button
                                    initial={{ opacity: 0, y: -40 }}
                                    animate={{ opacity: 1, y: 70 }}
                                    transition={{ delay: 0.6 }}
                                    className="absolute inset-x-0 bottom-0 text-center text-3xl hover:underline"
                                    type="button"
                                    onClick={resetBoard}
                                >
                                    Again
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    ) : null}
                </>
            </StatusSection>
        </>
    );
};
