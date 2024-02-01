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

interface IGameList {
    game: string;
}

export const RoomList = ({ game }: IGameList) => {
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
            game: game,
        });
    };

    const joinRoom = (roomId: number) => {
        socket.emit("joinRoom", {
            id: roomId,
            player: player,
            game: game,
        });
    };

    return (
        <>
            <Listbox
                className="mb-4 gap-0 bg-content1 overflow-visible shadow-small rounded-medium"
                aria-label="Actions"
                emptyContent="현재는 방이 없습니다. 방을 만들어주세요."
            >
                {rooms[game]?.map((room: IRoom, index: number) => {
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
                                if (player.id) {
                                    joinRoom(room.id);
                                }
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
                    방 생성
                </Button>
            ) : (
                <Join />
            )}

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
        </>
    );
};
