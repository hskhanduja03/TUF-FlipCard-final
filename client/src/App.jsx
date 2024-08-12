import React, { useState } from "react";
import Card from "./Components/Card";
import Login from "./Pages/Login";
import ButtonComp from "./Components/ButtonComp";
import Carousel from "./Components/Carousel";
import { Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Test from "./Pages/Test";
import { UserContextProvider } from "./UserContext";
import Navbar from "./Components/Navbar";
import Layout from "./Layout";
import CreateProblemForm from "./Pages/CreateProblemForm";
import axios from "axios";


axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL||"http://localhost:4000/api";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route path="/login" element={<Login />} />
          <Route path="/createProblem" element={<CreateProblemForm />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/test" element={<Test />} />
          <Route path="/nav" element={<Navbar />} />
          {/* <Route path="/dashboard" element={<Dashboard/>}/> */}
          <Route path="/questions" element={<Carousel />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
