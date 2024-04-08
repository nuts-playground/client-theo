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
    Popover,
    PopoverTrigger,
    User,
    PopoverContent,
    ButtonGroup,
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

    const joinRoom = (roomId: number) => {
        socket?.emit("joinRoom", { id: roomId });
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
                            key={index}
                            onClick={() => {
                                if (player?.id) {
                                    joinRoom(room?.id);
                                }
                            }}
                        >
                            {room.name}
                            {/* <Popover showArrow placement="bottom">
                                <PopoverTrigger>
                                    <Button
                                        className="flex justify-start w-full font-bold"
                                        color="default"
                                    >
                                        {room.name}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-1">
                                    <ButtonGroup>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            따라가기
                                        </Button>
                                        <Button
                                            color="primary"
                                            type="button"
                                            size="sm"
                                        >
                                            메시지 보내기
                                        </Button>
                                    </ButtonGroup>
                                </PopoverContent>
                            </Popover> */}
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
