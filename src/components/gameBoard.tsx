"use client";
import { motion } from "framer-motion";

export interface IGameCell {
    player: string;
    value: true | false;
    focus: {
        player: string;
        isFocus: true | false;
    };
}

interface IGameBoard {
    gridBoard: IGameCell[][];
    cellClick: Function;
}

export const GameBoard = ({ gridBoard, cellClick }: IGameBoard) => {
    return (
        <table>
            <tbody className="rounded overflow-hidden">
                {gridBoard.map((y: IGameCell[], yIndex: number) => {
                    const row = y.map((x: IGameCell, xIndex: number) => {
                        return (
                            <td
                                className={`first:border-l-0 last:border-r-0 border-t-0 border-4 border-gray-600 ${
                                    gridBoard.length - 1 === yIndex
                                        ? "border-b-0"
                                        : ""
                                }`}
                                key={xIndex}
                            >
                                <button
                                    className="flex justify-center items-center w-32 h-32 text-8xl"
                                    onClick={() => {
                                        cellClick(yIndex, xIndex);
                                    }}
                                >
                                    {x.value ? (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 600,
                                                duration: 150,
                                            }}
                                        >
                                            {x.player}
                                        </motion.span>
                                    ) : null}
                                </button>
                            </td>
                        );
                    });
                    return (
                        <tr className="" key={yIndex}>
                            {row}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export const createGridBoard = (x: number, y: number) => {
    const gridBoard = [];
    for (let i = 0; i < y; i++) {
        gridBoard[i] = Array.from({ length: x }, () => {
            return {
                player: "",
                value: false,
                focus: {
                    player: "",
                    isFocus: false,
                },
            };
        });
    }
    return gridBoard;
};
