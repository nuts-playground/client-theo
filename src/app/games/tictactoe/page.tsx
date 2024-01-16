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
    User,
    Divider,
} from "@nextui-org/react";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";
import PopoverButton from "@/components/popoverButton";
import { IPlayer, IRoom } from "@/interface/interface";
import { useAppSelector } from "../../redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { JoinModal } from "@/components/joinModal";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectRooms } from "@/app/redux/roomsSlice";
import { selectRoom } from "@/app/redux/roomSlice";
import { RoomList } from "@/components/roomList";

const Room = ({
    room,
    socket,
    player,
    gameStart,
}: {
    room: IRoom;
    socket: any;
    player: IPlayer;
    gameStart: Function;
}) => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isMaster, setIsMaster] = useState<boolean>(false);

    const exitRoom = () => {
        socket.emit("exitRoom");
    };

    const readyToggle = () => {
        const playerIndex = room.players?.findIndex(
            (roomPlayer) => roomPlayer.name === player.name
        );

        setIsReady((prevIsReady) => {
            return !prevIsReady;
        });
    };

    useEffect(() => {
        if (
            Array.isArray(room.players) &&
            room.players[0]?.name === player.name
        )
            setIsMaster(true);
    }, []);

    return (
        <>
            <div className="flex items-center justify-center space-x-4 relative p-2 mb-2 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium">
                {room.players?.map((player, index: number) => {
                    return (
                        <div
                            className="flex items-center space-x-4"
                            key={index}
                        >
                            <User
                                className="text-nowrap"
                                name={player.name}
                                description={player.isReady ? "Ready!" : null}
                            />
                            {index !== room.players.length - 1 ? (
                                <Divider
                                    className="h-4"
                                    orientation="vertical"
                                />
                            ) : null}
                        </div>
                    );
                })}
            </div>
            {room.isStart ? null : (
                <div className="flex space-x-2">
                    <Button
                        className="w-full"
                        type="button"
                        color="default"
                        size="lg"
                        onPress={exitRoom}
                    >
                        Exit
                    </Button>

                    {isMaster ? null : null}
                    <Button
                        className="w-full"
                        type="button"
                        color={
                            isReady
                                ? isMaster &&
                                  room.players?.every(
                                      (player: IPlayer) => player.isReady
                                  )
                                    ? "primary"
                                    : "success"
                                : "primary"
                        }
                        size="lg"
                        onPress={() => {
                            isMaster &&
                            room.players?.every(
                                (player: IPlayer) => player.isReady
                            )
                                ? gameStart()
                                : readyToggle();
                        }}
                    >
                        {isReady
                            ? isMaster &&
                              room.players?.every(
                                  (player: IPlayer) => player.isReady
                              )
                                ? "Start!"
                                : "OK!"
                            : "Ready"}
                    </Button>
                </div>
            )}
        </>
    );
};

const GameLobby = ({
    roomList,
    room,
    player,
    gameStart,
}: {
    roomList: IRoom[];
    room: IRoom;
    player: IPlayer;
    gameStart: Function;
}) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [roomName, setRoomName] = useState<string>("");

    const rooms = useAppSelector(selectRooms);
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
                <Room
                    room={room}
                    socket={socket}
                    player={player}
                    gameStart={gameStart}
                />
            ) : (
                <>
                    <RoomList rooms={rooms} />
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
    const [roomList, setRoomList] = useState<any>([]);

    const room = useAppSelector(selectRoom);
    const rooms = useAppSelector(selectRooms);
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);

    const gameStart = () => {
        room.isStart = true;
        socket.emit("sendRoom", room);
    };

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
        if (room.boardData[y][x].value) return false;
        if (room.currentTurn !== player.name) return false;
        room.boardData[y][x].value = true;
        room.boardData[y][x].player =
            room.players[0].name === player.name ? "O" : "X";
        room.currentTurn =
            room.currentTurn === room.players[0].name
                ? room.players[1].name
                : room.players[0].name;
        room.winner = checkGameOver(room.boardData);
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
            <StatusSection
                title={"Tictactoe"}
                description={
                    "O and X are drawn alternately. The first person to create horizontal, vertical, and diagonal lines wins."
                }
            >
                <>
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

                    {player.id ? (
                        <GameLobby
                            roomList={rooms}
                            room={room}
                            player={player}
                            gameStart={gameStart}
                        />
                    ) : (
                        <JoinModal />
                    )}

                    {room.players?.some((player) => {
                        console.log(room);
                        return player.name === room.winner;
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
                    ) : null}

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
