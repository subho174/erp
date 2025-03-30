import { useContext, useState } from "react";
import "./App.css";
import SignUp from "./SignUp";
import ProfileContext from "./ProfileContext";

function App() {
  return (
    <>
    <div className="justify-items-center content-center">
      <SignUp />
    </div>
    </>
  );
}

export default App;

