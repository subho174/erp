import { useEffect, useState, React, use } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ backend_url }) => {
  const [role, setrole] = useState(true);
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    userName: "",
    email: "",
    password: "",
    isAdmin: true,
  });

  const logInUser = (e) => {
    e.preventDefault();
    axios
      .post(`${backend_url}/user/login`, formData)
      .then(function (response) {
        console.log(response);
        let userDetails = [response.data.data];
        console.log(userDetails, userDetails[0].isAdmin);

        if (userDetails[0].isAdmin == true)
          navigate("/dashboard/admin", { state: { userData: userDetails[0] } });
        else
          navigate("/dashboard/student", {
            state: { userData: userDetails[0] },
          });
      })
      .catch(function (error) {
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
    <div className="signup">
      <header>Welcome to ERP</header>
      <form onSubmit={logInUser} onChange={changeUserData}>
        <div>
          <label htmlFor="name">Username</label>
          <input type="text" name="userName" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" />
        </div>
        <div>
          <label htmlFor="name">Password</label>
          <input type="password" name="password" />
        </div>
        <div>
          <input
            type="radio"
            name="isAdmin"
            value={false}
            onChange={changeRole}
            checked={!role}
          />
          Student
          <input
            type="radio"
            name="isAdmin"
            value={true}
            onChange={changeRole}
            checked={role}
          />
          Admin
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
