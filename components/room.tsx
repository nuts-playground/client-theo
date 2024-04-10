import {
    Button,
    useDisclosure,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Card,
    CardFooter,
    Chip,
    Listbox,
    ListboxItem,
} from "@nextui-org/react";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLarge } from "@fortawesome/free-solid-svg-icons";
import { SocketContext } from "@/context/socket";
import { RoomContext } from "@/context/room";
import { UserContext } from "@/context/user";

const Players = () => {
    const room = useContext(RoomContext);
    return (
        <>
            {room && (
                <Listbox
                    className="mb-4 gap-0 bg-content1 overflow-visible shadow-small rounded-medium"
                    aria-label="Actions"
                >
                    {room.players.map((player, index) => {
                        return (
                            <ListboxItem
                                className="flex justify-start"
                                key={index}
                            >
                                {player.isMaster ? (
                                    <Chip color="warning">방장</Chip>
                                ) : (
                                    <>
                                        {player.ready ? (
                                            <Chip color="primary">준비</Chip>
                                        ) : (
                                            <Chip color="danger">대기</Chip>
                                        )}
                                    </>
                                )}
                                <span className="ml-2">{player.name}</span>
                            </ListboxItem>
                        );
                    })}
                </Listbox>
            )}
        </>
    );
};

export const Room = ({
    children,
    gameDataGenerator,
}: {
    children: React.ReactElement;
    gameDataGenerator: () => any;
}) => {
    const socket = useContext(SocketContext);
    const room = useContext(RoomContext);
    const player = useContext(UserContext);
    const [isReady, setIsReady] = useState<boolean>(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const isMaster =
        room?.players.filter((player) => player.isMaster)[0].name ===
        player?.name;

    const canStart =
        room?.state !== "waiting" &&
        room?.players.filter((player) => player.ready).length ===
            (room?.players.length as number) - 1;

    const exitRoom = (id: number | undefined) => {
        socket?.emit("exitRoom", id);
        onClose();
    };

    const toggleReady = (id: number | undefined) => {
        setIsReady((prev) => !prev);
        socket?.emit("toggleReady", id);
    };

    const startGame = (id: number | undefined) => {
        socket?.emit("startGame", id, gameDataGenerator());
    };

    useEffect(() => {
        onOpen();
    }, []);

    return (
        <Modal size="full" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    {room?.name}
                </ModalHeader>
                <ModalBody>
                    <Players />
                    {room?.state === "playing" && <div>{children}</div>}
                </ModalBody>
                <ModalFooter>
                    {room?.state !== "playing" && (
                        <>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => exitRoom(room?.id)}
                            >
                                방 나가기
                            </Button>

                            {isMaster && room ? (
                                <Button
                                    color={canStart ? "primary" : "default"}
                                    onClick={() => startGame(room.id)}
                                    disabled={!canStart}
                                >
                                    {canStart ? "시작" : "기다리는 중"}
                                </Button>
                            ) : (
                                <Button
                                    color={isReady ? "primary" : "default"}
                                    onClick={() => toggleReady(room?.id)}
                                >
                                    {isReady ? "준비완료" : "준비"}
                                </Button>
                            )}
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
