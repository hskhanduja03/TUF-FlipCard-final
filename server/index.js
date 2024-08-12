const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User.model");
const Question = require("./models/Question.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = process.env.JWT_SECRET || "default_secret"; // Use environment variable for JWT secret

const corsOptions = {
  origin: [
    "http://127.0.0.1:5173",
    "https://tuf-flipcard-final-frontend.onrender.com",
  ], // List all allowed origins
  credentials: true, // Allow cookies to be sent
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
  allowedHeaders: "Content-Type,Authorization", // Allow specific headers
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("DB connected");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server started-${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

app.get("/api/test", (req, res) => {
  res.json("test ok");
});

app.post("/api/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Create new user
    const newUser = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    // Create JWT token
    const token = jwt.sign(
      { email: newUser.email, id: newUser._id },
      jwtSecret
    );

    // Send response with cookie
    res
      .cookie("token", token, {
        httpOnly: true, // Ensure client-side JavaScript can't access the cookie
        // secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
        sameSite: "Strict", // Adjust based on your requirements
        maxAge: 3600000, // Cookie expiration time
      })
      .status(201)
      .json({
        message: "User registered successfully",
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const truepass = bcrypt.compareSync(password, userDoc.password);
      if (truepass) {
        const token = jwt.sign(
          { email: userDoc.email, id: userDoc._id },
          jwtSecret
        );


        res
          .cookie("token", token, {
            httpOnly: true,
            sameSite: "Strict",
            maxAge: 3600000,
            path: "/", // Ensure this matches your application's needs
          })
          .json({
            _id: userDoc._id,
            name: userDoc.name,
            email: userDoc.email,
          });
      } else {
        res.status(422).json("Wrong password");
      }
    } else {
      res.status(422).json("User not found");
    }
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (token == null) return res.sendStatus(401); // No token provided

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Invalid token
    req.user = user;
    next();
  });
};

app.post("/api/logout", (req, res) => {
  // Clear the authentication cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});

// Route to create a question
app.post("/api/questions", authenticateToken, async (req, res) => {
  try {
    const { question, answer, difficulty, tags } = req.body;
    const newQuestion = new Question({
      question,
      answer,
      difficulty,
      tags,
      createdBy: req.user.id, // Associate the question with the logged-in user
    });
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(400).json({ message: "Error creating question", error });
  }
});

// Route to edit a question
app.put("/api/questions/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);

    // Check if the logged-in user is the creator of the question
    if (question.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Permission denied" });
    }

    // Update the question fields
    question.question = req.body.question || question.question;
    question.answer = req.body.answer || question.answer;
    question.difficulty = req.body.difficulty || question.difficulty;
    question.tags = req.body.tags || question.tags;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    res.status(400).json({ message: "Error editing question", error });
  }
});

app.get("/api/profile", async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const tokenData = jwt.verify(token, jwtSecret);
      const user = await User.findById(tokenData.id);
      if (user) {
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
        });
      } else {
        res.status(404).json({ error: "User not found" });
      }
    } catch (error) {
      res.status(401).json({ error: "Unauthorized" });
    }
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
});

app.post("/api/logout", (req, res) => {
  // Clear the authentication cookie
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
});
