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
    <div>
      <p>{userData.userName}</p>
      <p>{userData.email}</p>
      <AdminUtils backend_url={backend_url} />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem" }}>
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
      return (
        <div style={{ border: "2px solid white" }} key={i}>
          <div>{file.title}</div>
          <div>{file.description}</div>
          <button onClick={() => getFeedback(file._id)}>Show Feedbacks</button>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
