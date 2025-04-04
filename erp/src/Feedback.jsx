import React, { useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import ProfileContext from "./ProfileContext";

const Feedback = () => {
  const location = useLocation();
  const { feedbacks } = location.state || {};
  const { fetchUser } = useContext(ProfileContext);
  const navigate = useNavigate();
  // console.log(feedbacks);

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <div className="justify-items-center content-center mx-auto grid gap-[1rem] w-[90%] md:w-[60%] xl:w-[40%] rounded-[0.75rem] p-[1rem_2rem] pb-[1.5rem] m-[5vh_0] bg-white">
        <header className="font-semibold text-[1.5rem]">Feedbacks</header>
        {feedbacks.length != 0 ? (
          feedbacks.map((feedback, i) => {
            return (
              <div
                className="rounded-[0.5rem] p-[0.5rem_1rem] w-[100%] border-2 border-gray-500"
                key={i}
              >
                <p className="font-medium text-[1.25rem]">
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
      <div className="flex justify-center">
        <button style={{ width: "200px" }} onClick={() => navigate(-1)}>
          <i className="fa-solid fa-arrow-left mr-2"></i>
          Back to dashboard
        </button>
      </div>
    </>
  );
};

export default Feedback;
