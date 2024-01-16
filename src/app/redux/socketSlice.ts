import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Socket } from "socket.io-client";

const initialState = {
    socket: {} as Socket,
};

export const socket = createSlice({
    name: "socketStore",
    initialState,
    reducers: {
        setSocket: (state, { payload }) => {
            state.socket = payload.socket;
        },
    },
});

export const { setSocket } = socket.actions;

export const selectSocket = (state: RootState) => state.socketStore.socket;

export default socket.reducer;
