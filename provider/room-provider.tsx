import { RoomContext } from "@/context/room";
import { Room, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const RoomProvider = ({ children }: ProviderProps) => {
    const [room, setroom] = useState<Room | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("sendRoom", (room: Room) => {
            console.log("dd");
            setroom(room);
        });

        return () => {
            socket?.off("sendRoom");
        };
    }, [socket]);
    return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};
