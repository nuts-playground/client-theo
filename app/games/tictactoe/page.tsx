"use client";
import { Room } from "@/components/room";
import { RoomList } from "@/components/room-list";
import { RoomContext } from "@/context/room";
import { useContext } from "react";
import { Card } from "@nextui-org/react";
import { SocketContext } from "@/context/socket";
import { UserContext } from "@/context/user";

interface GameData {
    turn: number;
    board: BoardCell[][];
}

interface BoardCell {
    player: string;
    value: boolean;
}

const createGameData = () => {
    const board = [];
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push({ player: "", marker: false });
        }
        board.push(row);
    }
    return {
        turn: 0,
        board,
    };
};

const GameBoard = () => {
    const room = useContext(RoomContext);
    const socket = useContext(SocketContext);
    const user = useContext(UserContext);

    const onMark = (x: number, y: number) => {
        if (!(room && user && socket)) return false;
        if (user.username !== room.players[room.data.turn].name) return false;

        const data: GameData = { ...room.data };
        data.turn = room.players.length - 1 === data.turn ? 0 : ++data.turn;
        data.board[y][x] = {
            player: player.name,
            value: true,
        };

        socket.emit("updateGameData", data, room.id);
    };

    return (
        <div className="grid grid-cols-3 gap-4">
            {room &&
                (room.data as GameData).board.map((row, y) => {
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
                <Room gameDataGenerator={createGameData}>
                    <GameBoard />
                </Room>
            )}
        </div>
    );
};
