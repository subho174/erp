import { React, useState, useContext } from "react";
import axios from "axios";
import ProfileContext from "./ProfileContext";
import Swal from "sweetalert2";

const AdminUtils = ({ admin, recipients }) => {
  const [formData, setformData] = useState({
    title: "",
    description: "",
    file: "",
    due_date: "",
  });

  const subject = `New Assignment from ${admin}`;
  const body = `Dear student,
  
  A new assignment has been posted.`;

  let { backend_url, Toast, Toast_2 } = useContext(ProfileContext);
  //console.log(recipients);
  const uploadFile = async (e) => {
    e.preventDefault();
    setisLoading(true);
    Toast.fire({
      icon: "info",
      title: "Posting Assignment..",
    });
    //console.log(formData);
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
        "Content-Type": "multipart/form-data", // Ensure the correct content type for file uploads
      },
    };
    const config_2 = {
      headers: {
        Authorization: `Bearer ${token}`, // Add the token to the Authorization header
      },
    };
    // const formDataToSend = new FormData();
    // formDataToSend.append("title", formData.title);
    // formDataToSend.append("description", formData.description);
    // formDataToSend.append("file", formData.file); // File input
    // formDataToSend.append("due_date", formData.due_date);

    await axios
      .post(`${backend_url}/user/upload-file`, formData, config)
      .then(function (response) {
        setisLoading(false);
        Swal.close();
        Toast_2.fire({
          icon: "success",
          title: "Assignment posted successfully",
        });
        console.log(response);
        // let userDetails = [response.data.data];
        // console.log(userDetails, userDetails[0].isAdmin);
      })
      .catch(function (error) {
        setisLoading(false);
        Toast_2.fire({
          icon: "error",
          title: "Failed to post assignment",
        });
        console.log(error);
      });

    //sending mail to all recipients after posting assignment
    await axios
      .post(
        //`http://localhost:9000/user/send-email`,
        `${backend_url}/user/send-email`,
        { recipients, subject, body },
        config_2
      )
      .then(function (response) {
        console.log(response);
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

  const [isLoading, setisLoading] = useState(false);

  return (
    <div className="w-[90vw] md:w-[50vw] lg:w-[40vw] xl:w-[35vw] 2xl:w-[30vw] p-[1rem_1.5rem] mt-[3vh] bg-white rounded-[0.75rem]">
      <h4 className="text-[1.75rem] font-medium text-center">
        Post Assignment
      </h4>
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
          <button>Post Assignment</button>
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
