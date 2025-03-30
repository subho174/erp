import { useState } from "react";
import "./App.css";
import SignUp from "./SignUp";
import Navbar from "./Navbar";

function App({backend_url}) {
  // const backend_url = import.meta.env.VITE_BACKEND_URL;

  return (
    <>
    {/* <Navbar /> */}
    <div className="justify-items-center content-center">
      <SignUp backend_url={backend_url} />
    </div>
    </>
  );
}

export default App;

