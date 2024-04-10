import { User } from "@/types";
import { createContext } from "react";

export const UsersContext = createContext<User[] | null>(null);
