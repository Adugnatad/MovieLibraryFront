import React, { useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { ToastContainer } from "react-toastify";
import { injectStyle } from "react-toastify/dist/inject-style";
import { AppDispatch } from "../store";
import { useDispatch } from "react-redux";
import { getMovies } from "../store/Actions";
import { useSelector } from "react-redux";
import MovieModal from "../Components/MovieModal";
import { TableFooter, TablePagination } from "@mui/material";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import Search from "../Components/Search";
import HeaderAction from "../Components/HeaderActions";

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
  }>({ movie_name: "", duration: "", rating: "" }); // current modal being edited
  const [searchTerm, setSearchTerm] = React.useState("");
  const { movies } = useSelector((state: any) => state?.movies);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (!open) {
      dispatch(getMovies());
    }
  }, [open]);

  const handleModal = (title: string) => {
    setOpen(!open);
    setTitle(title);
  };

  const handleSearch = (search: string) => {
    setSearchTerm(search);
  };

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - movies.length) : 0;

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <main className="flex flex-col">
      <Search handleSearch={handleSearch} search={searchTerm} />

      <HeaderAction handleModal={handleModal} />
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
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
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
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                colSpan={3}
                count={movies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
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
