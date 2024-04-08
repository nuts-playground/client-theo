import { RoomsContext } from "@/context/rooms";
import { Room, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const RoomsProvider = ({ children }: ProviderProps) => {
    const [rooms, setrooms] = useState<Room[] | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("sendRooms", (rooms: Room[]) => {
            console.log("dd");
            setrooms(rooms);
        });

        return () => {
            socket?.off("sendRooms");
        };
    }, [socket]);
    return (
        <RoomsContext.Provider value={rooms}>{children}</RoomsContext.Provider>
    );
};
