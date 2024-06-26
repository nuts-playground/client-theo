import { SocketContext, socket } from "@/context/socket";

interface ProviderProps {
    children: React.ReactNode;
}

export const SocketProvider = ({ children }: ProviderProps) => {
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};
