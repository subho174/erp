import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import Admin from './Admin.jsx';
import Student from './Student.jsx';
import Login from './Login.jsx';

const root = document.getElementById("root");
const backend_url = import.meta.env.VITE_BACKEND_URL;
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
ReactDOM.createRoot(root).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App backend_url={backend_url} />} />
      <Route path="/login" element={<Login backend_url={backend_url} />} />
      <Route path="/dashboard/admin" element={<Admin />} />
      <Route path="/dashboard/student" element={<Student />} />
    </Routes>
  </BrowserRouter>
);
