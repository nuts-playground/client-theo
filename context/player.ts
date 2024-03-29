import { Player } from "@/types";
import { createContext } from "react";

export const PlayerContext = createContext<Player | null>(null);
