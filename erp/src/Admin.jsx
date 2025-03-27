import React from "react";
import { useLocation } from "react-router-dom";
import AdminUtils from "./AdminUtils";

const Admin = ({backend_url}) => {
  const location = useLocation();
  const { userData } = location.state || {};
  console.log(userData);
  return (
    <div>
      <p>{userData.userName}</p>
      <p>{userData.email}</p>
      <AdminUtils backend_url={backend_url} />
    </div>
  );
};

export default Admin;