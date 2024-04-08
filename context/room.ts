import { Room } from "@/types";
import { createContext } from "react";

export const RoomContext = createContext<Room | null>(null);
