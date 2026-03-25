import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    isAuthticated: false,
    loading: true
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthticated = true;
            state.loading = false
        },
        clearUser: (state, action) => {
            state.user = null;
            state.isAuthticated = false;
            state.loading = false
        },
    },

    selectors: {
        selectUser: (sliceState) => sliceState
    }
})

export const { selectUser } = authSlice.selectors;

export const { setUser, clearUser } = authSlice.actions;

export default authSlice.reducer;