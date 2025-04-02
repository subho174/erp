import axios from "axios";
import { useState, React, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ProfileContext from "./ProfileContext";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  let { profileData, setprofileData, backend_url } = useContext(ProfileContext);
  // console.log(profileData);
  const [profile, setprofile] = useState(false);

  const logOut = () => {
    toast.info("Logging Out");
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .post(`${backend_url}/user/logout`, {}, config)
      .then((res) => {
        console.log(res);
        localStorage.removeItem("accessToken");
        setprofileData(null);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="w-[100%]">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <nav className="flex justify-between p-[0.5rem_1rem] md:p-[0.5rem_2rem]">
        <p className="font-semibold text-[2rem]">AcadHub</p>
        <ul className="flex gap-[1rem] items-center">
          {/* {showdashboard ? (
            <li>
              <a href="/dashboard/admin">Dashboard</a>
            </li>
          ) : (
            ""
          )} */}
          {isLoggedIn ? <li onClick={() => setprofile(true)}>Profile</li> : ""}
          <li>
            <a onClick={isLoggedIn ? () => logOut() : () => navigate("/login")}>
              {isLoggedIn ? "Log out" : "Sign In"}
            </a>
          </li>
        </ul>
      </nav>
      <div
        className={`fixed top-0 right-0 w-[100%] md:w-[50%] lg:w-[40%] xl:w-[25%] h-full bg-white shadow-lg p-[3rem_2rem] transform transition-transform duration-500 ease-in-out z-20 ${
          profile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <i
          onClick={() => setprofile(false)}
          className="fa-solid fa-xmark text-2xl absolute right-4 top-4 cursor-pointer"
        ></i>

        {profileData ? (
          <div className="flex flex-col gap-6 pr-[1rem]">
            <img
              className="rounded-[50%] border-1 border-gray-400"
              src={
                profileData.profileImage
                  ? `${profileData.profileImage}`
                  : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRxs6nU-MXcXqn0H_RzPhyk9tBajU71PWi3P3_yCaO9ZaeqSyhl1FJ4hBRNx-Bm1hhSU8c&usqp=CAU"
              }
              style={{ height: "100px", width: "100px" }}
              alt="Profile Photo"
            />
            <hr />
            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="" className="profile_label">
                  Name
                </label>
                <p>{profileData.userName}</p>
              </div>
              <div>
                <label htmlFor="" className="profile_label">
                  Email
                </label>
                <p>{profileData.email}</p>
              </div>
              <div>
                <label htmlFor="" className="profile_label">
                  Role
                </label>
                <p>{profileData.isAdmin ? "Admin" : "Student"}</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default Navbar;
