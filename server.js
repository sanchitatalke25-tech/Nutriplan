const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db/database");

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

// Profile routes
const profileRoutes = require("./routes/profile");
app.use("/api/profile", profileRoutes);


const mealRoutes = require("./routes/meals");
app.use("/api/meals", mealRoutes);


app.get("/", (req, res) => {
    res.send("NutriPlan Backend is Running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});