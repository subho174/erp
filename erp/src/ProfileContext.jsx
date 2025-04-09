import axios from "axios";
import { createContext, useState, useEffect } from "react";
import Swal from "sweetalert2";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setprofileData] = useState();
  const [students, setstudents] = useState([]);
  const [isAdmin, setisAdmin] = useState();
  const [showFeedbackForm, setshowFeedbackForm] = useState(false);

  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // useEffect(() => {
  //   console.log(showFeedbackForm);
  // }, [showFeedbackForm]);

  const fetchUser = () => {
    axios
      .get(`${backend_url}/user/get-user`, config)
      .then((res) => {
        console.log(res);
        setprofileData(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const fetchAllStudents = () => {
    axios
      .get(
        `${backend_url}/user/getAllStudents`,
        // `http://localhost:9000/user/getAllStudents`,
        config
      )
      .then((res) => {
        console.log(res);
        setstudents(res.data.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    //timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  const Toast_2 = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setprofileData,
        fetchUser,
        backend_url,
        Toast,
        Toast_2,
        students,
        fetchAllStudents,
        isAdmin,
        setisAdmin,
        showFeedbackForm,
        setshowFeedbackForm,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
