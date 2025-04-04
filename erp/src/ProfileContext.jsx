import axios from "axios";
import { createContext, useState } from "react";
import Swal from "sweetalert2";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setprofileData] = useState();
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const fetchUser = () => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
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
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
