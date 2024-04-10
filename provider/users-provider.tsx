import { UsersContext } from "@/context/users";
import { User, ProviderProps } from "@/types";
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "@/context/socket";

export const UsersProvider = ({ children }: ProviderProps) => {
    const [users, setUsers] = useState<User[] | null>(null);
    const socket = useContext(SocketContext);

    useEffect(() => {
        socket?.on("userList", (users: User[]) => {
            setUsers(users);
        });

        return () => {
            socket?.off("userList");
        };
    }, [socket]);
    return (
        <UsersContext.Provider value={users}>{children}</UsersContext.Provider>
    );
};
