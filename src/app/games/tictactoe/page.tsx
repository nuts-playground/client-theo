"use client";
import { motion } from "framer-motion";
import {
    Button,
    Input,
    Listbox,
    ListboxItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
    User,
    Divider,
} from "@nextui-org/react";
import { io } from "socket.io-client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen, faDoorClosed } from "@fortawesome/free-solid-svg-icons";
import PopoverButton from "@/components/popoverButton";

interface IRoom {
    id: number;
    name: string;
    players: string[];
}

const Room = ({
    joinedRoom,
    setJoinedRoom,
    socket,
    player,
}: {
    joinedRoom: any;
    setJoinedRoom: Function;
    socket: any;
    player: string;
}) => {
    const exitRoom = () => {
        setJoinedRoom({});
        socket.emit("exitRoom", {
            id: joinedRoom.id,
            player: player,
        });
    };

    return (
        <>
            <div className="flex items-center justify-center space-x-4 relative p-2 mb-2 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium">
                {joinedRoom.players.map((player: string, index: number) => {
                    return (
                        <>
                            <User className="text-nowrap" name={player} />
                            {index !== joinedRoom.players.length - 1 ? (
                                <Divider
                                    className="h-4"
                                    orientation="vertical"
                                />
                            ) : null}
                        </>
                    );
                })}
            </div>
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
                <Button
                    className="w-full"
                    type="button"
                    color="primary"
                    size="lg"
                >
                    Ready
                </Button>
            </div>
        </>
    );
};

const RoomList = ({
    rooms,
    socket,
    player,
}: {
    rooms: IRoom[];
    socket: any;
    player: string;
}) => {
    const joinRoom = (roomId: number) => {
        socket.emit("joinRoom", { id: roomId, player: player });
    };

    return (
        <Listbox
            className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
            aria-label="Actions"
            emptyContent="There are currently no rooms available. Please make a room."
        >
            {rooms.map((room: any, index: number) => {
                const isFull = room.players.length === 2;
                return (
                    <ListboxItem
                        key={index}
                        startContent={
                            isFull ? (
                                <FontAwesomeIcon icon={faDoorClosed} />
                            ) : (
                                <FontAwesomeIcon icon={faDoorOpen} />
                            )
                        }
                        description={`참가자: ${room.players.join(", ")}`}
                        onClick={() => {
                            joinRoom(room.id);
                        }}
                    >
                        {room.name}
                    </ListboxItem>
                );
            })}
        </Listbox>
    );
};

const GameLobby = ({
    rooms,
    socket,
    player,
}: {
    rooms: IRoom[];
    socket: any;
    player: string;
}) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [roomName, setRoomName] = useState<string>("");
    const [joinedRoom, setJoinedRoom] = useState<any>({});
    const createRoom = () => {
        setRoomName("");
        onClose();
        getRoom();
        socket.emit("createRoom", { roomName: roomName, player: player });
    };

    const getRoom = () => {
        socket.emit("getRoom");
    };

    useEffect(() => {
        socket.on("joinRoom", (data: boolean | object) => {
            if (data) {
                setJoinedRoom(data);
            }
        });
    }, []);

    return (
        <div>
            {joinedRoom.id ? (
                <Room
                    joinedRoom={joinedRoom}
                    setJoinedRoom={setJoinedRoom}
                    socket={socket}
                    player={player}
                />
            ) : (
                <>
                    <RoomList rooms={rooms} socket={socket} player={player} />
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
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]);
    const [isStart, setIsStart] = useState<Boolean>(false);
    const [winner, setWinner] = useState<string>("");
    const [player, setPlayer] = useState<string>("");
    const [isMultiplay, setIsMultiplay] = useState<boolean>(false);
    const [rooms, setRooms] = useState<any>([]);
    const [socket, setSocket] = useState<any>();

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

    const getRoom = () => {
        setIsMultiplay(true);
        socket.emit("getRoom");
    };

    useEffect(() => {
        setBoardData(createGridBoard(3, 3));

        const socket = io("http://localhost:3001");
        socket.on("getRoom", (rooms) => {
            setRooms([...rooms]);
        });
        setSocket(socket);
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
                    ) : null}

                    {isMultiplay ? (
                        <GameLobby
                            rooms={rooms}
                            socket={socket}
                            player={player}
                        />
                    ) : (
                        <div className="w-[350px] max-w-full">
                            <div className="flex mb-2">
                                <Input
                                    className="grow mr-2"
                                    type="text"
                                    color="primary"
                                    size="sm"
                                    value={player}
                                    placeholder="Enter your name and join"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setPlayer(e.target.value);
                                    }}
                                />

                                <PopoverButton
                                    condition={Boolean(player)}
                                    onClick={getRoom}
                                    buttonText="Multiplay"
                                    popoverTitle="The name is empty."
                                    popoverText=" Please enter your name for multiplayer."
                                />
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
