import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  movies: [],
};

const movieSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    setMovies: (state, { payload }) => {
      state.movies = payload;
    },
  },
});

const { reducer, actions } = movieSlice;
export const { setMovies } = actions;
export default reducer;
