"use client";
import { PlayerList } from "@/components/playerList";
import { Join } from "@/components/join";
import { useAppSelector } from "./redux/hook";
import { selectPlayer } from "./redux/playerSlice";
import StatusSection from "@/components/statusSection";

export default function Home() {
    const player = useAppSelector(selectPlayer);
    return (
        <div className="flex justify-between h-full px-6 max-w-screen-xl">
            <div className="flex flex-col justify-center mr-10">
                <p className="mb-6 text-5xl font-bold leading-tight tracking-tight">
                    Play games with other people in{" "}
                    <span className="text-blue-600">real time</span> at Theo
                    Playground
                </p>
                <p className="mb-4 text-gray-400">
                    Made by THEO(MY NAME IS HOMIN)
                </p>
                {player.id ? null : <Join />}
            </div>
            {/* <GameSection>
                <GameList />
            </GameSection> */}
            <StatusSection title="ONLINE PLAYERS">
                <PlayerList />
            </StatusSection>
        </div>
    );
}
