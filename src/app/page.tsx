"use client";
import { PlayerList } from "@/components/playerList";
import { Join } from "@/components/join";

export default function Home() {
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
                <Join />
            </div>
            {/* <GameSection>
                <GameList />
            </GameSection> */}
            <section className="flex flex-col justify-center">
                <h2 className="mb-4 text-2xl font-bold">ONLINE PLAYERS</h2>
                <PlayerList />
            </section>
        </div>
    );
}
