import { React, useState, useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import AdminUtils from "./AdminUtils";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProfileContext from "./ProfileContext";
import Swal from "sweetalert2";

const Admin = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  const [recipients, setrecipients] = useState([]);
  const [assignments, setassignments] = useState();
  //console.log(userData);

  let { fetchUser, backend_url } = useContext(ProfileContext);
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`${backend_url}/user/admin/assignment-for-admin`, config)
      // .get("http://localhost:9000/user/admin/assignment-for-admin", config)
      .then((res) => {
        console.log(res);
        setassignments(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });

    // getting all recipients
    axios
      .get(`${backend_url}/user/admin/get-student`, config)
      // .get("http://localhost:9000/user/admin/get-student", config)
      .then((res) => {
        console.log(res);
        setrecipients(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });

    fetchUser();
  }, []);
  // console.log(assignments);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-[2.5rem] m-[1rem] font-semibold text-center">{`Welcome ${userData.userName}`}</h1>
        <AdminUtils admin={userData.userName} recipients={recipients} />
        <h1 className="text-[2.25rem] m-[3rem_0] font-semibold text-center">
          Old posts
        </h1>
        <div className="w-[85%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[4rem_2.5rem] mb-[4rem]">
          <Assignments assignments={assignments} />
        </div>
      </div>
    </>
  );
};

export default Admin;

const Assignments = ({ assignments }) => {
  const navigate = useNavigate();
  let { backend_url, Toast } = useContext(ProfileContext);
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getFeedback = (file_title, file_id) => {
    Toast.fire({
      icon: "info",
      title: "Loading feedbacks...",
    });
    axios
      .get(`${backend_url}/user/get-feedback/?file_id=${file_id}`, config) // in get requests, second argument is reserved for config, no other parameter should be passed
      .then((res) => {
        console.log(res);
        navigate(`/dashboard/admin/feedbacks/${file_title}`, {
          state: { feedbacks: res.data.data },
        });
        Swal.close();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return assignments ? (
    assignments.map((file, i) => {
      let type = file.file_url;
      let due_date = file.due_date;
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
          className="rounded-[0.5rem] p-[2rem_1.5rem] flex flex-col gap-[1rem] items-center transform hover:-translate-y-4 duration-400 shadow-2xl"
          key={i}
        >
          <div className="h-32 mb-4 rounded-lg border-2 w-[100%] border-gray-300 p-[0.5rem_1rem] flex flex-col gap-2 justify-start">
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
            onClick={() => getFeedback(file.title, file._id)}
            className="text-white mb-2"
          >
            Show Feedbacks
          </button>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
