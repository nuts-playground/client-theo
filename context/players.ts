import { Player } from "@/types";
import { createContext } from "react";

export const PlayersContext = createContext<Player[] | null>(null);
