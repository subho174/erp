import React from "react";
import { useLocation } from "react-router-dom";

const Student = () => {
  const location = useLocation();
  const { userData } = location.state || {};
  return (
    <div>
      <h1>Wecome user</h1>
      <div>
        <h4>Pending assignments</h4>
      </div>
      <p>{userData.userName}</p>
      <p>{userData.email}</p>
    </div>
  );
};

export default Student;
