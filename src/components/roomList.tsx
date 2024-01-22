import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectSocket } from "@/app/redux/socketSlice";
import { IRoom } from "@/interface/interface";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorClosed, faDoorOpen } from "@fortawesome/free-solid-svg-icons";
import { selectRooms } from "@/app/redux/roomsSlice";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    useDisclosure,
} from "@nextui-org/react";
import PopoverButton from "./popoverButton";
import { useForm } from "react-hook-form";
import { createGridBoard } from "./gameBoard";
import { Join } from "./join";

export const RoomList = () => {
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);
    const rooms = useAppSelector(selectRooms);
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const { register, handleSubmit, watch } = useForm();

    const createRoom = () => {
        onClose();
        socket.emit("createRoom", {
            name: watch("roomName"),
            player: player,
            boardData: createGridBoard(3, 3),
            currentTurn: player.name,
            winner: "",
        });
    };

    const joinRoom = (roomId: number) => {
        socket.emit("joinRoom", {
            id: roomId,
            player: player,
        });
    };

    const openCreateRoomModal = () => {
        if (player.id) {
            onOpen();
        } else {
            console.log("ss");
            socket.emit("notJoined");
        }
    };

    return (
        <>
            <Listbox
                className="mb-4 gap-0 bg-content1 overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="There are currently no rooms available. Please make a room."
            >
                {rooms.map((room: IRoom, index: number) => {
                    const isFull = Object.keys(room.players).length === 2;
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
                            description={`참가자: ${Object.keys(room.players)
                                .map((id: string) => room.players[id].name)
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

            {player.id ? (
                <Button
                    className="w-full"
                    type="button"
                    color="primary"
                    onClick={onOpen}
                    radius="full"
                    size="lg"
                >
                    Create Room
                </Button>
            ) : (
                <Join />
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        Create room
                    </ModalHeader>
                    <ModalBody className="pb-4">
                        <form
                            className="flex space-x-1 h-12"
                            onSubmit={handleSubmit(createRoom)}
                        >
                            <Input
                                className="w-80"
                                color="primary"
                                placeholder="Enter your name"
                                radius="full"
                                size="sm"
                                {...register("roomName")}
                            />
                            <PopoverButton
                                condition={watch("roomName")}
                                buttonText="Create"
                                popoverTitle="The room name is empty."
                                popoverText="Please enter room name for multiplayer."
                                type="submit"
                            />
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};