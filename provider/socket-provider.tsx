import { SocketContext, socket } from "@/context/socket";
import { ProviderProps } from "@/types";
import { PlayersProvider } from "@/provider/players-provider";
import { PlayerProvider } from "./player-provider";
import { RoomsProvider } from "./rooms-provider";
import { RoomProvider } from "./room-provider";

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            <PlayerProvider>
                <PlayersProvider>
                    <RoomsProvider>
                        <RoomProvider>{children}</RoomProvider>
                    </RoomsProvider>
                </PlayersProvider>
            </PlayerProvider>
        </SocketContext.Provider>
    );
};
