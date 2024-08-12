import React, { useContext, useState } from "react";
import axios from "axios";
import ButtonComp from "../Components/ButtonComp"; // Assuming you have a custom button component
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../UserContext";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [redirect, setredirect] = useState(false);
  const { user, setUser } = useContext(UserContext);

  if (user) return <Navigate to={"/questions"} />;

  if (redirect) return <Navigate to={"/questions"} />;
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "/login", // This should be relative to the `baseURL` you set
        { email, password },
        { withCredentials: true } // Allows cookies to be sent with the request
      );

      const { token } = response.data;
      setredirect(true); // Assuming setLogin sets the logged-in state in the parent component
      setUser(response.data);
    } catch (err) {
      setError("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <div className="w-full h-screen flex justify-center items-center">
          Loading...
        </div>
      ) : (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <svg
              width="125"
              height="26"
              viewBox="0 0 135 36"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-10 w-auto"
            >
              <path
                d="M0 5.89409H15.3693L9.5331 36H21.8368L27.2126 5.89409H42.2511L43.4131 0H1.17165L0 5.89409Z"
                fill="#D41F30"
              ></path>
              <path
                d="M47.2951 0L42.512 26.9438L49.9857 36H82.8746L89.1533 0H77.1198L71.8129 30.008H56.8626L54.4711 27.0927L59.1053 0H47.2951Z"
                fill="#D41F30"
              ></path>
              <path
                d="M86.9282 36H98.7784L100.699 23.9651H130.691L131.882 17.9993H101.825L103.214 8.93625L106.724 5.82379H122.018L120.826 11.9812H132.81L134.929 0H102.156L91.6286 9.00241L86.9282 36Z"
                fill="#D41F30"
              ></path>
            </svg>
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-semibold text-indigo-600 hover:text-indigo-500"
                    >
                      Forgot password?
                    </a>
                  </div>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div>
                <button type="submit" className="w-full">
                  <ButtonComp text={"Sign In"} />
                </button>
              </div>

              {error && (
                <p className="mt-4 text-center text-sm text-red-500">{error}</p>
              )}
            </form>

            <p className="mt-10 text-center text-sm text-gray-500">
              Not a member?{" "}
              <Link
                to={"/signup"}
                className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
              >
                Sign Up Now
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
