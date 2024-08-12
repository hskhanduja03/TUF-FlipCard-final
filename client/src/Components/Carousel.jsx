import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { dsaQuestions } from "./Cards"; // Import card data from an external file or API
import Card from "./Card";
import Navbar from "./Navbar";

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipState, setFlipState] = useState(false);
  const [clickDisabled, setClickDisabled] = useState(false);

  const handlePrevClick = () => {
    if (clickDisabled) return;
    setClickDisabled(true);
    setFlipState(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? dsaQuestions.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    if (clickDisabled) return;
    setClickDisabled(true);
    setFlipState(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === dsaQuestions.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = ({ code }) => {
      if (code === "ArrowRight") handleNextClick();
      if (code === "ArrowLeft") handlePrevClick();
      if (code === "Enter") setFlipState(prev=>!prev);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextClick, handlePrevClick]);

  document.addEventListener("keydown", ({ code }) => {
    if (code === "ArrowRight") handleNextClick();
    if (code === "ArrowLeft") handlePrevClick();
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setClickDisabled(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <>
      
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 relative">
        <button
          onClick={handlePrevClick}
          className="absolute left-4 text-white text-3xl z-10"
        >
          <FaChevronLeft />
        </button>
        <div className="w-full h-[80%] max-w-lg p-4 bg-white rounded-lg shadow-lg relative">
          <Card
            key={currentIndex}
            frontContent={dsaQuestions[currentIndex].question}
            backContent={dsaQuestions[currentIndex].answer}
            shouldFlip={flipState}
          />
        </div>
        <button
          onClick={handleNextClick}
          className="absolute right-4 text-white text-3xl z-10"
        >
          <FaChevronRight />
        </button>
      </div>
    </>
  );
};

export default Carousel;
