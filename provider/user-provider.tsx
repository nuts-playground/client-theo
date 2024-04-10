import { UserContext } from "@/context/user";
import { User, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const UserProvider = ({ children }: ProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("registerUser", (user: User) => {
            setUser(user);
        });

        return () => {
            socket?.off("registerUser");
        };
    }, [socket]);
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};
