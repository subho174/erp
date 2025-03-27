import { React, useState } from "react";
import axios from "axios";

const AdminUtils = ({ backend_url }) => {
  const [formData, setformData] = useState({
    title: "",
    description: "",
    file: "",
    due_date: "",
  });

  const uploadFile = (e) => {
    e.preventDefault();
    console.log(formData);

    const token = localStorage.getItem("accessToken"); // Retrieve the token from localStorage

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        "Content-Type": "multipart/form-data", // Ensure the correct content type for file uploads
      },
    };

    // const formDataToSend = new FormData();
    // formDataToSend.append("title", formData.title);
    // formDataToSend.append("description", formData.description);
    // formDataToSend.append("file", formData.file); // File input
    // formDataToSend.append("due_date", formData.due_date);

    axios
      .post(`${backend_url}/user/upload-file`, formData, config)
      .then(function (response) {
        console.log(response);
        let userDetails = [response.data.data];
        console.log(userDetails, userDetails[0].isAdmin);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const changeUserData = (e) => {
    const { name, value, files } = e.target;
    if (name === "file")
      setformData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    // Handle file input
    else setformData((prev) => ({ ...prev, [name]: value }));
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
