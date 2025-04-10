import axios from "axios";
import { useEffect, useState, React, useContext } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import ProfileContext from "./ProfileContext";
import Swal from "sweetalert2";

const Student = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  let { fetchUser, backend_url } = useContext(ProfileContext);

  const [allFiles, setallFiles] = useState();
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // console.log(userData, isLoggedIn);
  useEffect(() => {
    axios
      .patch(`${backend_url}/user/assignment-for-student`, {}, config)
      // .patch("http://localhost:9000/user/assignment-for-student", {}, config)
      .then((response) => {
        console.log(response);
        setallFiles(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });

    fetchUser();
  }, []);

  return (
    <div>
      <Navbar isLoggedIn={true} />
      <h1 className="text-[2.5rem] w-[80%] mx-auto my-[1rem] font-semibold text-center">{`Welcome ${userData.userName}`}</h1>
      <div className="z-0">
        <h4 className="text-[2rem] text-center mt-10">Pending assignments</h4>
        <div className="w-[85%] m-[2rem] mx-auto grid gap-[4rem_2.5rem]">
          {/* grid-cols-1 md:grid-rows-2 xl:grid-rows-3 */}
          <Assignments allFiles={allFiles} />
        </div>
      </div>
    </div>
  );
};

export default Student;

const Assignments = ({ allFiles }) => {
  let { backend_url, Toast, Toast_2 } = useContext(ProfileContext);
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // const [isLoading, setisLoading] = useState(false);
  const showFeedbackForm = async (id) => {
    const { value: text } = await Swal.fire({
      input: "textarea",
      inputLabel: "Feedback",
      inputPlaceholder: "Share your feedback...",
      inputAttributes: {
        "aria-label": "Share your feedback",
      },
      showCancelButton: true,
    });
    if (text) {
      const feedback = { content: text, file_id: id };
      shareFeedback(feedback);
    }
  };

  const shareFeedback = (feedback) => {
    Toast.fire({
      icon: "info",
      title: "Posting Feedback...",
    });
    // setisLoading(true);

    axios
      .post(`${backend_url}/user/post-feedback`, feedback, config)
      .then((res) => {
        // setisLoading(false);
        Swal.close();
        Toast_2.fire({
          icon: "success",
          title: "Feedback posted successfully",
        });
        console.log(res);
      })
      .catch((e) => {
        // setisLoading(false);
        Toast_2.fire({
          icon: "error",
          title: "Failed to post feedback",
        });
        console.log(e);
      });
  };

  return allFiles && allFiles.length > 0 ? (
    allFiles.map((files, i) => {
      return files && files.length > 0 ? (
        <div key={i} className="flex flex-col gap-4">
          <div className="flex text-xl">
            <p className="font-semibold mr-2">Assignment from : </p>
            <p>{files[0].admin.userName}</p>
          </div>
          <div
            key={i}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 p-[1rem] rounded-2xl shadow-2xl"
          >
            {/* gap-[4rem_2.5rem] */}
            {files.map((file, i) => {
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
                  className="rounded-[0.5rem] p-[2rem_1.5rem] flex flex-col justify-between items-center transform hover:-translate-y-4 duration-400"
                  key={i}
                >
                  <div className="mb-4 h-32 rounded-lg border-2 w-[100%] border-gray-300 p-[0.5rem_1rem] flex flex-col gap-2 justify-start">
                    <p className="text-[1.25rem] font-bold">{file.title}</p>
                    <p className="break-words">{file.description}</p>
                  </div>
                  <div className="h-[200px] flex justify-center items-center">
                    {<FileType />}
                  </div>
                  <div className="flex gap-2 text-[1.25rem] m-[1rem_0]">
                    <p className="font-bold">Deadline : </p>
                    <p>{due_date?.replace("T00:00:00.000Z", "")}</p>
                  </div>
                  <button
                    onClick={() => showFeedbackForm(file._id)}
                    className="text-white my-4"
                  >
                    Share feedback
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p>No Assignments available</p>
      );
    })
  ) : (
    <p>No Assignments available</p>
  );
};
