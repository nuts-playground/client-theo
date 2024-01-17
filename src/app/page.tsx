"use client";
import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";
import { PlayerList } from "@/components/playerList";

export default function Home() {
    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <PlayerList />
            </StatusSection>
        </>
    );
}
