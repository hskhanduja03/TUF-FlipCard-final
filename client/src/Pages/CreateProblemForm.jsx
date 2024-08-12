import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { Navigate } from "react-router-dom";
import axios from "axios";

export default function CreateProblemForm() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [difficulty, setDifficulty] = useState("medium");
  const [tags, setTags] = useState("");
  const { user } = useContext(UserContext);
  const [qCreated, setqCreated] = useState(false)

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  };

  if (!user) return <Navigate to={"/login"} />;
  if (qCreated) return <Navigate to={"/questions"} />;
  const handleSubmit = (e) => {
    e.preventDefault();
  
    // Collect data from form state
    const formData = {
      question,
      answer,
      difficulty,
      tags: tags.split(",").map((tag) => tag.trim()), // Convert tags to an array of trimmed strings
    };
  
    // Retrieve the token from cookies
    const token = getCookie('token');// Ensure token is logged correctly
  
    // Send the data to your backend
    axios
      .post("/questions", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Attach token in Authorization header
        },
      })
      .then((response) => {
        setqCreated(true)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="flex justify-center py-2 ">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg hover:ring-1 hover:ring-gray-300"
      >
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12 flex flex-col gap-5">
            <div className="flex justify-normal gap-2">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Note:
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Try to share the Approach first and then jump to the solution😊.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="question"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Question
                </label>
                <div className="mt-2">
                  <textarea
                    id="question"
                    name="question"
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter the problem statement here"
                  />
                </div>
              </div>

              <div className="col-span-full">
                <label
                  htmlFor="answer"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Answer
                </label>
                <div className="mt-2">
                  <textarea
                    id="answer"
                    name="answer"
                    rows={3}
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Enter the solution here"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="difficulty"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Difficulty
                </label>
                <div className="mt-2 flex gap-4">
                  <div
                    onClick={() => setDifficulty("easy")}
                    className={`cursor-pointer rounded-lg py-2 px-4 text-center text-sm font-medium ${
                      difficulty === "easy"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    } hover:bg-indigo-500 hover:text-white`}
                  >
                    Easy
                  </div>
                  <div
                    onClick={() => setDifficulty("medium")}
                    className={`cursor-pointer rounded-lg py-2 px-4 text-center text-sm font-medium ${
                      difficulty === "medium"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    } hover:bg-indigo-500 hover:text-white`}
                  >
                    Medium
                  </div>
                  <div
                    onClick={() => setDifficulty("hard")}
                    className={`cursor-pointer rounded-lg py-2 px-4 text-center text-sm font-medium ${
                      difficulty === "hard"
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-900"
                    } hover:bg-indigo-500 hover:text-white`}
                  >
                    Hard
                  </div>
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Tags
                </label>
                <div className="mt-2">
                  <input
                    id="tags"
                    name="tags"
                    type="text"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="Comma-separated tags"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
