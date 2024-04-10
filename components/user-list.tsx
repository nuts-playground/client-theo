"use client";
import { UsersContext } from "@/context/users";
import { useContext } from "react";
import { Listbox, ListboxItem } from "@nextui-org/react";

export const UserList = () => {
    const users = useContext(UsersContext);
    console.log(users, "ss");
    return (
        <Listbox>
            {(users || []).map((user) => {
                return <ListboxItem key={user.id}>{user.username}</ListboxItem>;
            })}
        </Listbox>
    );
};
