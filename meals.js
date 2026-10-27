
const express = require("express");
const router = express.Router();
const db = require("../db/database");

// Get meals filtered by diet preference
router.get("/", (req, res) => {
    const { diet_type } = req.query;

    let sql = `
        SELECT
            id,
            name,
            category,
            ingredients,
            calories,
            protein,
            carbohydrates,
            fats,
            diet_type,
            suitable_goal
        FROM meals
    `;

    const values = [];

    if (diet_type) {
        sql += " WHERE LOWER(diet_type) = LOWER(?)";
        values.push(diet_type);
    }

    sql += " ORDER BY name ASC";

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error("Meal fetch failed:", err.message);

            return res.status(500).json({
                message: "Could not load meals."
            });
        }

        res.json(results);
    });
});

module.exports = router;
