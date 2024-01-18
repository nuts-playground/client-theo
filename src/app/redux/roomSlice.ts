import { createSlice } from "@reduxjs/toolkit";
import { store, type RootState } from "./store";
import { IRoom } from "@/interface/interface";
import { selectSocket } from "./socketSlice";

const initialState = {} as IRoom;

export const room = createSlice({
    name: "roomStore",
    initialState,
    reducers: {
        setRoom: (state, { payload }) => {
            Object.keys(payload).forEach((key) => {
                state[key] = payload[key];
            });
        },
        updateRoomPlayer: (state, { payload }) => {
            const playerIndex = state.players.findIndex(
                (player) => player.name === payload.name
            );
            state.players[playerIndex] = payload;
            console.log(state, "asd");
        },
    },
});

export const { setRoom, updateRoomPlayer } = room.actions;

export const selectRoom = (state: RootState) => state.roomStore;

export default room.reducer;
