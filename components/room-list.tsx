"use client";
import {
    Button,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    Input,
    useDisclosure,
    Listbox,
    ListboxItem,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@nextui-org/react";
import { useContext, useEffect } from "react";
import { PlayerContext } from "@/context/player";
import { useForm } from "react-hook-form";
import { SocketContext } from "@/context/socket";
import { RoomsContext } from "@/context/rooms";
import { Player, Room } from "@/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorClosed, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

export const RoomList = () => {
    const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();
    const player = useContext(PlayerContext);
    const socket = useContext(SocketContext);
    const rooms = useContext(RoomsContext);
    const isLogin = Boolean(player?.id);
    const { register, handleSubmit, watch } = useForm();

    const createRoom = () => {
        const room = {
            name: watch("roomName"),
            game: {
                name: "틱택토",
            },
        };

        onClose();
        socket?.emit("createRoom", room);
    };

    useEffect(() => {
        socket?.emit("getRooms", "틱택토");
    }, [socket]);

    return (
        <div className="w-full">
            <Listbox
                className="mb-4 gap-0 bg-content1 overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="방이 없습니다."
            >
                {(rooms || []).map((room: Room, index: number) => {
                    const isFull = room.players.length === 2;
                    return (
                        <ListboxItem
                            className="p-0"
                            key={index}
                            onClick={() => {
                                if (player?.id) {
                                    // joinRoom(room.id);
                                }
                            }}
                        >
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button className="w-full">
                                        {room.name}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Static Actions">
                                    <DropdownItem key="new">
                                        New file
                                    </DropdownItem>
                                    <DropdownItem key="copy">
                                        Copy link
                                    </DropdownItem>
                                    <DropdownItem key="edit">
                                        Edit file
                                    </DropdownItem>
                                    <DropdownItem
                                        key="delete"
                                        className="text-danger"
                                        color="danger"
                                    >
                                        Delete file
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ListboxItem>
                    );
                })}
            </Listbox>
            <Button
                className="w-full"
                type="button"
                color="primary"
                onClick={onOpen}
                isDisabled={!isLogin}
            >
                방 생성
            </Button>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="sm">
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">
                        방 생성
                    </ModalHeader>
                    <ModalBody className="pt-0 pb-6">
                        <form
                            className="flex items-end"
                            onSubmit={handleSubmit(createRoom)}
                        >
                            <Input
                                color="primary"
                                label="방 제목"
                                placeholder="나랑 한 판 붙자!"
                                size="sm"
                                variant="underlined"
                                {...register("roomName")}
                            />

                            <Button
                                className="sm:w-20"
                                size="sm"
                                type="submit"
                                isDisabled={!Boolean(watch("roomName"))}
                                color={
                                    !Boolean(watch("roomName"))
                                        ? "default"
                                        : "primary"
                                }
                            >
                                만들기
                            </Button>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </div>
    );
};
