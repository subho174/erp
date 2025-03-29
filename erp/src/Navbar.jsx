import axios from "axios";
import { useState, React } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Navbar = ({ isLoggedIn, role, profileDetails }) => {
  const navigate = useNavigate();
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  const token = localStorage.getItem("accessToken");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [profile, setprofile] = useState(false);
console.log(profileDetails);

  const logOut = () => {
    // const backend_url = import.meta.env.VITE_BACKEND_URL;
    toast.info("Logging Out");

    axios
      .post(`${backend_url}/user/logout`, {}, config)
      .then((res) => {
        console.log(res);
        localStorage.removeItem("accessToken");
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showProfile = () => {
    setprofile(true);
    // axios
    //   .get(`${backend_url}/user/get-user`, config)
    //   .then((res) => {
    //     console.log(res);
    //     profileDetails = res.data.data;
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  };

  return (
    <div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        pauseOnHover
        theme="dark"
      />
      <nav className="flex justify-between  p-[0.5rem_1rem] md:p-[0.5rem_2rem]">
        <p className="font-bold text-[2rem]">AcadHub</p>
        <ul className="flex gap-[1rem] items-center">
          {/* {showdashboard ? (
            <li>
              <a href="/dashboard/admin">Dashboard</a>
            </li>
          ) : (
            ""
          )} */}
          {isLoggedIn ? <li onClick={showProfile}>Profile</li> : ""}
          <li>
            <a onClick={isLoggedIn ? () => logOut() : () => navigate("/login")}>
              {isLoggedIn ? "Log out" : "Sign In"}
            </a>
          </li>
        </ul>
      </nav>
      <div
        className={`fixed top-0 right-0 w-[90%] md:w-[50%] xl:w-[30%] h-full bg-white shadow-lg p-[2rem_1rem] transform transition-transform duration-500 ease-in-out z-20 ${
          profile ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <i
          onClick={() => setprofile(false)}
          class="fa-solid fa-xmark text-2xl absolute right-4 top-4 cursor-pointer"
        ></i>
        {profileDetails ? (
          <div>
            <label htmlFor="" className="profile_label">
              Name
            </label>
            <p>{profileDetails.userName}</p>
            <label htmlFor="" className="profile_label">
              Email
            </label>
            <p>{profileDetails.email}</p>
            <label htmlFor="" className="profile_label">
              Role
            </label>
            <p>{profileDetails.isAdmin ? "Admin" : "Student"}</p>
          </div>
        ) : (
          <p>No Data Found</p>
        )}
      </div>
    </div>
  );
};

export default Navbar;
