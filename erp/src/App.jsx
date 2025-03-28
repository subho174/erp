import { useState } from "react";
import "./App.css";
import SignUp from "./SignUp";

function App({backend_url}) {
  // const backend_url = import.meta.env.VITE_BACKEND_URL;

  return (
    <div className="flex justify-center">
      <SignUp backend_url={backend_url} />
    </div>
  );
}

export default App;

