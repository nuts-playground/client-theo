import { PlayersContext } from "@/context/players";
import { Player, ProviderProps } from "@/types";
import { useContext, useState } from "react";
import { SocketContext } from "@/context/socket";

export const PlayersProvider = ({ children }: ProviderProps) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const socket = useContext(SocketContext);
    console.log("ㄴㄴ");
    socket?.on("sendPlayers", (players: Player[]) => {
        console.log("ss");
        setPlayers(players);
    });
    return (
        <PlayersContext.Provider value={players}>
            {children}
        </PlayersContext.Provider>
    );
};
