"use client";
// import type { Metadata } from "next";
import { Orbit } from "next/font/google";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { useAppDispatch } from "./redux/hook";
import { setPlayer } from "./redux/playerSlice";
import { setSocket } from "./redux/socketSlice";
import { setPlayers } from "./redux/playersSlice";
import { setRooms } from "./redux/roomsSlice";
import { setRoom } from "./redux/roomSlice";
import { Header } from "@/components/layout/header";
import { Room } from "@/types";
import "./globals.css";

const orbit = Orbit({
    subsets: ["latin"],
    weight: ["400"],
});

const App = ({ children }: { children: React.ReactNode }) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const socket = io("http://localhost:3001");
        socket.on("joinPlayground", (player) => {
            if (player) {
                dispatch(setPlayer(player));
            } else {
                alert("이미 존재하는 이름입니다.");
            }
        });
        socket.on("sendPlayers", (players) => {
            dispatch(setPlayers({ players: players }));
        });
        socket.emit("getPlayers");
        socket.on("sendRoom", (room: Room) => {
            dispatch(setRoom(room));
            socket.emit("updateRoom", room);
        });
        socket.on("sendRooms", (rooms) => {
            dispatch(setRooms({ rooms: rooms }));
        });
        dispatch(
            setSocket({
                socket: socket,
            })
        );
    }, []);
    return <div className="flex w-full grow justify-center">{children}</div>;
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko" className="dark">
            <head>
                <title>Theo Playground</title>
            </head>
            <body className={orbit.className}>
                <NextUIProvider>
                    <Provider store={store}>
                        <div className="flex items-center flex-col bg-background">
                            <Header />
                            <main className="flex justify-between w-full h-full px-6 max-w-screen-xl">
                                <App>{children}</App>
                            </main>
                        </div>
                    </Provider>
                </NextUIProvider>
            </body>
        </html>
    );
}
