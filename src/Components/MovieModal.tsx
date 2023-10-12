import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import axios from "axios";
import { toast } from "react-toastify";

import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function MovieModal({
  open,
  onRequestClose,
  title,
  id,
  movie,
}: any) {
  type data = {
    movie_name: string;
    duration: string;
    rating: string;
  };
  const handleSubmit = (data: data) => {
    title == "Add"
      ? axios
          .post("https://movielibback.vercel.app/movie", data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toast.success("Movie added successfully", {
              position: toast.POSITION.TOP_RIGHT,
              onClose: () => {
                onRequestClose();
              },
            });
          })
          .catch((err) => {
            toast.error(err.message, {
              position: toast.POSITION.TOP_RIGHT,
              onClose: () => {
                onRequestClose();
              },
            });
          })
      : axios
          .put(`https://movielibback.vercel.app/movie/${id}`, data, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then((res) => {
            toast.success("Movie edited successfully", {
              position: toast.POSITION.TOP_RIGHT,
              onClose: () => {
                onRequestClose();
              },
            });
          })
          .catch((err) => {
            toast.error(err.message, {
              position: toast.POSITION.TOP_RIGHT,
              onClose: () => {
                onRequestClose();
              },
            });
          });
  };
  const handleDelete = (id: number) => {
    axios
      .delete(`https://movielibback.vercel.app/movie/${id}`)
      .then(() => {
        toast.success("Movie deleted successfully", {
          position: toast.POSITION.TOP_RIGHT,
          onClose: () => {
            onRequestClose();
          },
        });
      })
      .catch((err) => {
        toast.error(err.message, {
          position: toast.POSITION.TOP_RIGHT,
          onClose: () => {
            onRequestClose();
          },
        });
      });
  };

  const movieSchema = Yup.object().shape({
    movieName: Yup.string()
      .min(2, "Minimum 2 characters!")
      .max(100, "Maximum 100 characters!")
      .required("Required"),
    duration: Yup.string()
      .test(
        "is-duration",
        "Invalid duration format must be xh or xm",
        (value) => {
          const durationRegex = /^(\d+(\.\d+)?h|\d+(\.\d+)?m)$/;

          if (!durationRegex.test(value || "")) {
            return false;
          }

          const numericValue = parseFloat(value || "");

          if (value?.endsWith("h")) {
            return numericValue >= 0.1 && numericValue <= 12;
          } else if (value?.endsWith("m")) {
            return numericValue >= 1 && numericValue <= 720;
          }

          return false;
        }
      )
      .required("Required"),
    rating: Yup.number()
      .min(0, "invalid rating less than minimum!")
      .max(10, "invalid rating, maximum 10!")
      .required("Required"),
  });

  const initialValues: { movieName: string; duration: string; rating: string } =
    {
      movieName: movie.movie_name,
      duration: movie.duration,
      rating: movie.rating,
    };

  return (
    <div>
      <Modal
        open={open}
        onClose={onRequestClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={movieSchema}
          onSubmit={(values) => {
            handleSubmit({
              movie_name: values.movieName,
              duration: values.duration,
              rating: values.rating,
            });
          }}
        >
          {({ errors, touched }) => (
            <Box sx={style}>
              <div className="flex justify-center">
                <h1 className="text-[25px]">{title} a movie</h1>
              </div>
              <Form>
                <div className="flex flex-col my-3">
                  <label>Movie Name</label>
                  <Field
                    type="text"
                    name="movieName"
                    // placeholder="Movie Name"
                    className="border-[1px] mt-2 px-2 py-2 min-w-[300px]"
                  />
                  <span className="text-red-500 mt-2">
                    {errors.movieName && touched.movieName && errors.movieName}
                  </span>
                </div>
                <div className="flex flex-col my-3">
                  <label>Movie Duration</label>
                  <Field
                    type="text"
                    name="duration"
                    // placeholder="Movie Name"
                    className="border-[1px] mt-2 px-2 py-2 min-w-[300px]"
                  />
                  <span className="text-red-500 mt-2">
                    {errors.duration && touched.duration && errors.duration}
                  </span>
                </div>
                <div className="flex flex-col my-3">
                  <label>Movie Rating</label>
                  <Field
                    type="text"
                    name="rating"
                    // placeholder="Movie Name"
                    className="border-[1px] mt-2 px-2 py-2 min-w-[300px]"
                  />
                  <span className="text-red-500 mt-2">
                    {errors.rating && touched.rating && errors.rating}
                  </span>
                </div>

                <div className="flex justify-center space-x-3">
                  <button
                    className="bg-blue-200 px-2 py-2 rounded-lg"
                    type="submit"
                  >
                    Submit
                  </button>
                  {title !== "Add" && (
                    <button
                      type="button"
                      className="bg-red-400 px-2 py-2 rounded-lg"
                      onClick={() => handleDelete(id)}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </Form>
            </Box>
          )}
        </Formik>
      </Modal>
    </div>
  );
}
