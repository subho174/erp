import { useEffect, useState, React } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = ({ backend_url }) => {
  const [role, setrole] = useState("true");
  const navigate = useNavigate();
  const [formData, setformData] = useState({
    userName: "",
    email: "",
    password: "",
    isAdmin: "false"
  });
  
  const getData = (e) => {
    e.preventDefault();
    setformData((prev) => ({ ...prev, isAdmin: true }));
    console.log(backend_url, formData);
    
    axios
      .get(`${backend_url}/user/register`, formData)
      .then(function (response) {
        console.log(response);
        let userDetails = [response.data.data];
        if (userDetails[0].isAdmin == true)
          navigate("/dashboard/admin", { state: { userData: userDetails[0] } });

        navigate("/dashboard/student", { state: { userData: userDetails[0] } })
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
    }
  }, [formData])
  
  const changeRole = (e) => {
    setrole(e.target.value);
    console.log(role);
  };

  return (
    <div className="signup">
      <header>Welcome to ERP</header>
      <form onSubmit={getData} onChange={changeUserData}>
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
            checked={role == "false"}
          />
          Student
          <input
            type="radio"
            name="isAdmin"
            value={true}
            onChange={changeRole}
            checked={role == "true"}
          />
          Admin
        </div>

        <button type="submit">Sign Up</button>

        <p onClick = {() => navigate("/login")}>Already Have an account ?</p>
      </form>
    </div>
  );
};

export default SignUp;
