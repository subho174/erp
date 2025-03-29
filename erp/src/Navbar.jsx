import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Navbar = ({ isLoggedIn, role }) => {
  const navigate = useNavigate();
  const logOut = () => {
    const backend_url = import.meta.env.VITE_BACKEND_URL;
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
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <ToastContainer />
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
          <li>
            <a onClick={isLoggedIn ? () => logOut() : () => navigate("/login")}>
              {isLoggedIn ? "Log out" : "Sign In"}
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Navbar;
