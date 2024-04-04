import { SocketContext, socket } from "@/context/socket";
import { ProviderProps } from "@/types";
import { PlayersProvider } from "@/provider/players-provider";
import { PlayerProvider } from "./player-provider";
import { RoomsProvider } from "./rooms-provider copy";

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            <PlayerProvider>
                <PlayersProvider>
                    <RoomsProvider>{children}</RoomsProvider>
                </PlayersProvider>
            </PlayerProvider>
        </SocketContext.Provider>
    );
};
