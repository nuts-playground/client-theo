"use client";
import { Join } from "./join";
import { useContext } from "react";
import { PlayerContext } from "@/context/player";
import { Chat } from "@/components/chat";

export const Footer = () => {
    const player = useContext(PlayerContext);
    return (
        <footer>
            <Join />
            <Chat />
        </footer>
    );
};
