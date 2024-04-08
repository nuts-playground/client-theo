"use client";
import { Room } from "@/components/room";
import { RoomList } from "@/components/room-list";
import { RoomContext } from "@/context/room";
import { useContext } from "react";

export default () => {
    const room = useContext(RoomContext);
    return (
        <div>
            <RoomList></RoomList>
            {room?.id && <Room></Room>}
        </div>
    );
};
