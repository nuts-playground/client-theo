import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { Room, Rooms } from "@/types";

const initialState = {
    rooms: [] as Room[],
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
