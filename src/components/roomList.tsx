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
    ModalFooter,
    Input,
    useDisclosure,
} from "@nextui-org/react";
import PopoverButton from "./popoverButton";
import { selectJoinModal } from "@/app/redux/joinModalSlice";
import { useForm } from "react-hook-form";
import { createGridBoard } from "./gameBoard";

export const RoomList = () => {
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);
    const rooms = useAppSelector(selectRooms);
    const joinModal = useAppSelector(selectJoinModal);
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

    return (
        <>
            <Listbox
                className="mb-2 gap-0 bg-content1 overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="There are currently no rooms available. Please make a room."
            >
                {rooms.map((room: IRoom, index: number) => {
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
            {player.id ? (
                <Button
                    className="w-full"
                    type="button"
                    color="primary"
                    onClick={onOpen}
                >
                    Create Room
                </Button>
            ) : (
                <Button
                    className="w-full"
                    type="button"
                    color="primary"
                    onClick={() => {
                        joinModal.onOpen();
                    }}
                >
                    Create Room
                </Button>
            )}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
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
                            placeholder="Please enter the room name"
                            {...register("roomName")}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <PopoverButton
                            condition={watch("roomName")}
                            onClick={createRoom}
                            buttonText="Create"
                            popoverTitle="The room name is empty."
                            popoverText="Please enter room name for multiplayer."
                        />
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};
