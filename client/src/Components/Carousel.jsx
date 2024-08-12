import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import axios from "axios";
import Card from "./Card"; // Ensure this is the correct path
import Navbar from "./Navbar"; // Ensure this is the correct path

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipState, setFlipState] = useState(false);
  const [clickDisabled, setClickDisabled] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get('/questions', { withCredentials: true });
        if (Array.isArray(response.data)) {
          setQuestions(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Unexpected data format');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error fetching questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handlePrevClick = () => {
    if (clickDisabled) return;
    setClickDisabled(true);
    setFlipState(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? questions.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    if (clickDisabled) return;
    setClickDisabled(true);
    setFlipState(false);
    setCurrentIndex((prevIndex) =>
      prevIndex === questions.length - 1 ? 0 : prevIndex + 1
    );
  };

  useEffect(() => {
    const handleKeyDown = ({ code }) => {
      if (code === "ArrowRight") handleNextClick();
      if (code === "ArrowLeft") handlePrevClick();
      if (code === "Enter") setFlipState(prev => !prev);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNextClick, handlePrevClick]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setClickDisabled(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <>
      {/* <Navbar /> Include Navbar if needed */}
      <div className="h-screen w-screen flex items-center justify-center bg-gray-900 relative">
        <button
          onClick={handlePrevClick}
          className="absolute left-4 text-white text-3xl z-10"
          disabled={clickDisabled}
        >
          <FaChevronLeft />
        </button>
        <div className="w-full h-[80%] max-w-lg p-4 bg-white rounded-lg shadow-lg relative">
          {loading ? (
            <p>Loading questions...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : questions.length > 0 ? (
            <Card
              key={currentIndex}
              frontContent={questions[currentIndex].question}
              backContent={questions[currentIndex].answer}
              shouldFlip={flipState}
              createdBy={questions[currentIndex].createdBy.name}
              difficulty={questions[currentIndex].difficulty}
            />
          ) : (
            <p>No questions available</p>
          )}
        </div>
        <button
          onClick={handleNextClick}
          className="absolute right-4 text-white text-3xl z-10"
          disabled={clickDisabled}
        >
          <FaChevronRight />
        </button>
      </div>
    </>
  );
};

export default Carousel;
