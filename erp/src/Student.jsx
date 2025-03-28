import axios from "axios";
import React from "react";
import { useLocation } from "react-router-dom";

const Student = () => {
  const location = useLocation();
  const { userData } = location.state || {};

  useEffect(() => {
    return () => {
      axios
        .get(`${backend_url}/user/get-assignments`)
        .then((res) => {
          console.log(res);
        })
        .catch((e) => {
          console.log(e);
        });
    };
  }, []);

  // const assignments = () => {
  //   return(

  //   )
  // }
  return (
    <div>
      <h1>Wecome user</h1>
      <div>
        <h4>Pending assignments</h4>
        <div>{assignments}</div>
      </div>
      <p>{userData.userName}</p>
      <p>{userData.email}</p>
    </div>
  );
};

export default Student;
