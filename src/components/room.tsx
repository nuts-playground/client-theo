import { useAppSelector } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectPlayer, setPlayer } from "@/app/redux/playerSlice";
import { selectRoom } from "@/app/redux/roomSlice";
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
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserLarge } from "@fortawesome/free-solid-svg-icons";

export const Room = () => {
    const socket = useAppSelector(selectSocket);
    const player = useAppSelector(selectPlayer);
    const room = useAppSelector(selectRoom);
    const master = room.players.filter((player) => player.isMaster)[0];

    const [isReady, setIsReady] = useState<boolean>(false);

    const { isOpen, onOpen, onClose } = useDisclosure();

    const exitRoom = (id: number) => {
        socket.emit("exitRoom", id);
        onClose();
    };

    const toggleReady = (id: number) => {
        setIsReady((prev) => !prev);
        socket.emit("toggleReady", id);
    };

    const startGame = (id: number) => {
        socket.emit("startGame", id);
    };

    useEffect(() => {
        onOpen();
    }, []);

    return (
        <Modal size="full" isOpen={isOpen} onClose={onClose}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            {room.name}
                        </ModalHeader>
                        <ModalBody>
                            <div className="flex p-2 border-2 space-x-2 border-purple-900 rounded-2xl">
                                {room.players.map((player) => {
                                    return (
                                        <Card
                                            isFooterBlurred
                                            radius="lg"
                                            className={`w-40 h-40 border-1 ${
                                                player.ready
                                                    ? "border-white"
                                                    : "border-transparent"
                                            }`}
                                        >
                                            <div className="w-full h-full p-10 bg-purple-900">
                                                <FontAwesomeIcon
                                                    className="w-full h-full"
                                                    icon={faUserLarge}
                                                />
                                            </div>
                                            <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
                                                <p className="text-tiny text-white/80">
                                                    {player.name}
                                                </p>
                                                <Chip
                                                    size="sm"
                                                    color={
                                                        player.ready
                                                            ? "primary"
                                                            : "default"
                                                    }
                                                >
                                                    {player.ready
                                                        ? "준비완료"
                                                        : "대기중"}
                                                </Chip>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={() => exitRoom(room.id)}
                            >
                                방 나가기
                            </Button>

                            {master.name === player.name ? (
                                <div>
                                    {room.players.every(
                                        (player) => player.ready
                                    ) ? (
                                        <Button
                                            color="success"
                                            onClick={() => toggleReady(room.id)}
                                        >
                                            시작
                                        </Button>
                                    ) : (
                                        <Button
                                            color={
                                                isReady ? "success" : "primary"
                                            }
                                            onClick={() => toggleReady(room.id)}
                                        >
                                            {isReady ? "준비완료" : "준비"}
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <Button
                                    color={isReady ? "success" : "primary"}
                                    onClick={() => toggleReady(room.id)}
                                >
                                    {isReady ? "준비완료" : "준비"}
                                </Button>
                            )}
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
