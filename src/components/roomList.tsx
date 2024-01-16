import { useAppSelector } from "@/app/redux/hook";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectSocket } from "@/app/redux/socketSlice";
import { IRoom } from "@/interface/interface";
import { Listbox, ListboxItem } from "@nextui-org/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDoorClosed, faDoorOpen } from "@fortawesome/free-solid-svg-icons";

export const RoomList = ({ rooms }: { rooms: IRoom[] }) => {
    const player = useAppSelector(selectPlayer);
    const socket = useAppSelector(selectSocket);

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
    );
};
