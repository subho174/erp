import axios from "axios";
import { useEffect, useState, React, useContext } from "react";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar";
import ProfileContext from "./ProfileContext";

const Student = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  let { fetchUser, backend_url } = useContext(ProfileContext);

  const [files, setfiles] = useState([]);
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // console.log(userData, isLoggedIn);

  useEffect(() => {
    axios
      .get(`${backend_url}/user/get-assignments`, config)
      .then((response) => {
        setfiles(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });

    fetchUser();
  }, []);
  // console.log(files);

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar isLoggedIn={true} />
      <h1 className="text-[2.5rem] w-[80%] mx-auto my-[1rem] font-semibold text-center">{`Welcome ${userData.userName}`}</h1>
      <div className="z-0">
        <h4 className="text-[2rem] text-center mt-10">Pending assignments</h4>
        <div className="w-[85%] m-[2rem] mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[4rem_2.5rem]">
          <Assignments files={files} />
        </div>
      </div>
    </div>
  );
};

export default Student;

const Assignments = ({ files }) => {
  const [feedbackData, setfeedbackData] = useState({
    content: "",
    file_id: "",
  });
  let { backend_url } = useContext(ProfileContext);
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // const [isLoading, setisLoading] = useState(false);
  const changeFeedback = (e, id) => {
    const { value } = e.target;
    setfeedbackData((prev) => ({ ...prev, content: value, file_id: id }));
    // console.log(feedbackData);
  };

  const shareFeedback = (event, id) => {
    event.preventDefault();
    toast.info("Feedback is being posted");
    // setisLoading(true);
    // setfeedbackData((prev) => ({ ...prev, file_id: id }))

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
      // console.log(due_date?.replace("T00:00:00.000Z", ""));

      const FileType = () => {
        if (type.endsWith(".pdf")) {
          return (
            <a
              href={type}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
            >
              Download PDF
            </a>
          );
        } else {
          return (
            <>
              <img
                src={type}
                alt="Media"
                style={{ height: "200px" }}
                className="w-full rounded-lg"
              />
              {/* <a href={`${type}`} download={`${type}`}>Download Image</a> */}
            </>
          );
        }
      };
      return (
        <div
          className="rounded-[0.5rem] p-[2rem_1.5rem] flex flex-col justify-between items-center transform hover:-translate-y-4 duration-400 shadow-2xl"
          key={i}
        >
          <div className="mb-4 h-32 rounded-lg border-2 w-[100%] border-gray-300 p-[0.5rem_1rem] flex flex-col gap-2 justify-start">
            <p className="text-[1.25rem] font-bold">{file.title}</p>
            <p>{file.description}</p>
          </div>
          <div className="h-[200px] flex justify-center items-center">
            {<FileType />}
          </div>
          <div className="flex gap-2 text-[1.25rem] m-[1rem_0]">
            <p className="font-bold">Deadline : </p>
            <p>{due_date?.replace("T00:00:00.000Z", "")}</p>
          </div>
          <div className="w-[100%]">
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
              <button type="submit" className="text-white my-4">
                Share feedback
              </button>
            </form>
          </div>
        </div>
      );
    })
  ) : (
    <p>No Assignments available</p>
  );
};
