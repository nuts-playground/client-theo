"use client";
import GameSection from "@/components/gameSection";
import GameList from "@/components/gameList";
import StatusSection from "@/components/statusSection";
import { useAppSelector } from "./redux/hook";
import { selectPlayer } from "./redux/playerSlice";
import { JoinModal } from "@/components/joinModal";
import { selectPlayers } from "./redux/playersSlice";
import { PlayerList } from "@/components/playerList";

export default function Home() {
    const player = useAppSelector(selectPlayer);
    const players = useAppSelector(selectPlayers);

    return (
        <>
            <GameSection>
                <GameList />
            </GameSection>
            <StatusSection>
                <>
                    <PlayerList players={players} />
                    {player.id ? null : <JoinModal />}
                </>
            </StatusSection>
        </>
    );
}
