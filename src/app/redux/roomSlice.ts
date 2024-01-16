import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { IRoom } from "@/interface/interface";

const initialState = {
    room: {} as IRoom,
};

export const room = createSlice({
    name: "roomStore",
    initialState,
    reducers: {
        setRoom: (state, { payload }) => {
            state.room = payload.room;
        },
    },
});

export const { setRoom } = room.actions;

export const selectRoom = (state: RootState) => state.roomStore.room;

export default room.reducer;
