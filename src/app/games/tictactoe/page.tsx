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
import { IPlayer, IRoom } from "@/interface/interface";

const Room = ({
    room,
    setRoom,
    socket,
    player,
    gameStart,
}: {
    room: IRoom;
    setRoom: Function;
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
            setRoom((prevRoom: IRoom) => {
                prevRoom.players[playerIndex].isReady = !prevIsReady;
                socket.emit("sendRoom", prevRoom);
                return prevRoom;
            });
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

const RoomList = ({
    roomList,
    socket,
    player,
}: {
    roomList: IRoom[];
    socket: any;
    player: IPlayer;
}) => {
    const joinRoom = (roomId: number) => {
        socket.emit("joinRoom", {
            id: roomId,
            player: player,
        });
    };

    return (
        <Listbox
            className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
            aria-label="Actions"
            emptyContent="There are currently no rooms available. Please make a room."
        >
            {roomList.map((room: IRoom, index: number) => {
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
                        description={`참가자: ${room.players
                            .map((player: any) => player.name)
                            .join(", ")}`}
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
    roomList,
    room,
    setRoom,
    socket,
    player,
    gameStart,
}: {
    roomList: IRoom[];
    room: IRoom;
    setRoom: Function;
    socket: any;
    player: IPlayer;
    gameStart: Function;
}) => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const [roomName, setRoomName] = useState<string>("");
    const createRoom = () => {
        setRoomName("");
        onClose();
        console.log(player);
        socket.emit("createRoom", {
            name: roomName,
            player: player,
            boardData: createGridBoard(3, 3),
            currentTurn: player.name,
        });
    };

    return (
        <div>
            {room.id ? (
                <Room
                    room={room}
                    setRoom={setRoom}
                    socket={socket}
                    player={player}
                    gameStart={gameStart}
                />
            ) : (
                <>
                    <RoomList
                        roomList={roomList}
                        socket={socket}
                        player={player}
                    />
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
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]);
    const [winner, setWinner] = useState<string>("");
    const [player, setPlayer] = useState<IPlayer>({} as IPlayer);
    const [roomList, setRoomList] = useState<any>([]);
    const [socket, setSocket] = useState<any>();
    const [room, setRoom] = useState<any>({});

    const [playerName, setPlayerName] = useState<string>("");

    const joinGame = () => {
        const socket = io("http://localhost:3001");
        setPlayer({
            id: socket.id as string,
            name: playerName,
            isReady: false,
        });
        socket.on("sendRooms", (roomList) => setRoomList(roomList));
        socket.on("sendRoom", (roomData) => {
            setRoom(roomData);
            console.log(roomData);
            console.log("ddd");
        });
        setSocket(socket);
    };

    const gameStart = () => {
        setRoom((prev: IRoom) => {
            prev.isStart = true;
            socket.emit("sendRoom", prev);
            return prev;
        });
    };

    const changeTurn = () => {
        setCurrentPlayer((prev) => {
            return prev === players[0] ? players[1] : players[0];
        });
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
                    (item) => item.player.trim() === currentPlayer.trim()
                )
            ) {
                setWinner(currentPlayer);
                return;
            }
        }

        let cellArray = boardData.reduce(function (
            prev: IGameCell[],
            next: IGameCell[]
        ) {
            return prev.concat(next);
        });

        if (cellArray.every((cell: IGameCell) => cell.value)) {
            setWinner("drow");
        }
    };

    const onClick = (y: number, x: number) => {
        if (room.boardData[y][x].value) return false;
        if (room.currentTurn !== player) return false;
        setRoom((prev: IRoom) => {
            prev.boardData[y][x].value = true;
            prev.boardData[y][x].player =
                room.players[0].name === player ? "O" : "X";
            prev.currentTurn =
                room.players[0].name === player
                    ? room.players[1]
                    : room.players[0];
            socket.emit("sendRoom", prev);
            return prev;
        });
    };

    const resetBoard = () => {
        setCurrentPlayer(players[0]);
        setWinner("");
    };

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
                    {room.isStart ? (
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

                    {socket?.connected ? (
                        <GameLobby
                            roomList={roomList}
                            room={room}
                            setRoom={setRoom}
                            socket={socket}
                            player={player}
                            gameStart={gameStart}
                        />
                    ) : (
                        <div className="w-[350px] max-w-full">
                            <div className="flex mb-2">
                                <Input
                                    className="grow mr-2"
                                    type="text"
                                    color="primary"
                                    size="sm"
                                    value={playerName}
                                    placeholder="Enter your name and join"
                                    onChange={(
                                        e: React.ChangeEvent<HTMLInputElement>
                                    ) => {
                                        setPlayerName(e.target.value);
                                    }}
                                />

                                <PopoverButton
                                    condition={Boolean(player)}
                                    onClick={joinGame}
                                    buttonText="Join"
                                    popoverTitle="The name is empty."
                                    popoverText=" Please enter your name for multiplayer."
                                />
                            </div>
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
