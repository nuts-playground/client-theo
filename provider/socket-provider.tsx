import { SocketContext, socket } from "@/context/socket";
import { ProviderProps } from "@/types";
import { PlayersProvider } from "@/provider/players-provider";

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            <PlayersProvider>{children}</PlayersProvider>
        </SocketContext.Provider>
    );
};
