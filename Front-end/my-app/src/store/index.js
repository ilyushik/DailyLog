import { createSlice } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';

const initialState = {
    theme: localStorage.getItem('theme') || 'light',
    username: localStorage.getItem('username') || '',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', state.theme);
        },
        setTheme: (state, action) => {
            state.theme = action.payload;
            localStorage.setItem('theme', state.theme);
        },
        setUsername: (state, action) => {
            state.username = action.payload;
            localStorage.setItem('username', state.username);
        },
    },
});

const store = configureStore({
    reducer: {
        theme: themeSlice.reducer,
    },
});

export default store;

export const { toggleTheme, setTheme, setUsername } = themeSlice.actions; // добавлено setUsername
