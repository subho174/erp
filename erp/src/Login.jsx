import { useEffect, useState, React, use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Login = ({ backend_url }) => {
  const [role, setrole] = useState(true);
  const navigate = useNavigate();
  const [isLoading, setisLoading] = useState(false);
  const [formData, setformData] = useState({
    userName: "",
    email: "",
    password: "",
    isAdmin: true,
  });

  const logInUser = (e) => {
    e.preventDefault();
    setisLoading(true);
    axios
      .post(`${backend_url}/user/login`, formData)
      .then(function (response) {
        setisLoading(false);
        localStorage.setItem("accessToken", response.data.data.accessToken);
        let userDetails = [response.data.data.loggedInUser];
        console.log(userDetails, userDetails[0].isAdmin);
        toast.success("Logged In successfully");
        if (userDetails[0].isAdmin == true)
          navigate("/dashboard/admin", { state: { userData: userDetails[0] } });
        else
          navigate("/dashboard/student", {
            state: { userData: userDetails[0] },
          });
      })
      .catch(function (error) {
        setisLoading(false);
        toast.error("Failed to Log In");
        toast.info(`${error.response.data.message}`);
        console.log(error);
      });
  };

  const changeUserData = (e) => {
    const { name, value } = e.target;
    setformData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    return () => {
      console.log(formData);
    };
  }, [formData]);

  const changeRole = (e) => {
    let value = e.target.value === "true";
    setrole(value);
    console.log(role);
  };

  return (
    <div className="flex justify-center">
      <div className="signup w-[90vw] md:w-[50vw] lg:w-[35vw] p-[1rem_1.5rem] mt-[20vh] text-white bg-[#242424] flex flex-col justify-center items-center rounded-[0.75rem]">
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={true}
          newestOnTop={false}
          closeOnClick={false}
          pauseOnHover
          theme="dark"
        />
        <header className="text-[1.25rem]">Welcome to ERP</header>
        <form
          onSubmit={logInUser}
          onChange={changeUserData}
          className="mt-[1rem] w-[100%]"
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
          <div className="flex justify-evenly mt-[10px]">
            <div>
              <input
                type="radio"
                name="isAdmin"
                value={false}
                onChange={changeRole}
                checked={!role}
                className="mr-[5px]"
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
            <button type="submit">Login</button>
            {isLoading ? (
              <span class="relative flex size-3">
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-400 opacity-75"></span>
                <span class="relative inline-flex size-3 rounded-full bg-sky-500"></span>
              </span>
            ) : (
              ""
            )}
            <p
              className="hover:text-green-300 cursor-pointer"
              onClick={() => navigate("/")}
            >
              Don't have an account ?
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
