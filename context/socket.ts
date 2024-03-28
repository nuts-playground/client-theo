import { createContext } from "react";
import io from "socket.io-client";
import { siteConfig } from "@/config/site";
import { Socket } from "socket.io-client";

export const socket: Socket = io(siteConfig.socketUrl);
export const SocketContext = createContext<Socket | null>(null);
