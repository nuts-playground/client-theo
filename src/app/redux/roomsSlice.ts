import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Rooms } from "@/interface/interface";

const initialState = {
    rooms: {} as Rooms,
};

export const rooms = createSlice({
    name: "roomsStore",
    initialState,
    reducers: {
        setRooms: (state, { payload }) => {
            state.rooms = payload.rooms;
        },
    },
});

export const { setRooms } = rooms.actions;

export const selectRooms = (state: RootState) => state.roomsStore.rooms;

export default rooms.reducer;
