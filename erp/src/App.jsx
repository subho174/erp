import { useContext, useEffect } from "react";
import "./App.css";
import SignUp from "./SignUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProfileContext from "./ProfileContext";

function App() {
  const navigate = useNavigate();
  let { backend_url } = useContext(ProfileContext);

  useEffect(() => {
    const checkIfLoggedIn = async () => {
      axios
        .get(`${backend_url}/user/refresh-access-token`, {
          withCredentials: true,
        })
        // .get("http://localhost:9000/user/refresh-access-token", {
        //   withCredentials: true,
        // })
        .then((res) => {
          // console.log(res);
          const { newAccessToken, user } = res.data.data;
          // console.log(user);

          localStorage.setItem("accessToken", newAccessToken);
          user.isAdmin
            ? navigate("/dashboard/admin", { state: { userData: user } })
            : navigate("/dashboard/student", { state: { userData: user } });
        })
        .catch((e) => {
          console.log(e);
        });
    };
    checkIfLoggedIn();
  }, []);

  return (
    <>
      <div className="justify-items-center content-center">
        <SignUp />
      </div>
    </>
  );
}

export default App;
