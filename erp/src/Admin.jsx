import { React, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AdminUtils from "./AdminUtils";
import axios from "axios";

const Admin = ({ backend_url }) => {
  const location = useLocation();
  const { userData } = location.state || {};
  console.log(userData);

  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [assignments, setassignments] = useState();

  useEffect(() => {
    axios
      .get(`${backend_url}/user/get-assignments`, config)
      .then((res) => {
        console.log(res);
        setassignments(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);
  console.log(assignments);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-[2.5rem] m-[1rem_0] font-bold text-center">{`Welcome ${userData.userName}`}</h1>
      {/* <p>{userData.email}</p> */}
      <AdminUtils backend_url={backend_url} />

      <h1 className="text-[2.5rem] m-[3rem_0] font-bold text-center">
        Old posts
      </h1>
      <div className="w-[85%] grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-[2.5rem]">
        <Assignments backend_url={backend_url} assignments={assignments} />
      </div>
    </div>
  );
};

export default Admin;

const Assignments = ({ backend_url, assignments }) => {
  const token = localStorage.getItem("accessToken");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const getFeedback = (file_id) => {
    axios
      .get(`${backend_url}/user/get-feedback/?file_id=${file_id}`, config) // in get requests, second argument is reserved for config, no other parameter should be passed
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return assignments ? (
    assignments.map((file, i) => {
      let type = file.file_url;
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
        <div className="border-2 border-s-black rounded-[0.5rem] p-[1rem] flex flex-col gap-[1rem] items-center" key={i}>
          <div>{file.title}</div>
          <div>{file.description}</div>
          <div>{<FileType />}</div>
          <button onClick={() => getFeedback(file._id)} className="text-white">Show Feedbacks</button>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
