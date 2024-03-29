import { PlayersContext } from "@/context/players";
import { Player, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const PlayersProvider = ({ children }: ProviderProps) => {
    const [players, setPlayers] = useState<Player[] | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("sendPlayers", (players: Player[]) => {
            setPlayers(players);
        });

        return () => {
            socket?.off("sendPlayers");
        };
    }, [socket]);
    return (
        <PlayersContext.Provider value={players}>
            {children}
        </PlayersContext.Provider>
    );
};
