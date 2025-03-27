import { React, useState } from "react";
// import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminUtils = ({ backend_url }) => {
  // const navigate = useNavigate();
  const [formData, setformData] = useState({
    title: "",
    description: "",
    file: "",
    due_date: ""
  });

  const uploadFile = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post(`${backend_url}/user/upload-file`, formData)
      .then(function (response) {
        console.log(response);
        let userDetails = [response.data.data];
        console.log(userDetails, userDetails[0].isAdmin);

        // if (userDetails[0].isAdmin == true)
        //   navigate("/dashboard/admin", { state: { userData: userDetails[0] } });
        // else
        //   navigate("/dashboard/student", {
        //     state: { userData: userDetails[0] },
        //   });
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const changeUserData = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <form onSubmit={uploadFile} onChange={changeUserData}>
        <div>
          <label htmlFor="title">Title</label>
          <input type="text" name="title" />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <input type="text" name="description" />
        </div>
        <div>
          <label htmlFor="file">Upload File or PDF</label>
          <input type="file" name="file" />
        </div>
        <div>
          <label htmlFor="due_date">Due Date</label>
          <input type="date" name="due_date" />
        </div>
        <button>Post Assignment</button>
      </form>
    </div>
  );
};

export default AdminUtils;
