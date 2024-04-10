import { GameTypeContext } from "@/context/gameType";
import { GameType, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const GameTypeProvider = ({ children }: ProviderProps) => {
    const [gameType, setGameType] = useState<GameType[] | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("registerUser", (gameType: GameType[]) => {
            setGameType(gameType);
        });

        return () => {
            socket?.off("registerUser");
        };
    }, [socket]);
    return (
        <GameTypeContext.Provider value={gameType}>
            {children}
        </GameTypeContext.Provider>
    );
};
