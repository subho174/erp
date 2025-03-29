import { React, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const AdminUtils = ({ backend_url }) => {
  const [formData, setformData] = useState({
    title: "",
    description: "",
    file: "",
    due_date: "",
  });

  const uploadFile = (e) => {
    e.preventDefault();
    setisLoading(true);
    // toast.info("Assignment is being posted")
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
        setisLoading(false);
        toast.success("Assignment posted successfully");
        console.log(response);
        let userDetails = [response.data.data];
        console.log(userDetails, userDetails[0].isAdmin);
      })
      .catch(function (error) {
        setisLoading(false);
        toast.error("Failed to post assignment");
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

  const [isLoading, setisLoading] = useState(false);

  return (
    <div className="w-[90vw] md:w-[50vw] lg:w-[35vw] p-[1rem_1.5rem] mt-[3vh] text-white bg-[#0f172a] rounded-[0.75rem]">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover
        theme="dark"
      />
      <h4 className="text-[1.75rem] text-center">Post Assignment</h4>
      <form
        className="mt-[1rem] w-[100%]"
        onSubmit={uploadFile}
        onChange={changeUserData}
      >
        <div className="labels">
          <label htmlFor="title">Title</label>
          <input type="text" name="title" required />
        </div>
        <div className="labels">
          <label htmlFor="description">Description</label>
          <input type="text" name="description" required />
        </div>
        <div className="labels">
          <label htmlFor="file">Upload File</label>
          <input type="file" name="file" required />
        </div>
        <div className="labels">
          <label htmlFor="due_date">Due Date</label>
          <input type="date" name="due_date" required />
        </div>
        <div className="flex flex-col items-center gap-[1rem] mt-[1.5rem] ">
          <button >Post Assignment</button>
          {isLoading ? (
            <span class="relative flex size-3">
              <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
              <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
            </span>
          ) : (
            ""
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminUtils;
