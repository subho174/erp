import { useEffect, useState, React, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import Navbar from "./Navbar";
import ProfileContext from "./ProfileContext";

const SignUp = () => {
  const [role, setrole] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [formData, setformData] = useState({
    userName: "",
    email: "",
    password: "",
    isAdmin: true,
    profileImage: "",
  });
  let { backend_url } = useContext(ProfileContext);

  const config = {
    headers: {
      "Content-Type": "multipart/form-data", // Ensure the correct content type for file uploads
    },
  };

  const registerUser = (e) => {
    e.preventDefault();
    setisLoading(true);
    toast.info("Signing up..");
    axios
      .post(`${backend_url}/user/register`, formData, config)
      .then(function (response) {
        setisLoading(false);
        let userDetails = [response.data.data.newUser];
        toast.success("Signed Up successfully");
        //console.log(userDetails);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        if (userDetails[0].isAdmin == true)
          navigate("/dashboard/admin", { state: { userData: userDetails[0] } });
        else
          navigate("/dashboard/student", {
            state: { userData: userDetails[0] },
          });
      })
      .catch(function (error) {
        setisLoading(false);
        toast.error("Failed to Sign Up");
        toast.error(error.response.data.message);
        console.log(error);
      });
  };
  // useEffect(() => {
  //   return () => {
  //     console.log(formData);
  //   };
  // }, [formData]);

  const changeUserData = (e) => {
    const { name, value, files } = e.target;
    if (name === "profileImage")
      setformData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    else setformData((prev) => ({ ...prev, [name]: value }));
  };

  const changeRole = (e) => {
    let value = e.target.value === "true";
    setrole(value);
  };

  return (
    <>
      <Navbar />
      <div className="signup w-[90vw] md:w-[60vw] lg:w-[45vw] xl:w-[30vw] p-[1rem_1.5rem] mt-[5rem] text-white bg-[#0f172a] flex flex-col justify-center items-center rounded-[0.75rem] ">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          pauseOnHover
          theme="dark"
        />

        <header className="text-[1.25rem] ">Welcome to ERP</header>
        <form
          className="mt-[1rem] w-[100%]"
          onSubmit={registerUser}
          onChange={changeUserData}
        >
          <div className="labels">
            <label htmlFor="name">Username</label>
            <input type="text" name="userName" required />
          </div>
          <div className="labels">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" required />
          </div>
          <div className="labels">
            <label htmlFor="name">Password</label>
            <input type="password" name="password" required />
          </div>
          <div className="labels">
            <label htmlFor="profileImage">Profile Photo</label>
            <input type="file" accept="image/*" name="profileImage" />
          </div>
          <div className="flex justify-evenly mt-[10px]">
            <div>
              <input
                type="radio"
                name="isAdmin"
                value={false}
                onChange={changeRole}
                checked={!role}
                className="mr-[10px]"
              />
              Student
            </div>
            <div>
              <input
                type="radio"
                name="isAdmin"
                value={true}
                onChange={changeRole}
                checked={role}
                className="mr-[5px]"
              />
              Admin
            </div>
          </div>
          <div className="flex flex-col items-center gap-[1rem] mt-[1.5rem] ">
            <button type="submit" className="mx-auto">
              Sign Up
            </button>
            {isLoading ? (
              <span className="relative flex size-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span className="relative inline-flex size-3 rounded-full bg-sky-500"></span>
              </span>
            ) : (
              ""
            )}
            <p
              className="hover:text-green-300 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Already have an account ?
            </p>
          </div>
        </form>
      </div>
    </>
  );
};

export default SignUp;
