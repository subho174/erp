import axios from "axios";
import { useEffect, useState, React } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Student = ({ backend_url }) => {
  const location = useLocation();
  const { userData } = location.state || {};
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
  const [files, setfiles] = useState([]);

  console.log(userData);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    },
  };

  useEffect(() => {
    axios
      .get(`${backend_url}/user/get-assignments`, config)
      .then((response) => {
        setfiles(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log(files);

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover
        theme="dark"
      />
      <h1 className="text-[2.5rem] mb-[2rem] font-bold text-center">{`Welcome ${userData.userName}`}</h1>
      <div className="">
        <h4 className="text-[1.75rem] text-center">Pending assignments</h4>
        <div className="w-[85%] mt-[3rem] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[2.5rem]">
          <Assignments files={files} backend_url={backend_url} />
        </div>
      </div>
      {/* <p>{userData.userName}</p>
      <p>{userData.email}</p> */}
    </div>
  );
};

export default Student;

const Assignments = ({ files, backend_url }) => {
  const [feedbackData, setfeedbackData] = useState({
    content: "",
    file_id: "",
  });
  // const [isLoading, setisLoading] = useState(false);
  const changeFeedback = (e, id) => {
    const { value } = e.target;
    setfeedbackData((prev) => ({ ...prev, content: value, file_id: id }));
    console.log(feedbackData);
  };

  const shareFeedback = (event, id) => {
    event.preventDefault();
    toast.info("Feedback is being posted");
    // setisLoading(true);
    // setfeedbackData((prev) => ({ ...prev, file_id: id }))

    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    console.log(feedbackData);

    axios
      .post(`${backend_url}/user/post-feedback`, feedbackData, config)
      .then((res) => {
        // setisLoading(false);
        toast.success("Feedback posted successfully");
        console.log(res);
      })
      .catch((e) => {
        // setisLoading(false);
        toast.error("Failed to post feedback");
        console.log(e);
      });
  };

  return files ? (
    files.map((file, i) => {
      let type = file.file_url;
      let due_date = file.due_date;
      console.log(due_date?.replace("T00:00:00.000Z", ""));

      const FileType = () => {
        if (type.endsWith(".pdf")) {
          return (
            <a
              href={type}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              View PDF
            </a>
          );
        } else {
          return (
            <img
              src={type}
              alt="Media"
              style={{ height: "200px" }}
              className="w-full rounded-lg"
            />
          );
        }
      };
      return (
        <div
          className="border-2 border-s-black rounded-[0.5rem] p-[1rem] flex flex-col justify-between items-center"
          key={i}
        >
          <div className="mb-4">
            <p>{file.title}</p>
            <p>{file.description}</p>
          </div>
          <div className="h-[200px] justify-items-center content-center">{<FileType />}</div>
          <div className="flex gap-2 text-[1.25rem] m-[1rem_0]">
            <p className="font-bold">Deadline : </p>
            <p>{due_date?.replace("T00:00:00.000Z", "")}</p>
          </div>
          <div>
            <h5>Feedback form</h5>
            <form
              onChange={(e) => changeFeedback(e, file._id)}
              onSubmit={(event) => shareFeedback(event, file._id)}
            >
              <input
                type="text"
                className="border-2 w-[100%]"
                name="content"
                required
              />
              <button type="submit" className="text-white">
                Share feedback
              </button>
              {/* {isLoading ? (
                <span class="relative flex size-3">
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                  <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
                </span>
              ) : (
                ""
              )} */}
            </form>
          </div>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
