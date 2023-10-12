import { useSelector } from "react-redux";
import { AiFillPlusCircle } from "react-icons/ai";

const HeaderAction = ({ handleModal }: any) => {
  const { movies } = useSelector((state: any) => state?.movies);

  const generateFile = (format: string) => {
    if (format === "csv" || format === "txt") {
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
          handleModal("Add");
          //   setTitle("Add");
        }}
        className="cursor-pointer flex flex-row space-x-3 py-1 px-2 rounded-lg bg-blue-100 justify-center items-center w-fit"
      >
        <span className="text-[18px] font-medium">Add a movie</span>
        <AiFillPlusCircle size={30} />
      </div>
    </div>
  );
};

export default HeaderAction;
