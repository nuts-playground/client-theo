"use client";
import GameList from "@/components/gameList";
import { selectSocket } from "@/app/redux/socketSlice";
import { useAppSelector } from "@/app/redux/hook";
import { useEffect } from "react";

export default () => {
    const socket = useAppSelector(selectSocket);

    useEffect(() => {
        if (Object.keys(socket).length) {
            socket.emit("updateLocation", "게임리스트");
        }
    }, []);
    return (
        <div className="grow pt-10">
            <GameList />
        </div>
    );
};
