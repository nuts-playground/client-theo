import { PlayerContext } from "@/context/player";
import { Player, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const PlayerProvider = ({ children }: ProviderProps) => {
    const [player, setPlayer] = useState<Player | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("joinPlayground", (player: Player) => {
            setPlayer(player);
        });

        return () => {
            socket?.off("joinPlayground");
        };
    }, [socket]);
    return (
        <PlayerContext.Provider value={player}>
            {children}
        </PlayerContext.Provider>
    );
};
