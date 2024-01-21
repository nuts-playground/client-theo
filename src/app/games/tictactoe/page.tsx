"use client";
import { motion } from "framer-motion";
import {
    Button,
    Input,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";
import PopoverButton from "@/components/popoverButton";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectRooms } from "@/app/redux/roomsSlice";
import { selectRoom, updateBoard } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";
import { Room } from "@/components/room";

const GameLobby = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [roomName, setRoomName] = useState<string>("");

    const player = useAppSelector(selectPlayer);
    const room = useAppSelector(selectRoom);
    const socket = useAppSelector(selectSocket);

    const createRoom = () => {
        setRoomName("");
        onClose();
        socket.emit("createRoom", {
            name: roomName,
            player: player,
            boardData: createGridBoard(3, 3),
            currentTurn: player.name,
            winner: "",
        });
    };

    return (
        <div>
            {room.id ? (
                <Room />
            ) : (
                <>
                    <Button
                        className="w-full"
                        type="button"
                        color="primary"
                        size="lg"
                        onPress={onOpen}
                    >
                        Create room
                    </Button>
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={onOpenChange}
                        size="sm"
                    >
                        <ModalContent>
                            <ModalHeader className="flex flex-col gap-1">
                                Create room
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    className="grow mr-2"
                                    type="text"
                                    color="primary"
                                    size="sm"
                                    value={roomName}
                                    placeholder="Please enter the room name"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setRoomName(e.target.value);
                                    }}
                                />
                            </ModalBody>
                            <ModalFooter>
                                <PopoverButton
                                    condition={Boolean(roomName)}
                                    onClick={createRoom}
                                    buttonText="Create"
                                    popoverTitle="The room name is empty."
                                    popoverText="Please enter room name for multiplayer."
                                    type="button"
                                />
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </>
            )}
        </div>
    );
};

export default () => {
    const room = useAppSelector(selectRoom);
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);

    const dispatch = useAppDispatch();

    const checkGameOver = (boardData: IGameCell[][]) => {
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
                    (item) => item.player.trim() === room.currentTurn.trim()
                )
            ) {
                return player.name;
            }
        }

        let cellArray = boardData.reduce(function (
            prev: IGameCell[],
            next: IGameCell[]
        ) {
            return prev.concat(next);
        });

        if (cellArray.every((cell: IGameCell) => cell.value)) {
            return "drow";
        }

        return "";
    };

    const onClick = (y: number, x: number) => {
        dispatch(updateBoard({ y: y, x: x, player: player }));

        socket.emit("sendRoom", room);
    };

    const resetBoard = () => {};

    return (
        <>
            <GameSection>
                <GameBoard
                    gridBoard={room.boardData}
                    cellClick={onClick}
                    isStart={room.isStart}
                ></GameBoard>
            </GameSection>
            <StatusSection title="TIC-TAC-TOE">
                <>
                    {room.id ? <Room /> : <RoomList />}

                    {/* {room.isStart ? (
                        <div className="flex items-end text-6xl font-bold">
                            <span className="relative">
                                {players[0]}
                                {currentPlayer === players[0] ? (
                                    <div className="absolute text-2xl left-1/2 whitespace-nowrap -translate-x-1/2">
                                        <motion.div layout layoutId="player">
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
                                        <motion.div layout layoutId="player">
                                            {players[1]}'s turn!
                                        </motion.div>
                                    </div>
                                ) : null}
                            </span>
                        </div>
                    ) : null} */}

                    {/* {Object.keys(room.players).some((id) => {
                        return room.players[id].name === room.winner;
                    }) ? (
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
                                {room.winner}'s victory
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
                    ) : null} */}

                    {room.winner === "drow" ? (
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
