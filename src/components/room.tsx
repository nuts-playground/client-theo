import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/redux/hook";
import { selectSocket } from "@/app/redux/socketSlice";
import { selectPlayer } from "@/app/redux/playerSlice";
import { selectRoom, setRoom } from "@/app/redux/roomSlice";
import { User, Divider, Button } from "@nextui-org/react";
import { IPlayer } from "@/interface/interface";

export const Room = () => {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [isMaster, setIsMaster] = useState<boolean>(false);

    const socket = useAppSelector(selectSocket);
    const player = useAppSelector(selectPlayer);
    const room = useAppSelector(selectRoom);

    const dispatch = useAppDispatch();

    const exitRoom = () => {
        socket.emit("exitRoom");
    };

    const readyToggle = () => {
        const playerIndex = room.players?.findIndex(
            (roomPlayer) => roomPlayer.name === player.name
        );

        dispatch(setRoom({ players: room.players }));

        socket.emit("sendRoom", room);
        setIsReady((prevIsReady) => {
            return !prevIsReady;
        });
    };

    const gameStart = () => {
        room.isStart = true;
        socket.emit("sendRoom", room);
    };

    useEffect(() => {
        if (
            Array.isArray(room.players) &&
            room.players[0]?.name === player.name
        )
            setIsMaster(true);
    }, []);

    return (
        <>
            <div className="flex items-center justify-center space-x-4 relative p-2 mb-2 bg-content1 w-[350px] max-w-full overflow-visible shadow-small rounded-medium">
                {room.players?.map((player, index: number) => {
                    return (
                        <div
                            className="flex items-center space-x-4"
                            key={index}
                        >
                            <User
                                className="text-nowrap"
                                name={player.name}
                                description={player.isReady ? "Ready!" : null}
                            />
                            {index !== room.players.length - 1 ? (
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
                        Exit
                    </Button>

                    {isMaster ? null : null}
                    <Button
                        className="w-full"
                        type="button"
                        color={
                            isReady
                                ? isMaster &&
                                  room.players?.every(
                                      (player: IPlayer) => player.isReady
                                  )
                                    ? "primary"
                                    : "success"
                                : "primary"
                        }
                        size="lg"
                        onPress={() => {
                            isMaster &&
                            room.players?.every(
                                (player: IPlayer) => player.isReady
                            )
                                ? gameStart()
                                : readyToggle();
                        }}
                    >
                        {isReady
                            ? isMaster &&
                              room.players?.every(
                                  (player: IPlayer) => player.isReady
                              )
                                ? "Start!"
                                : "OK!"
                            : "Ready"}
                    </Button>
                </div>
            )}
        </>
    );
};
