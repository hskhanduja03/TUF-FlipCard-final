import React, { useRef, useState, useEffect, useContext } from "react";
import gsap from "gsap";
import { UserContext } from "../UserContext";
import { Link } from "react-router-dom";

const Card = ({
  frontContent,
  backContent,
  shouldFlip,
  createdBy,
  difficulty,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const topEle = useRef();
  const mainContent = useRef();
  const cardRef = useRef();
  const { user } = useContext(UserContext);

  const splitContent = (content) => {
    const text =
      typeof content === "string" ? content : content.props.children || "";
    const words = text.split(" ");
    return words.slice(0, 100).join(" ") + (words.length > 100 ? "..." : "");
  };

  const shouldTruncate = (content) => {
    const text =
      typeof content === "string" ? content : content.props.children || "";
    return text.split(" ").length > 100;
  };

  useEffect(() => {
    setIsFlipped(shouldFlip);
  }, [shouldFlip]);

  useEffect(() => {
    if (isFlipped) {
      gsap.to(cardRef.current, {
        duration: 0.5,
        rotationY: 180,
        ease: "power1.out",
      });
    } else {
      gsap.to(cardRef.current, {
        duration: 0.5,
        rotationY: 0,
        ease: "power1.out",
      });
    }
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMouseEnter = () => {
    if (!isFlipped) {
      gsap.to(topEle.current, {
        duration: 0.5,
        y: "0%",
        opacity: 1,
      });

      gsap.to(mainContent.current, {
        duration: 0.5,
        scale: 0.98,
        y: "5%",
        ease: "power1.out",
      });
    }
  };

  const handleMouseLeave = () => {
    if (!isFlipped) {
      gsap.to(topEle.current, {
        duration: 0.5,
        y: "-100%",
        opacity: 0,
        ease: "power1.out",
      });

      gsap.to(mainContent.current, {
        duration: 0.5,
        scale: 1,
        y: "0%",
        ease: "power1.out",
      });
      gsap.to(cardRef.current, {
        backgroundColor: "white",
      });
    }
  };

  return (
    <div
      className={`relative w-full h-full ${
        isFlipped ? "flip-card-flipped" : ""
      }`}
      onClick={handleFlip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flip-card-inner" ref={cardRef}>
        <div className="flip-card-front bg-white flex flex-col rounded-xl h-full relative">
          <div className="font-bold text-3xl absolute top-3 flex flex-col items-center gap-4">
            <span className="w-full text-center">Question</span>
            <div className="text-sm font-bold flex justify-between gap-10 p-2 bg-gray-300 rounded-md">
              <div className="text-gray-800">Contributed By: <span className=" text-blue-500">{createdBy}</span></div>
              <div className={`flex gap-2 `}>
                Difficulty: <span className={`${difficulty === 'Easy' ? 'text-green-500' : difficulty === 'Medium' ? 'text-yellow-500' : 'text-red-500'}`}>{difficulty}</span>
              </div>
            </div>
          </div>
          <div ref={mainContent} className="p-3">
            {shouldTruncate(frontContent)
              ? splitContent(frontContent)
              : frontContent}
          </div>
          <div className="absolute bottom-0 w-full text-center text-gray-500 p-2">
            <span>Tap or "Enter" to see Answer</span>
          </div>
        </div>
        <div className="flip-card-back bg-gray-200 flex items-center justify-center rounded-xl">
          <div className="font-bold text-3xl absolute top-3">Answer</div>
          <div className="p-3">
            {user ? (
              shouldTruncate(backContent) ? (
                splitContent(backContent)
              ) : (
                backContent
              )
            ) : (
              <div className="flex gap-1">
                <Link to={"/login"}>
                  <span className="font-bold text-blue-500">Login</span>
                </Link>
                <p>to see answer</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
