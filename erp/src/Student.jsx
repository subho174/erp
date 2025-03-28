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
      <h1>Wecome user</h1>
      <div>
        <h4>Pending assignments</h4>
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
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
  const changeFeedback = (e) => {
    const { value } = e.target;
    setfeedbackData((prev) => ({ ...prev, content: value, file_id: id  }));
    console.log(feedbackData);
  };

  const shareFeedback = (event, id) => {
    event.preventDefault();
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
        console.log(res);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return files ? (
    files.map((file, i) => {
      return (
        <div style={{ border: "2px solid white" }} key={i}>
          <div>{file.title}</div>
          <div>{file.description}</div>
          <div>
            <h5>Feedback form</h5>
            <form
              onChange={changeFeedback}
              onSubmit={(event) => shareFeedback(event,file._id)}
            >
              <input type="text" name="content" />
              <button type="submit">Share feedback</button>
            </form>
          </div>
        </div>
      );
    })
  ) : (
    <p>No assignmaents available</p>
  );
};
