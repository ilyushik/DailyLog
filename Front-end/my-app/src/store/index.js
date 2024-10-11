import {createSlice, configureStore} from '@reduxjs/toolkit';

const initialState = {mode: "Light"}

const modeSlice = createSlice({
    name: "mode",
    initialState,
    reducers: {
        lightMode: (state) => {
            state.mode = "Light"
        },
        darkMode: (state) => {
            state.mode = "Dark"
        }
    }
})

const store = configureStore({
    reducer: modeSlice.reducer
})

export const modeActions = modeSlice.actions;
export default store;