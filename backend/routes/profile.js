const express = require("express");
const router = express.Router();

const db = require("../db/database");
const jwt = require("jsonwebtoken");

// Verify the user's login token
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Please log in first."
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: "Invalid or expired login token."
            });
        }

        req.user = {
    id: user.userId
};
        next();
    });
}

// Save the nutrition profile
router.post("/", authenticateToken, (req, res) => {
    const {
        age,
        gender,
        height,
        weight,
        goal,
        activity_level,
        diet_type,
        allergies,
        disliked_foods,
        bmi,
        calorie_target
        
    } = req.body;

    const sql = `
        INSERT INTO profiles
        (
            user_id, age, gender, height, weight,
            goal, activity_level, diet_type,
            allergies, disliked_foods, bmi, calorie_target
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        req.user.id,
        age ?? null,
        gender ?? null,
        height ?? null,
        weight ?? null,
        goal ?? null,
        activity_level ?? null,
        diet_type ?? null,
        allergies ?? null,
        disliked_foods ?? null,
        bmi ?? null,
        calorie_target ?? null
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("Profile save failed:", err.message);

            return res.status(500).json({
                message: "Could not save your nutrition profile."
            });
        }

        res.status(201).json({
            message: "Nutrition profile saved successfully!",
            profileId: result.insertId
        });
    });
});

module.exports = router;