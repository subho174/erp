import axios from "axios";
import { useState, React, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileContext from "./ProfileContext";
import Swal from "sweetalert2";

const Navbar = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  let { profileData, setprofileData, backend_url, Toast, Toast_2, isAdmin } =
    useContext(ProfileContext);
  const [profile, setprofile] = useState(false);
  const [showMenu, setshowMenu] = useState(false);
  const [isSmallScreen, setisSmallScreen] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setisSmallScreen(window.innerWidth <= 600);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const logOut = () => {
    const token = localStorage.getItem("accessToken");
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Logout",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) {
        Toast.fire({
          icon: "info",
          title: "Logging Out...",
        });
        axios
          .post(
            `${backend_url}/user/logout`,
            //"http://localhost:9000/user/logout",
            {},
            { ...config, withCredentials: true }
          )
          .then((res) => {
            console.log(res);
            localStorage.removeItem("accessToken");
            setprofileData(null);
            navigate("/login");
            Swal.close();
            Toast_2.fire({
              icon: "success",
              title: "Logged Out successfully",
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  };

  return (
    <div className="w-[100%]">
      <nav className="flex justify-between items-center p-[0.5rem_1rem] md:p-[0.5rem_2rem] bg-white">
        <p className="font-bold text-[2rem]">AcadHub</p>
        {showMenu && isSmallScreen ? (
          <>
            <i
              onClick={() => setshowMenu(!showMenu)}
              className="fa-solid fa-xmark text-2xl"
            ></i>
          </>
        ) : (
          <ul className="flex gap-[1rem] items-center">
            {isSmallScreen ? (
              <i
                onClick={() => setshowMenu(!showMenu)}
                className="fa-solid fa-bars text-2xl"
              ></i>
            ) : (
              <>
                {isLoggedIn && profileData && profileData.isAdmin ? (
                  <li onClick={() => navigate("/dashboard/admin/students")}>
                    Students
                  </li>
                ) : (
                  ""
                )}
                {isLoggedIn ? (
                  <li onClick={() => setprofile(true)}>Profile</li>
                ) : (
                  ""
                )}
                <li
                  onClick={
                    isLoggedIn ? () => logOut() : () => navigate("/login")
                  }
                >
                  {isLoggedIn ? "Log out" : "Sign In"}
                </li>
                {profileData ? (
                  <div className="rounded-[50%] text-[1.1rem] flex items-center justify-center text-white w-10 h-10 bg-black">
                    {profileData.userName[0].toUpperCase()}
                  </div>
                ) : (
                  ""
                )}
              </>
            )}
          </ul>
        )}
      </nav>
      {showMenu && isSmallScreen ? (
        <div
          className={`fixed top-16 left-0 w-[100%] p-[0.5rem_0] z-10 bg-white shadow-lg transform transition-transform duration-500 ease-in-out ${
            showMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <ul className="flex flex-col gap-[1rem] smallScreenli">
            {isLoggedIn && profileData && profileData.isAdmin ? (
              <li onClick={() => navigate("/dashboard/admin/students")}>
                Students
              </li>
            ) : (
              ""
            )}
            {isLoggedIn ? (
              <li onClick={() => setprofile(true)}>Profile</li>
            ) : (
              ""
            )}
            <li
              onClick={isLoggedIn ? () => logOut() : () => navigate("/login")}
            >
              {isLoggedIn ? "Log out" : "Sign In"}
            </li>
          </ul>
        </div>
      ) : (
        ""
      )}
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
