import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

const Feedback = () => {
  const location = useLocation();
  const { feedbacks } = location.state || {};
  // console.log(feedbacks);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="justify-items-center content-center mx-auto grid gap-[1rem] w-[90%] md:w-[60%] xl:w-[40%] rounded-[0.75rem] p-[1rem_2rem] pb-[1.5rem] mt-[5vh] bg-[#0f172a] text-white">
        <header className="font-bold text-[1.25rem]">Feedbacks</header>
        {feedbacks.length != 0 ? (
          feedbacks.map((feedback, i) => {
            return (
              <div
                className="rounded-[0.5rem] p-[0.5rem_1rem] w-[100%] border-2 border-white"
                key={i}
              >
                <p className="font-bold text-[1.25rem]">
                  {feedback.owner.userName}
                </p>
                <p className="text-[1.15rem]">{feedback.content}</p>
              </div>
            );
          })
        ) : (
          <p>No feedback available</p>
        )}
      </div>
    </>
  );
};

export default Feedback;
