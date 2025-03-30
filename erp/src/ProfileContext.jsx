import axios from "axios";
import { createContext, useState } from "react";

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

  return (
    <ProfileContext.Provider
      value={{
        profileData,
        setprofileData,
        fetchUser,
        backend_url,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
