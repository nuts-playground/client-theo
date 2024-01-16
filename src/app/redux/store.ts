import { configureStore } from "@reduxjs/toolkit";
import playerSlice from "./playerSlice";
import socketSlice from "./socketSlice";

export const store = configureStore({
    reducer: {
        player: playerSlice,
        socketStore: socketSlice,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
