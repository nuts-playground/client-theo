import { SocketContext, socket } from "@/context/socket";
import { ProviderProps } from "@/types";
import { PlayersProvider } from "@/provider/players-provider";
import { PlayerProvider } from "./player-provider";

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            <PlayerProvider>
                <PlayersProvider>{children}</PlayersProvider>
            </PlayerProvider>
        </SocketContext.Provider>
    );
};
