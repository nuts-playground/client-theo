import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface IJoinModal {
    onOpen: () => void;
    onClose: () => void;
    onOpenChange: () => void;
}

const initialState = {} as IJoinModal;

export const joinModal = createSlice({
    name: "joinModal",
    initialState,
    reducers: {
        setJoinModal: (state, { payload }) => {
            state.onOpen = payload.onOpen;
            state.onClose = payload.onClose;
            state.onOpenChange = payload.onOpenChange;
        },
    },
});

export const { setJoinModal } = joinModal.actions;

export const selectJoinModal = (state: RootState) => state.joinModal;

export default joinModal.reducer;
