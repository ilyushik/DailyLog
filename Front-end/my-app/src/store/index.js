// import {createSlice, configureStore} from '@reduxjs/toolkit';
//
// const initialState = {mode: "Light"}
//
// const modeSlice = createSlice({
//     name: "mode",
//     initialState,
//     reducers: {
//         lightMode: (state) => {
//             state.mode = "Light"
//         },
//         darkMode: (state) => {
//             state.mode = "Dark"
//         }
//     }
// })
//
// const store = configureStore({
//     reducer: modeSlice.reducer
// })
//
// export const modeActions = modeSlice.actions;
// export default store;

// themeSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    theme: localStorage.getItem('theme') || 'light', // Изначальное значение из localStorage
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme); // Сохраняем выбранную тему в localStorage
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
        },
    },
});

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    },
});


export default store;

export const { toggleTheme, setTheme } = themeSlice.actions;

