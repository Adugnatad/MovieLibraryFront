import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { AiFillPlusCircle } from "react-icons/ai";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { getMovies } from "../store/Actions";
import { useSelector } from "react-redux";
import MovieModal from "../Components/MovieModal";

if (typeof window !== "undefined") {
  injectStyle();
}

export default function Landing() {
  const [open, setOpen] = React.useState(false); // modal state controller
  const [title, setTitle] = React.useState("Add");
  const [id, setId] = React.useState<Number>();
  const [currentMovie, setCurrentMovie] = React.useState<{
    movie_name: "";
    duration: "";
    rating: "";
  }>(); // current modal being edited
  const [searchTerm, setSearchTerm] = React.useState("");
  const { movies } = useSelector((state: any) => state?.movies);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      dispatch(getMovies());
    }
  }, [open]);

  const generateFile = (format: string) => {
    if (format === "csv" || format === "txt") {
      // Prepare the content based on the selected format
      let content = "";
      if (format === "csv") {
        content = "Name,Duration (hours),Rating\n";
      }

      movies.forEach((movie: any) => {
        if (format === "csv") {
          content += `${movie.movie_name},${parseFloat(movie.duration).toFixed(
            2
          )},${movie.rating}\n`;
        } else if (format === "txt") {
          content += `${movie.movie_name}, Duration: ${movie.duration}, Rating: ${movie.rating}\n`;
        }
      });

      // Create a Blob with the content
      const blob = new Blob([content], {
        type: `text/${format};charset=utf-8`,
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `movie_data.${format}`;
      link.click();
    }
  };

  return (
    <main className="flex flex-col">
      <div className="search-header ">
        <input
          type="text"
          className="search-bar bg-blue-100 "
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="search-button">Search</button>
      </div>
      <div className="my-5 px-5 flex flex-wrap space-y-2 items-center justify-between self-center w-[90%]">
        <div className="group bg-blue-100 py-2 px-2 rounded-lg">
          <span className="text-[#000] cursor-pointer hover:text-[#FAC433] duration-200">
            Download Data
          </span>
          <div className="flex flex-col min-w-[180px] w-[200px] py-2  text-black bg-black opacity-0 absolute px-3 duration-500 group-hover:opacity-100">
            <div className="flex flex-col items-center justify-between  group ">
              <button
                onClick={() => generateFile("csv")}
                className="my-2 text-[16px] text-[#fff] font-medium hover:text-[#FAC433]"
              >
                Download CSV
              </button>
              <button
                onClick={() => generateFile("txt")}
                className="my-2 text-[16px] text-[#fff] font-medium  hover:text-[#FAC433]"
              >
                Download TXT
              </button>
            </div>
          </div>
        </div>
        <div
          onClick={() => {
            setOpen(true);
            setTitle("Add");
          }}
          className="cursor-pointer flex flex-row space-x-3 py-1 px-2 rounded-lg bg-blue-100 justify-center items-center w-fit"
        >
          <span className="text-[18px] font-medium">Add a movie</span>
          <AiFillPlusCircle size={30} />
        </div>
      </div>
      <TableContainer
        component={Paper}
        style={{ width: "90%", alignSelf: "center" }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Movie Name</TableCell>
              <TableCell align="right">Duration (Hours)</TableCell>
              <TableCell align="right">Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies
              .filter((movies: any) =>
                movies.movie_name
                  .toUpperCase()
                  .startsWith(searchTerm.toUpperCase())
              )
              .map((movie: any) => (
                <TableRow
                  key={movie.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  className="cursor-pointer"
                  onClick={() => {
                    setTitle("Edit");
                    setOpen(true);
                    setId(movie.id);
                    setCurrentMovie(movie);
                  }}
                >
                  <TableCell component="th" scope="row">
                    {movie.movie_name}
                  </TableCell>
                  <TableCell align="right">{movie.duration}</TableCell>
                  <TableCell align="right">{movie.rating}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {open && (
        <MovieModal
          open={open}
          onRequestClose={() => {
            setOpen(false);
            setCurrentMovie({ movie_name: "", duration: "", rating: "" });
          }}
          title={title}
          id={id}
          movie={currentMovie}
        />
      )}
    </main>
  );
}
