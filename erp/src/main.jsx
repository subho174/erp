// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { React } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from "./Admin.jsx";
import Student from "./Student.jsx";
import Login from "./Login.jsx";
import Feedback from "./Feedback.jsx";
import { ProfileProvider } from "./ProfileContext.jsx";
import AdminUtils2 from "./AdminUtils2.jsx.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <ProfileProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/admin" element={<Admin />} />
        <Route path="/dashboard/student" element={<Student />} />
        <Route
          path="/dashboard/admin/feedbacks/:file_title"
          element={<Feedback />}
        />
        <Route path="/dashboard/admin/students" element={<AdminUtils2 />} />
      </Routes>
    </ProfileProvider>
  </BrowserRouter>
);
