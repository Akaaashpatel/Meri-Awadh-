const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://akashpatel:1234@cluster0.q0yiahu.mongodb.net");

// Define schema and model for user
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
});

const User = mongoose.model("User", userSchema);

// Route for checking backend status
app.get("/", (req, res) => {
    res.send("Backend is running");
});

// Route for handling sign-up requests
app.post("/signup", async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, password, email });
    await newUser.save();
    res.status(201).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  User.findOne({ username, password })
      .then(user => {
          if (user) {
              res.status(200).json({ success: true, message: 'Login successful!' });
          } else {
              res.status(401).json({ success: false, message: 'Invalid username or password.' });
          }
      })
      .catch(err => {
          console.error(err);
          res.status(500).json({ success: false, message: 'Error logging in.' });
      });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
