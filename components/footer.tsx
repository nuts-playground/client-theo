"use client";
import { Join } from "./join";
import { useContext } from "react";
import { UserContext } from "@/context/user";
import { Chat } from "@/components/chat";

export const Footer = () => {
    return (
        <footer className="relative h-64 shrink-0">
            <Join />
            <Chat />
        </footer>
    );
};
