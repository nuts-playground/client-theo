"use client";
import { Room } from "@/components/room";
import { RoomList } from "@/components/room-list";
import { RoomContext } from "@/context/room";
import { useContext } from "react";
import { Card } from "@nextui-org/react";
import { SocketContext } from "@/context/socket";
import { PlayerContext } from "@/context/player";

export interface BoardCell {
    player: string;
    value: boolean;
}

const GameBoard = () => {
    const room = useContext(RoomContext);
    const socket = useContext(SocketContext);
    const player = useContext(PlayerContext);

    const onMark = (x: number, y: number) => {
        if (room && player && socket) {
            const data = [...room.data];
            data[y][x] = {
                player: player.name,
                value: true,
            };

            socket.emit("updateGameData", data, room.id);
        }
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {room &&
                (room.data as BoardCell[][]).map((row, y) => {
                    return (
                        <>
                            {row.map((cell, x) => {
                                return (
                                    <Card
                                        key={`${y}, ${x}`}
                                        isFooterBlurred
                                        radius="lg"
                                        className="relative w-full pb-[100%] bg-gray-600"
                                    >
                                        <div
                                            className="absolute inset-0"
                                            onClick={() => onMark(x, y)}
                                        >
                                            {cell.player}
                                        </div>
                                    </Card>
                                );
                            })}
                        </>
                    );
                })}
        </div>
    );
};

export default () => {
    const room = useContext(RoomContext);
    return (
        <div>
            <RoomList></RoomList>
            {room?.id && (
                <Room>
                    <GameBoard />
                </Room>
            )}
        </div>
    );
};
