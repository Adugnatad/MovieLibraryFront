import axios from "axios";
import { setMovies } from "../Slices";

export const getMovies = () => {
  return async (dispatch: any) => {
    console.log("dispatch reached");
    await axios.get(`https://movielibback.vercel.app/movie`).then((res) => {
      dispatch(setMovies(res.data));
    });
  };
};
