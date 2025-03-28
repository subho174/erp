import axios from "axios";
import { useEffect, useState, React } from "react";
import { useLocation } from "react-router-dom";

const Student = ({ backend_url }) => {
  const location = useLocation();
  const { userData } = location.state || {};
  const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage
  const [files, setfiles] = useState([]);
  const config = {
    headers: {
      Authorization: `Bearer ${token}`, // Add the token to the Authorization header
    },
  };

  useEffect(() => {
    console.log(backend_url);

    axios
      .get(`${backend_url}/user/get-assignments`, config)
      .then((response) => {
        setfiles(response.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  return (
    <div>
      <h1>Wecome user</h1>
      <div>
        <h4>Pending assignments</h4>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <Assignments files={files} />
        </div>
      </div>
      <p>{userData.userName}</p>
      <p>{userData.email}</p>
    </div>
  );
};

export default Student;

const Assignments = ({ files, shareFeedback }) => {
  return files ? (
    files.map((file) => {
      return (
        <div style={{ border: "2px solid white" }}>
          <div>{file.title}</div>
          <div>{file.description}</div>
          <div>
            <h5>Feedback form</h5>
            <form>
              <input type="text" name="feedback" />
              <button type="submit" onClick={shareFeedback}>
                Share feedback
              </button>
            </form>
          </div>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
