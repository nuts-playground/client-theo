"use client";
import { motion } from "framer-motion";
import {
    Button,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    Listbox,
    ListboxItem,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    useDisclosure,
} from "@nextui-org/react";
import { io } from "socket.io-client";
import GameSection from "@/components/gameSection";
import StatusSection from "@/components/statusSection";
import { useEffect, useState, Key } from "react";
import { GameBoard, createGridBoard, IGameCell } from "@/components/gameBoard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorOpen } from "@fortawesome/free-solid-svg-icons";

export default () => {
    const [boardData, setBoardData] = useState<IGameCell[][]>([[]]);
    const [players, setPlayers] = useState<string[]>(["O", "X"]);
    const [currentPlayer, setCurrentPlayer] = useState<string>(players[0]);
    const [isStart, setIsStart] = useState<Boolean>(false);
    const [winner, setWinner] = useState<string>("");
    const [player, setPlayer] = useState<string>("");
    const [isJoin, setIsJoin] = useState<boolean>(false);
    const [rooms, setRooms] = useState<any>([]);
    const [roomName, setRoomName] = useState<string>("");
    const [socket, setSocket] = useState<any>();

    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const isOpenCreateRoom = isOpen;
    const onOpenCreateRoom = onOpen;
    const onCloseCreateRoom = onClose;
    const onOpenCreateRoomChange = onOpenChange;

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
        setIsJoin(true);
        socket.emit("getRoom");
    };

    const createRoom = () => {
        setRoomName("");
        onCloseCreateRoom();
        getRoom();
        socket.emit("createRoom", { roomName: roomName, player: player });
    };

    useEffect(() => {
        setBoardData(createGridBoard(3, 3));

        const socket = io("http://localhost:3001");
        socket.on("getRoom", (rooms) => {
            console.log(rooms);
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
                            {isJoin ? (
                                <div>
                                    <Listbox
                                        className="mb-2 gap-0 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium"
                                        aria-label="Actions"
                                        emptyContent="There are currently no rooms available. Please make a room."
                                    >
                                        {rooms.map(
                                            (room: any, index: number) => {
                                                return (
                                                    <ListboxItem
                                                        key={index}
                                                        startContent={
                                                            <FontAwesomeIcon
                                                                icon={
                                                                    faDoorOpen
                                                                }
                                                            />
                                                        }
                                                        description={`참가자: ${room.players
                                                            .map(
                                                                (
                                                                    player: string
                                                                ) =>
                                                                    player + ","
                                                            )
                                                            .join("")}`}
                                                    >
                                                        {room.roomName}
                                                    </ListboxItem>
                                                );
                                            }
                                        )}
                                    </Listbox>
                                    <Button
                                        className="w-full"
                                        type="button"
                                        color="primary"
                                        size="lg"
                                        onPress={onOpenCreateRoom}
                                    >
                                        Create room
                                    </Button>
                                    <Modal
                                        isOpen={isOpenCreateRoom}
                                        onOpenChange={onOpenCreateRoomChange}
                                        size="sm"
                                    >
                                        <ModalContent>
                                            {(onClose) => (
                                                <>
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
                                                                setRoomName(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </ModalBody>
                                                    <ModalFooter>
                                                        <Button
                                                            color="danger"
                                                            variant="light"
                                                            onPress={onClose}
                                                        >
                                                            Close
                                                        </Button>
                                                        {roomName ? (
                                                            <Button
                                                                type="button"
                                                                color="primary"
                                                                size="lg"
                                                                onPress={
                                                                    createRoom
                                                                }
                                                            >
                                                                Create
                                                            </Button>
                                                        ) : (
                                                            <Popover placement="right">
                                                                <PopoverTrigger>
                                                                    <Button
                                                                        type="button"
                                                                        color="primary"
                                                                        size="lg"
                                                                    >
                                                                        Create
                                                                    </Button>
                                                                </PopoverTrigger>
                                                                <PopoverContent>
                                                                    <div className="px-1 py-2">
                                                                        <div className="text-small font-bold">
                                                                            The
                                                                            room
                                                                            name
                                                                            is
                                                                            empty.
                                                                        </div>
                                                                        <div className="text-tiny">
                                                                            Please
                                                                            enter
                                                                            room
                                                                            name
                                                                            for
                                                                            multiplayer.
                                                                        </div>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        )}
                                                    </ModalFooter>
                                                </>
                                            )}
                                        </ModalContent>
                                    </Modal>
                                </div>
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
                                        {player ? (
                                            <Button
                                                type="button"
                                                color="primary"
                                                size="lg"
                                                onClick={getRoom}
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
                                </div>
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
