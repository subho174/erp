import { useState } from "react";
import "./App.css";
import SignUp from "./SignUp";

function App() {
  const backend_url = import.meta.env.VITE_BACKEND_URL;

  return (
    <>
      
      <SignUp backend_url={backend_url} />
    </>
  );
}

export default App;

