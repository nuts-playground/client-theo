import { Room } from "@/types";
import { createContext } from "react";

export const RoomsContext = createContext<Room[] | null>(null);
