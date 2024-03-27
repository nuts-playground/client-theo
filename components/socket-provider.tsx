import { Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

interface SocketProviderProps {
    children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    useEffect(() => {
        if (!socket) setSocket(io("http://localhost:3001"));
    }, []);
    return <div>{children}</div>;
};
