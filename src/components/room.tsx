import { useAppSelector, useAppDispatch } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectPlayer, setPlayer } from "@/app/redux/playerSlice";
import { selectRoom } from "@/app/redux/roomSlice";
import { User, Divider, Button } from "@nextui-org/react";

export const Room = () => {
    const socket = useAppSelector(selectSocket);
    const player = useAppSelector(selectPlayer);
    const room = useAppSelector(selectRoom);
    const dispatch = useAppDispatch();

    const exitRoom = () => {
        socket.emit("exitRoom");
        console.log("skrkffo");
    };

    const readyToggle = () => {
        socket.emit("ready", !player.isReady);
        dispatch(setPlayer({ isReady: !player.isReady }));
    };

    const gameStart = () => {
        const newRoom = { ...room, isStart: true };
        socket.emit("sendRoom", newRoom);
    };

    return (
        <>
            <div className="flex items-center justify-center space-x-4 relative p-2 mb-2 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium">
                {Object.keys(room.players).map((id, index) => {
                    return (
                        <div
                            className="flex items-center space-x-4"
                            key={index}
                        >
                            <User
                                className="text-nowrap"
                                name={room.players[id].name}
                                description={
                                    room.players[id].isReady ? "Ready!" : null
                                }
                            />
                            {index !== Object.keys(room.players).length - 1 ? (
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
                        방 나가기
                    </Button>

                    <Button
                        className="w-full"
                        type="button"
                        color={
                            player.isReady
                                ? player.name === room.master &&
                                  Object.keys(room.players).every(
                                      (id) => room.players[id].isReady
                                  )
                                    ? "primary"
                                    : "success"
                                : "primary"
                        }
                        size="lg"
                        onPress={() => {
                            player.name === room.master &&
                            Object.keys(room.players).every(
                                (id) => room.players[id].isReady
                            )
                                ? gameStart()
                                : readyToggle();
                        }}
                    >
                        {player.isReady
                            ? player.name === room.master &&
                              Object.keys(room.players).every(
                                  (id) => room.players[id].isReady
                              )
                                ? "시작"
                                : "준비 완료!"
                            : "준비"}
                    </Button>
                </div>
            )}
        </>
    );
};
