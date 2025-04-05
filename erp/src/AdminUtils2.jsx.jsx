import React, { useEffect, useState, useContext } from "react";
import ProfileContext from "./ProfileContext";
import axios from "axios";
import Navbar from "./Navbar";

const AdminUtils2 = () => {
  const { backend_url, students, fetchUser, Toast, Toast_2, fetchAllStudents } =
    useContext(ProfileContext);
  const [studentId, setstudentId] = useState();
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    // fetching all students
    fetchAllStudents();
    fetchUser();
  }, []);

  useEffect(() => {
    console.log(studentId);
  }, [studentId]);

  const addStudent = (event) => {
    event.preventDefault();
    Toast.fire({
      icon: "info",
      title: "Adding Student...",
    });
    axios
      .post(
        // `http://localhost:9000/user/admin/add-student`,
        `${backend_url}/user/admin/add-student`,
        { studentId },
        config
      )
      .then((res) => {
        console.log(res);
        Toast_2.fire({
          icon: "success",
          title: "Student added successfully",
        });
      })
      .catch((error) => {
        console.log(error);
        Toast_2.fire({
          icon: "error",
          title: `${error.response.data.errors}`,
        });
      });
  };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="w-[80vw] md:w-[40vw] lg:w-[30vw] xl:w-[25vw] p-[1rem_1.5rem] mt-[3vh] bg-white rounded-[0.75rem] mx-auto">
        <h4 className="text-[1.75rem] font-medium text-center">
          Add New Student
        </h4>
        <form className="mt-[1rem] w-[100%] text-end" onSubmit={addStudent}>
          <div className="labels border-2 border-gray-400 rounded-[0.5rem] p-[0.25rem_0.5rem] my-6">
            <select
              onChange={(e) => setstudentId(e.target.value)}
              className="cursor-pointer outline-none"
            >
              {students.length > 0
                ? students.map((student, i) => {
                    return (
                      <option value={student._id} key={i}>
                        {student.userName}
                      </option>
                    );
                  })
                : ""}
            </select>
          </div>
          <button type="submit" style={{ width: "80px", padding: "0.5rem 0" }}>
            Add
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminUtils2;
