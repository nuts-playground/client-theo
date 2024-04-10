import { SocketContext, socket } from "@/context/socket";
import { ProviderProps } from "@/types";
import { UsersProvider } from "@/provider/users-provider";
import { UserProvider } from "./user-provider";
import { RoomsProvider } from "./rooms-provider";
import { RoomProvider } from "./room-provider";

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            <UserProvider>
                <UsersProvider>
                    <RoomsProvider>
                        <RoomProvider>{children}</RoomProvider>
                    </RoomsProvider>
                </UsersProvider>
            </UserProvider>
        </SocketContext.Provider>
    );
};
