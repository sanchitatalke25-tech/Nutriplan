// Build one consistent meal object so the sample database stays easy to scan.
function makeMeal(id, category, name, foods, calories, protein, carbohydrates, fats, dietType, suitableGoals) {
  return { id, category, name, foods, calories, protein, carbohydrates, fats, dietType, suitableGoals };
}

// Sample nutrition values are estimates for this educational project.
const mealDatabase = [
  makeMeal("veg-breakfast-oats", "Breakfast", "Berry Overnight Oats", ["rolled oats", "oat beverage", "blueberries", "chia seeds"], 435, 18, 66, 12, "vegetarian", ["weight-loss", "maintain-weight"]),
  makeMeal("veg-breakfast-egg-toast", "Breakfast", "Spinach and Feta Egg Toast", ["eggs", "spinach", "feta cheese", "whole-grain toast"], 490, 29, 42, 22, "vegetarian", ["muscle-gain", "maintain-weight"]),
  makeMeal("veg-breakfast-yogurt", "Breakfast", "Greek Yogurt and Granola", ["Greek yogurt", "granola", "strawberries", "pumpkin seeds"], 520, 27, 57, 19, "vegetarian", ["weight-gain", "muscle-gain", "maintain-weight"]),
  makeMeal("veg-lunch-chickpea", "Lunch", "Chickpea Quinoa Greens Bowl", ["chickpeas", "quinoa", "cucumber", "spinach", "lemon dressing"], 570, 24, 82, 15, "vegetarian", ["weight-loss", "maintain-weight"]),
  makeMeal("veg-lunch-paneer", "Lunch", "Paneer Brown Rice Bowl", ["paneer", "brown rice", "bell peppers", "peas"], 690, 32, 86, 24, "vegetarian", ["weight-gain", "muscle-gain"]),
  makeMeal("veg-lunch-egg-avocado", "Lunch", "Egg, Avocado and Grain Plate", ["boiled eggs", "avocado", "barley", "tomatoes"], 635, 27, 66, 29, "vegetarian", ["muscle-gain", "maintain-weight"]),
  makeMeal("veg-snack-peanut", "Evening Snack", "Apple and Peanut Butter", ["apple", "peanut butter"], 290, 8, 35, 15, "vegetarian", ["weight-gain", "maintain-weight"]),
  makeMeal("veg-snack-cottage", "Evening Snack", "Cottage Cheese and Cucumber", ["cottage cheese", "cucumber", "whole-grain crackers"], 270, 24, 24, 9, "vegetarian", ["weight-loss", "muscle-gain"]),
  makeMeal("veg-snack-edamame", "Evening Snack", "Roasted Edamame", ["roasted edamame", "sea salt"], 300, 28, 22, 12, "vegetarian", ["weight-loss", "muscle-gain", "maintain-weight"]),
  makeMeal("veg-dinner-tofu", "Dinner", "Tofu Vegetable Stir-Fry", ["tofu", "broccoli", "carrots", "brown rice", "ginger"], 640, 32, 78, 19, "vegetarian", ["weight-loss", "muscle-gain"]),
  makeMeal("veg-dinner-lentil", "Dinner", "Lentil Tomato Curry and Rice", ["lentils", "tomatoes", "spinach", "basmati rice"], 680, 26, 103, 14, "vegetarian", ["weight-gain", "maintain-weight", "weight-loss"]),
  makeMeal("veg-dinner-paneer", "Dinner", "Paneer and Cauliflower Bowl", ["paneer", "cauliflower", "peas", "brown rice"], 760, 38, 62, 39, "vegetarian", ["weight-gain", "muscle-gain"]),

  makeMeal("nonveg-breakfast-wrap", "Breakfast", "Turkey and Egg Breakfast Wrap", ["turkey breast", "eggs", "whole-wheat tortilla", "spinach"], 530, 36, 49, 20, "non-vegetarian", ["muscle-gain", "maintain-weight"]),
  makeMeal("nonveg-breakfast-salmon", "Breakfast", "Smoked Salmon Rye Toast", ["smoked salmon", "rye toast", "avocado", "cucumber"], 480, 29, 49, 18, "non-vegetarian", ["weight-loss", "maintain-weight"]),
  makeMeal("nonveg-breakfast-yogurt", "Breakfast", "Yogurt Raspberry Protein Bowl", ["Greek yogurt", "raspberries", "rolled oats", "sunflower seeds"], 520, 31, 59, 16, "non-vegetarian", ["weight-gain", "muscle-gain", "maintain-weight"]),
  makeMeal("nonveg-lunch-chicken", "Lunch", "Grilled Chicken Quinoa Plate", ["grilled chicken", "quinoa", "spinach", "roasted peppers"], 620, 48, 64, 18, "non-vegetarian", ["weight-loss", "muscle-gain"]),
  makeMeal("nonveg-lunch-tuna", "Lunch", "Tuna and White Bean Sandwich", ["tuna", "white beans", "whole-grain bread", "lettuce"], 590, 42, 70, 13, "non-vegetarian", ["weight-loss", "maintain-weight"]),
  makeMeal("nonveg-lunch-peanut", "Lunch", "Chicken Peanut Satay Bowl", ["chicken breast", "peanut sauce", "brown rice", "broccoli"], 760, 51, 84, 22, "non-vegetarian", ["weight-gain", "muscle-gain"]),
  makeMeal("nonveg-snack-turkey", "Evening Snack", "Turkey Cucumber Rolls", ["turkey breast", "cucumber", "hummus"], 280, 32, 18, 9, "non-vegetarian", ["weight-loss", "muscle-gain"]),
  makeMeal("nonveg-snack-eggs", "Evening Snack", "Hard-Boiled Eggs and Grapes", ["hard-boiled eggs", "grapes"], 290, 15, 28, 14, "non-vegetarian", ["maintain-weight", "muscle-gain"]),
  makeMeal("nonveg-snack-yogurt", "Evening Snack", "Greek Yogurt and Seed Cup", ["Greek yogurt", "chia seeds", "raspberries"], 320, 26, 31, 11, "non-vegetarian", ["weight-gain", "muscle-gain", "maintain-weight"]),
  makeMeal("nonveg-dinner-salmon", "Dinner", "Salmon and Sweet Potato", ["salmon", "sweet potato", "broccoli", "olive oil"], 690, 43, 64, 27, "non-vegetarian", ["weight-loss", "muscle-gain"]),
  makeMeal("nonveg-dinner-chicken", "Dinner", "Chicken Lentil Rice Bowl", ["chicken thigh", "lentils", "brown rice", "carrots"], 740, 53, 79, 20, "non-vegetarian", ["maintain-weight", "muscle-gain"]),
  makeMeal("nonveg-dinner-beef", "Dinner", "Beef and Broccoli Brown Rice", ["lean beef", "broccoli", "brown rice", "sesame"], 780, 48, 77, 28, "non-vegetarian", ["weight-gain", "muscle-gain"]),

  makeMeal("vegan-breakfast-chia", "Breakfast", "Chia Berry Oat Bowl", ["rolled oats", "oat beverage", "chia seeds", "raspberries"], 440, 16, 64, 15, "vegan", ["weight-loss", "maintain-weight"]),
  makeMeal("vegan-breakfast-tofu", "Breakfast", "Tofu Mushroom Scramble", ["tofu", "mushrooms", "spinach", "roasted potatoes"], 520, 29, 45, 24, "vegan", ["muscle-gain", "maintain-weight"]),
  makeMeal("vegan-breakfast-peanut", "Breakfast", "Peanut Banana Overnight Oats", ["rolled oats", "oat beverage", "peanut butter", "banana"], 590, 22, 79, 22, "vegan", ["weight-gain", "muscle-gain"]),
  makeMeal("vegan-lunch-lentil", "Lunch", "Lentil Quinoa Kale Bowl", ["lentils", "quinoa", "kale", "tomatoes"], 610, 28, 88, 16, "vegan", ["weight-loss", "maintain-weight"]),
  makeMeal("vegan-lunch-tempeh", "Lunch", "Tempeh Brown Rice Bowl", ["tempeh", "brown rice", "broccoli", "carrots"], 690, 35, 82, 22, "vegan", ["muscle-gain", "maintain-weight"]),
  makeMeal("vegan-lunch-chickpea", "Lunch", "Chickpea Avocado Wrap", ["chickpeas", "avocado", "whole-wheat tortilla", "lettuce"], 650, 22, 86, 24, "vegan", ["weight-gain", "maintain-weight"]),
  makeMeal("vegan-snack-chickpea", "Evening Snack", "Paprika Roasted Chickpeas", ["roasted chickpeas", "paprika"], 270, 13, 42, 6, "vegan", ["weight-loss", "maintain-weight"]),
  makeMeal("vegan-snack-peanut", "Evening Snack", "Apple and Peanut Butter", ["apple", "peanut butter"], 300, 9, 36, 16, "vegan", ["weight-gain", "maintain-weight"]),
  makeMeal("vegan-snack-edamame", "Evening Snack", "Shelled Edamame", ["shelled edamame", "sea salt"], 290, 26, 21, 12, "vegan", ["weight-loss", "muscle-gain"]),
  makeMeal("vegan-dinner-tofu", "Dinner", "Tofu Vegetable Rice Bowl", ["tofu", "brown rice", "broccoli", "carrots", "tamari"], 670, 34, 84, 21, "vegan", ["weight-loss", "muscle-gain"]),
  makeMeal("vegan-dinner-lentil", "Dinner", "Red Lentil Spinach Curry", ["red lentils", "spinach", "basmati rice", "curry spices"], 720, 27, 106, 19, "vegan", ["weight-gain", "maintain-weight"]),
  makeMeal("vegan-dinner-bean", "Dinner", "Black Bean Sweet Potato Bowl", ["black beans", "sweet potato", "corn", "avocado"], 700, 25, 103, 18, "vegan", ["muscle-gain", "maintain-weight"])
];

const mealCategories = ["Breakfast", "Lunch", "Evening Snack", "Dinner"];
const calorieShares = { Breakfast: 0.25, Lunch: 0.3, "Evening Snack": 0.15, Dinner: 0.3 };

// Some common allergy words cover related ingredients as well.
const allergenAliases = {
  milk: ["milk", "dairy", "yogurt", "yoghurt", "cheese", "paneer", "butter", "cream", "whey"],
  dairy: ["milk", "dairy", "yogurt", "yoghurt", "cheese", "paneer", "butter", "cream", "whey"],
  egg: ["egg", "omelet", "omelette", "frittata"],
  peanut: ["peanut", "groundnut"],
  nut: ["almond", "walnut", "cashew", "pistachio", "pecan", "hazelnut", "peanut", "groundnut"],
  soy: ["soy", "tofu", "tempeh", "edamame"],
  fish: ["fish", "salmon", "tuna"],
  wheat: ["wheat", "bread", "rye", "tortilla", "flour", "pasta", "couscous"],
  gluten: ["wheat", "barley", "rye", "bread", "tortilla", "flour", "pasta", "couscous"]
};

function splitFoodList(value) {
  return String(value || "").split(/[,;\n]+/).map((item) => item.trim().toLowerCase()).filter(Boolean);
}

function expandAllergies(allergies) {
  return allergies.flatMap((allergy) => {
    const singular = allergy.endsWith("s") && allergy.length > 3 ? allergy.slice(0, -1) : allergy;
    return allergenAliases[allergy] || allergenAliases[singular] || [allergy, singular];
  });
}

function mealContainsAny(meal, terms) {
  const mealText = `${meal.name} ${meal.foods.join(" ")}`;

  return terms.some((term) => {
    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const wholeFoodPattern = new RegExp(`(^|[^a-z])${escapedTerm}s?($|[^a-z])`, "i");
    return wholeFoodPattern.test(mealText);
  });
}

function scoreMeal(meal, goal, targetCalories) {
  let score = -Math.abs(meal.calories - targetCalories) / 100;

  if (meal.suitableGoals.includes(goal)) {
    score += 1.5;
  }

  if (goal === "weight-loss") {
    score += meal.protein * 0.12 - meal.calories * 0.001;
  } else if (goal === "weight-gain") {
    score += meal.calories * 0.003;
  } else if (goal === "muscle-gain") {
    score += meal.protein * 0.14;
  }

  return score;
}

// Use local calendar dates for the daily record keys, not UTC dates.
function getLocalDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Keep the navigation and profile calculations shared across the static pages.
document.addEventListener("DOMContentLoaded", () => {
  // On narrow screens, the button shows or hides the page navigation.
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("is-open", !isExpanded);
    });
  }

  // Show the latest profile, generated plan, and daily progress on the home dashboard.
  const homeDashboard = document.querySelector("#home-dashboard");
  if (homeDashboard) {
    function readDashboardStorage(key) {
      try {
        return JSON.parse(localStorage.getItem(key) || "null");
      } catch (error) {
        return null;
      }
    }

    const dashboardProfile = readDashboardStorage("nutriplanProfile");
    const dashboardMealPlan = readDashboardStorage("nutriplanMealPlan");
    const dashboardProgress = readDashboardStorage("nutriplanDailyProgress") || {};
    const dashboardProfileExists = Boolean(
      dashboardProfile &&
      typeof dashboardProfile.fullName === "string" &&
      dashboardProfile.fullName.trim()
    );

    if (!dashboardProfileExists) {
      document.querySelector("#dashboard-empty").hidden = false;
      document.querySelector("#dashboard-data").hidden = true;
    } else {
      document.querySelector("#dashboard-empty").hidden = true;
      document.querySelector("#dashboard-data").hidden = false;
      document.querySelector("#dashboard-welcome").textContent = `Welcome back, ${dashboardProfile.fullName}. Here's your latest overview.`;
      document.querySelector("#dashboard-goal").textContent = {
        "weight-loss": "Weight Loss",
        "weight-gain": "Weight Gain",
        "maintain-weight": "Maintain Weight",
        "muscle-gain": "Muscle Gain"
      }[dashboardProfile.nutritionGoal] || "Not set";

      const bmi = Number(dashboardProfile.bmi);
      const calorieTarget = Number(dashboardProfile.dailyCalorieTarget);
      document.querySelector("#dashboard-bmi").textContent = Number.isFinite(bmi) ? bmi.toFixed(1) : "Not available";
      document.querySelector("#dashboard-bmi-category").textContent = dashboardProfile.bmiCategory || "";
      document.querySelector("#dashboard-calorie-target").textContent = Number.isFinite(calorieTarget) && calorieTarget > 0
        ? `${calorieTarget.toLocaleString()} kcal`
        : "Unavailable";

      const planMatchesProfile = Boolean(
        dashboardMealPlan &&
        Array.isArray(dashboardMealPlan.meals) &&
        Number.isFinite(calorieTarget) && calorieTarget > 0 &&
        Number(dashboardMealPlan.dailyCalorieTarget) === calorieTarget &&
        dashboardMealPlan.dietPreference === dashboardProfile.dietPreference &&
        dashboardMealPlan.nutritionGoal === dashboardProfile.nutritionGoal
      );
      const mealNames = document.querySelector("#dashboard-meal-names");
      mealNames.replaceChildren();
      if (planMatchesProfile) {
        document.querySelector("#dashboard-meal-count").textContent = `${dashboardMealPlan.meals.length} meals`;
        dashboardMealPlan.meals.slice(0, 4).forEach((meal) => {
          const item = document.createElement("li");
          item.textContent = `${meal.category}: ${meal.name}`;
          mealNames.append(item);
        });
      } else {
        document.querySelector("#dashboard-meal-count").textContent = "Not generated";
        const item = document.createElement("li");
        item.textContent = "No meal plan for this profile yet.";
        mealNames.append(item);
      }

      const todayProgress = dashboardProgress[getLocalDateKey(new Date())];
      const dashboardUnits = { calories: "kcal", protein: "g", carbohydrates: "g", fats: "g" };
      Object.keys(dashboardUnits).forEach((metric) => {
        const value = Number(todayProgress?.[metric]);
        document.querySelector(`#dashboard-${metric}`).textContent = todayProgress && Number.isFinite(value) && value >= 0
          ? `${value.toLocaleString()} ${dashboardUnits[metric]}`
          : "Not logged";
      });
    }
  }

  // The profile form collects values for BMI and future meal-planning features.
  const profileForm = document.querySelector("#nutrition-profile-form");
  const formStatus = document.querySelector("#form-status");

  if (profileForm && formStatus) {
    profileForm.addEventListener("submit", (event) => {
      event.preventDefault();

      // Keep the browser's required fields and numeric limits in effect.
      if (!profileForm.reportValidity()) {
        return;
      }

      const formValues = new FormData(profileForm);
      const profile = Object.fromEntries(formValues.entries());
      const age = Number(profile.age);
      const heightCm = Number(profile.heightCm);
      const weightKg = Number(profile.weightKg);

      // Check positive finite numbers before converting centimeters to meters.
      if (!Number.isFinite(age) || age <= 0) {
        formStatus.textContent = "Enter a valid age greater than zero.";
        profileForm.elements.age.focus();
        return;
      }

      if (!Number.isFinite(heightCm) || heightCm <= 0) {
        formStatus.textContent = "Enter a valid height greater than zero.";
        profileForm.elements.heightCm.focus();
        return;
      }

      if (!Number.isFinite(weightKg) || weightKg <= 0) {
        formStatus.textContent = "Enter a valid weight greater than zero.";
        profileForm.elements.weightKg.focus();
        return;
      }

      // BMI uses kilograms divided by height in meters squared.
      const heightMeters = heightCm / 100;
      const bmi = weightKg / (heightMeters * heightMeters);

      if (!Number.isFinite(bmi)) {
        formStatus.textContent = "Those height and weight values cannot be used to calculate BMI.";
        return;
      }

      const roundedBmi = Number(bmi.toFixed(1));

      // Select a general BMI range using the value that will be displayed.
      let bmiCategory;
      if (roundedBmi < 18.5) {
        bmiCategory = "Underweight";
      } else if (roundedBmi < 25) {
        bmiCategory = "Normal";
      } else if (roundedBmi < 30) {
        bmiCategory = "Overweight";
      } else {
        bmiCategory = "Obesity";
      }

      // Save all form values together with BMI for the plan and progress pages.
      profile.age = Number(profile.age);
      profile.heightCm = heightCm;
      profile.weightKg = weightKg;
      profile.bmi = roundedBmi.toFixed(1);
      profile.bmiCategory = bmiCategory;

      // Activity multipliers turn BMR into estimated maintenance calories.
      const activityMultipliers = {
        sedentary: 1.2,
        "lightly-active": 1.375,
        "moderately-active": 1.55,
        "very-active": 1.725
      };

      // Goal adjustments are centered within the ranges requested for this prototype.
      const goalAdjustments = {
        "weight-loss": -400,
        "weight-gain": 400,
        "maintain-weight": 0,
        "muscle-gain": 250
      };

      // The supplied Mifflin-St Jeor equations define coefficients for male and female.
      let genderOffset = null;
      if (profile.gender === "male") {
        genderOffset = 5;
      } else if (profile.gender === "female") {
        genderOffset = -161;
      }

      const activityMultiplier = activityMultipliers[profile.activityLevel];
      const goalAdjustment = goalAdjustments[profile.nutritionGoal];
      profile.calorieEstimateAvailable = false;
      profile.calorieEstimateMessage = "These details could not produce a usable calorie estimate. Review your profile and try again.";
      profile.bmr = null;
      profile.maintenanceCalories = null;
      profile.dailyCalorieTarget = null;

      if (genderOffset === null) {
        profile.calorieEstimateMessage = "The provided Mifflin-St Jeor equations in this prototype provide male and female formula options only. BMI remains available.";
      }

      if (genderOffset !== null && Number.isFinite(activityMultiplier) && Number.isFinite(goalAdjustment)) {
        // Mifflin-St Jeor estimates resting energy use from age, height, weight, and formula coefficient.
        const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + genderOffset;
        const maintenanceCalories = bmr * activityMultiplier;
        const dailyCalorieTarget = maintenanceCalories + goalAdjustment;

        // Store whole-number estimates only when all three results are usable.
        if (Number.isFinite(bmr) && bmr > 0 && Number.isFinite(maintenanceCalories) && maintenanceCalories > 0 && Number.isFinite(dailyCalorieTarget) && dailyCalorieTarget > 0) {
          profile.calorieEstimateAvailable = true;
          profile.bmr = Math.round(bmr);
          profile.maintenanceCalories = Math.round(maintenanceCalories);
          profile.dailyCalorieTarget = Math.round(dailyCalorieTarget);
          profile.calorieEstimateMessage = "";
        }
      }

      try {
        // Merge with the prior record so other saved profile properties are not discarded.
        const previousProfile = JSON.parse(localStorage.getItem("nutriplanProfile") || "{}");
        const existingProperties = previousProfile && typeof previousProfile === "object" && !Array.isArray(previousProfile)
          ? previousProfile
          : {};
        const updatedProfile = { ...existingProperties, ...profile };
        localStorage.setItem("nutriplanProfile", JSON.stringify(updatedProfile));
      } catch (error) {
        formStatus.textContent = "Your browser could not save this profile. Check its storage settings and try again.";
        return;
      }

      window.location.href = "plan.html";
    });
  }

  // Show the saved BMI summary after a profile has been submitted.
  const bmiSummary = document.querySelector("#bmi-summary");
  if (bmiSummary) {
    try {
      const savedProfile = JSON.parse(localStorage.getItem("nutriplanProfile"));
      const savedBmi = Number(savedProfile?.bmi);

      if (Number.isFinite(savedBmi) && typeof savedProfile.bmiCategory === "string") {
        document.querySelector("#bmi-value").textContent = savedBmi.toFixed(1);
        document.querySelector("#bmi-category").textContent = savedProfile.bmiCategory;
        document.querySelector("#profile-name").textContent = savedProfile.fullName || "Profile";
        document.querySelector("#profile-goal").textContent = {
          "weight-loss": "Weight Loss",
          "weight-gain": "Weight Gain",
          "maintain-weight": "Maintain Weight",
          "muscle-gain": "Muscle Gain"
        }[savedProfile.nutritionGoal] || "Not set";
        document.querySelector("#profile-diet").textContent = {
          vegetarian: "Vegetarian",
          "non-vegetarian": "Non-Vegetarian",
          vegan: "Vegan"
        }[savedProfile.dietPreference] || "Not set";
        bmiSummary.hidden = false;

        const calorieEstimates = document.querySelector("#calorie-estimates");
        const calorieUnavailable = document.querySelector("#calorie-unavailable");
        const calorieValues = [savedProfile.bmr, savedProfile.maintenanceCalories, savedProfile.dailyCalorieTarget].map(Number);

        document.querySelector("#profile-calorie-target").textContent = Number.isFinite(calorieValues[2]) && calorieValues[2] > 0
          ? calorieValues[2].toLocaleString()
          : "Unavailable";

        if (savedProfile.calorieEstimateAvailable && calorieValues.every((value) => Number.isFinite(value) && value > 0)) {
          document.querySelector("#bmr-value").textContent = calorieValues[0].toLocaleString();
          document.querySelector("#maintenance-calories").textContent = calorieValues[1].toLocaleString();
          document.querySelector("#daily-calorie-target").textContent = calorieValues[2].toLocaleString();
          calorieEstimates.hidden = false;
        } else {
          calorieUnavailable.textContent = typeof savedProfile.calorieEstimateMessage === "string" && savedProfile.calorieEstimateMessage
            ? savedProfile.calorieEstimateMessage
            : "No calorie estimate is saved for this profile yet. Submit the profile form again to calculate one.";
          calorieUnavailable.hidden = false;
        }
      }
    } catch (error) {
      // Keep the summary hidden if storage is unavailable or contains invalid data.
    }
  }

  // The plan page needs a complete profile and an estimated daily calorie target.
  const personalizedPlan = document.querySelector("#personalized-plan");
  const profileNeeded = document.querySelector("#profile-needed");

  if (personalizedPlan && profileNeeded) {
    let savedProfile = null;

    try {
      savedProfile = JSON.parse(localStorage.getItem("nutriplanProfile"));
    } catch (error) {
      savedProfile = null;
    }

    const allowedDiets = ["vegetarian", "non-vegetarian", "vegan"];
    const allowedGoals = ["weight-loss", "weight-gain", "maintain-weight", "muscle-gain"];
    const dailyCalorieTarget = Number(savedProfile?.dailyCalorieTarget);
    const hasCompleteProfile = Boolean(
      savedProfile &&
      typeof savedProfile.fullName === "string" && savedProfile.fullName.trim() &&
      Number.isFinite(Number(savedProfile.age)) && Number(savedProfile.age) > 0 &&
      Number.isFinite(Number(savedProfile.heightCm)) && Number(savedProfile.heightCm) > 0 &&
      Number.isFinite(Number(savedProfile.weightKg)) && Number(savedProfile.weightKg) > 0 &&
      Number.isFinite(Number(savedProfile.bmi)) &&
      allowedDiets.includes(savedProfile.dietPreference) &&
      allowedGoals.includes(savedProfile.nutritionGoal) &&
      savedProfile.calorieEstimateAvailable === true &&
      Number.isFinite(dailyCalorieTarget) && dailyCalorieTarget > 0
    );

    if (!hasCompleteProfile) {
      if (savedProfile?.calorieEstimateMessage) {
        document.querySelector("#profile-needed-message").textContent = `${savedProfile.calorieEstimateMessage} Update your profile to continue.`;
      }
    } else {
      personalizedPlan.hidden = false;
      profileNeeded.hidden = true;

      const generatedMeals = document.querySelector("#generated-meals");
      const regenerateButton = document.querySelector("#regenerate-plan");
      const planWarning = document.querySelector("#meal-plan-warning");
      const planError = document.querySelector("#meal-plan-error");
      const dailySummary = document.querySelector("#daily-summary");
      let currentMealIds = [];

      function renderMealCard(meal) {
        const article = document.createElement("article");
        article.className = "planned-meal";

        const category = document.createElement("p");
        category.className = "planned-meal-category";
        category.textContent = meal.category;

        const name = document.createElement("h3");
        name.textContent = meal.name;

        const foodsLabel = document.createElement("p");
        foodsLabel.className = "planned-meal-label";
        foodsLabel.textContent = "Food items";

        const foods = document.createElement("p");
        foods.className = "planned-meal-foods";
        foods.textContent = meal.foods.join(", ");

        const nutrition = document.createElement("dl");
        nutrition.className = "meal-nutrition";
        const nutritionValues = [
          ["Calories", `${meal.calories} kcal`],
          ["Protein", `${meal.protein} g`],
          ["Carbohydrates", `${meal.carbohydrates} g`],
          ["Fats", `${meal.fats} g`]
        ];

        nutritionValues.forEach(([label, value]) => {
          const item = document.createElement("div");
          const term = document.createElement("dt");
          const detail = document.createElement("dd");
          term.textContent = label;
          detail.textContent = value;
          item.append(term, detail);
          nutrition.append(item);
        });

        article.append(category, name, foodsLabel, foods, nutrition);
        return article;
      }

      function generateMealPlan(previousMealIds) {
        const allergies = expandAllergies(splitFoodList(savedProfile.foodAllergies));
        const dislikes = splitFoodList(savedProfile.dislikedFoods);
        const selectedMeals = [];
        let dislikedFoodsIncluded = false;

        try {
          mealCategories.forEach((category) => {
            const categoryOptions = mealDatabase.filter((meal) =>
              meal.category === category && meal.dietType === savedProfile.dietPreference
            );
            const allergySafeOptions = categoryOptions.filter((meal) => !mealContainsAny(meal, allergies));

            if (allergySafeOptions.length === 0) {
              throw new Error(`No ${savedProfile.dietPreference} ${category.toLowerCase()} options remain after applying your allergy exclusions. Update your profile to continue.`);
            }

            const dislikeSafeOptions = allergySafeOptions.filter((meal) => !mealContainsAny(meal, dislikes));
            const options = dislikeSafeOptions.length > 0 ? dislikeSafeOptions : allergySafeOptions;
            if (dislikeSafeOptions.length === 0 && dislikes.length > 0) {
              dislikedFoodsIncluded = true;
            }

            const targetCalories = dailyCalorieTarget * calorieShares[category];
            const rankedOptions = [...options].sort((firstMeal, secondMeal) =>
              scoreMeal(secondMeal, savedProfile.nutritionGoal, targetCalories) -
              scoreMeal(firstMeal, savedProfile.nutritionGoal, targetCalories)
            );

            // Prefer a different meal from the last plan, when another safe option exists.
            const unusedOptions = rankedOptions.filter((meal) => !previousMealIds.includes(meal.id));
            const availableOptions = unusedOptions.length > 0 ? unusedOptions : rankedOptions;
            const topOptions = availableOptions.slice(0, Math.min(3, availableOptions.length));
            const randomIndex = Math.floor(Math.random() * topOptions.length);
            selectedMeals.push(topOptions[randomIndex]);
          });
        } catch (error) {
          generatedMeals.replaceChildren();
          dailySummary.hidden = true;
          regenerateButton.hidden = true;
          planWarning.hidden = true;
          planError.textContent = error.message;
          planError.hidden = false;
          return;
        }

        planError.hidden = true;
        planWarning.textContent = dislikedFoodsIncluded
          ? "Some disliked foods may appear because safe alternatives were limited. Allergy exclusions are still applied."
          : "";
        planWarning.hidden = !dislikedFoodsIncluded;
        generatedMeals.replaceChildren(...selectedMeals.map(renderMealCard));

        const totals = selectedMeals.reduce((summary, meal) => ({
          calories: summary.calories + meal.calories,
          protein: summary.protein + meal.protein,
          carbohydrates: summary.carbohydrates + meal.carbohydrates,
          fats: summary.fats + meal.fats
        }), { calories: 0, protein: 0, carbohydrates: 0, fats: 0 });

        document.querySelector("#total-calories").textContent = totals.calories.toLocaleString();
        document.querySelector("#total-protein").textContent = totals.protein.toLocaleString();
        document.querySelector("#total-carbohydrates").textContent = totals.carbohydrates.toLocaleString();
        document.querySelector("#total-fats").textContent = totals.fats.toLocaleString();

        currentMealIds = selectedMeals.map((meal) => meal.id);
        dailySummary.hidden = false;

        // Save the generated meals and their totals for the Progress page.
        try {
          const savedMealPlan = JSON.parse(localStorage.getItem("nutriplanMealPlan") || "{}");
          const existingMealPlan = savedMealPlan && typeof savedMealPlan === "object" && !Array.isArray(savedMealPlan)
            ? savedMealPlan
            : {};
          localStorage.setItem("nutriplanMealPlan", JSON.stringify({
            ...existingMealPlan,
            mealIds: currentMealIds,
            meals: selectedMeals,
            totals,
            dailyCalorieTarget,
            dietPreference: savedProfile.dietPreference,
            nutritionGoal: savedProfile.nutritionGoal,
            updatedDate: getLocalDateKey(new Date())
          }));
        } catch (error) {
          // The current plan remains usable even if the browser blocks storage.
        }
      }

      let previousMealIds = [];
      try {
        const previousPlan = JSON.parse(localStorage.getItem("nutriplanMealPlan") || "{}");
        if (Array.isArray(previousPlan.mealIds)) {
          previousMealIds = previousPlan.mealIds;
        }
      } catch (error) {
        previousMealIds = [];
      }

      generateMealPlan(previousMealIds);
      regenerateButton.addEventListener("click", () => generateMealPlan(currentMealIds));
    }
  }

  // Set up daily tracking only on progress.html.
  const trackingDashboard = document.querySelector("#tracking-dashboard");
  if (trackingDashboard) {
    const profileSummary = document.querySelector("#progress-profile-summary");
    const profileEmptyState = document.querySelector("#profile-empty-state");
    const planEmptyState = document.querySelector("#plan-empty-state");
    const trackingForm = document.querySelector("#tracking-form");
    const trackingStatus = document.querySelector("#tracking-status");
    const todayKey = getLocalDateKey(new Date());
    const metricUnits = { calories: "kcal", protein: "g", carbohydrates: "g", fats: "g" };
    let profile = null;
    let mealPlan = null;
    let dailyRecords = {};

    // Read the profile, latest selected meal totals, and daily records safely.
    try {
      profile = JSON.parse(localStorage.getItem("nutriplanProfile"));
    } catch (error) {
      profile = null;
    }

    try {
      mealPlan = JSON.parse(localStorage.getItem("nutriplanMealPlan"));
    } catch (error) {
      mealPlan = null;
    }

    try {
      const savedRecords = JSON.parse(localStorage.getItem("nutriplanDailyProgress") || "{}");
      if (savedRecords && typeof savedRecords === "object" && !Array.isArray(savedRecords)) {
        dailyRecords = savedRecords;
      }
    } catch (error) {
      dailyRecords = {};
    }

    function formatTrackingNumber(value) {
      return Number(value.toFixed(1)).toLocaleString();
    }

    function renderWeeklyRecords() {
      const weeklyRecords = document.querySelector("#weekly-records");
      weeklyRecords.replaceChildren();
      let hasRecentRecord = false;

      for (let daysAgo = 6; daysAgo >= 0; daysAgo -= 1) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        const dateKey = getLocalDateKey(date);
        const record = dailyRecords[dateKey];
        const row = document.createElement("tr");
        const dateCell = document.createElement("th");
        dateCell.scope = "row";
        dateCell.textContent = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        row.append(dateCell);

        ["calories", "protein", "carbohydrates", "fats"].forEach((metric) => {
          const cell = document.createElement("td");
          const value = Number(record?.[metric]);
          cell.textContent = record && Number.isFinite(value) && value >= 0 ? formatTrackingNumber(value) : "--";
          row.append(cell);
        });

        if (record) {
          hasRecentRecord = true;
        }
        weeklyRecords.append(row);
      }

      document.querySelector("#weekly-empty-message").hidden = hasRecentRecord;
    }

    renderWeeklyRecords();

    const hasProfile = Boolean(
      profile &&
      typeof profile.fullName === "string" && profile.fullName.trim() &&
      Number.isFinite(Number(profile.weightKg)) && Number(profile.weightKg) > 0
    );

    if (hasProfile) {
      profileSummary.hidden = false;
      profileEmptyState.hidden = true;
      document.querySelector("#progress-name").textContent = profile.fullName;
      document.querySelector("#progress-goal").textContent = {
        "weight-loss": "Weight Loss",
        "weight-gain": "Weight Gain",
        "maintain-weight": "Maintain Weight",
        "muscle-gain": "Muscle Gain"
      }[profile.nutritionGoal] || "Not set";

      const calorieTarget = Number(profile.dailyCalorieTarget);
      document.querySelector("#progress-calorie-target").textContent = Number.isFinite(calorieTarget) && calorieTarget > 0
        ? `${calorieTarget.toLocaleString()} kcal`
        : "Unavailable";
      document.querySelector("#progress-bmi").textContent = Number.isFinite(Number(profile.bmi)) ? Number(profile.bmi).toFixed(1) : "Not available";
      document.querySelector("#progress-bmi-category").textContent = profile.bmiCategory || "";

      // Use the original profile weight when saved, otherwise the profile weight is the starting point.
      const currentWeight = Number(profile.weightKg);
      const startingWeight = Number(profile.startingWeightKg ?? profile.weightKg);
      const targetWeight = Number(profile.targetWeightKg);
      const hasStartingWeight = Number.isFinite(startingWeight) && startingWeight > 0;
      const hasTargetWeight = Number.isFinite(targetWeight) && targetWeight > 0;

      document.querySelector("#weight-goal-section").hidden = false;
      document.querySelector("#current-weight").textContent = `${currentWeight.toLocaleString()} kg`;
      document.querySelector("#weight-goal").textContent = {
        "weight-loss": "Weight Loss",
        "weight-gain": "Weight Gain",
        "maintain-weight": "Maintain Weight",
        "muscle-gain": "Muscle Gain"
      }[profile.nutritionGoal] || "Not set";
      document.querySelector("#starting-weight").textContent = hasStartingWeight ? `${startingWeight.toLocaleString()} kg` : "Not set";
      document.querySelector("#target-weight").textContent = hasTargetWeight ? `${targetWeight.toLocaleString()} kg` : "Not set";

      if (hasStartingWeight && hasTargetWeight) {
        const weightProgress = startingWeight === targetWeight
          ? (currentWeight === targetWeight ? 100 : 0)
          : Math.max(0, Math.min(100, ((currentWeight - startingWeight) / (targetWeight - startingWeight)) * 100));
        const roundedWeightProgress = Math.round(weightProgress);
        document.querySelector("#weight-progress-value").textContent = `${roundedWeightProgress}%`;
        document.querySelector("#weight-progress-fill").style.width = `${roundedWeightProgress}%`;
        document.querySelector("#weight-progressbar").setAttribute("aria-valuenow", String(roundedWeightProgress));
        document.querySelector("#weight-progress").hidden = false;
        document.querySelector("#weight-progress-empty").hidden = true;
      }
    }

    const mealTotals = mealPlan?.totals;
    const progressTargets = {
      calories: Number(profile?.dailyCalorieTarget),
      protein: Number(mealTotals?.protein),
      carbohydrates: Number(mealTotals?.carbohydrates),
      fats: Number(mealTotals?.fats)
    };
    const hasMealPlan = Boolean(
      mealPlan &&
      Array.isArray(mealPlan.meals) && mealPlan.meals.length > 0 &&
      Number(mealPlan.dailyCalorieTarget) === Number(profile?.dailyCalorieTarget) &&
      mealPlan.dietPreference === profile?.dietPreference &&
      mealPlan.nutritionGoal === profile?.nutritionGoal &&
      Object.values(progressTargets).every((target) => Number.isFinite(target) && target > 0)
    );

    if (!hasProfile) {
      profileEmptyState.hidden = false;
      planEmptyState.hidden = true;
    } else if (!hasMealPlan) {
      planEmptyState.hidden = false;
      if (!(Number(profile.dailyCalorieTarget) > 0)) {
        document.querySelector("#plan-empty-message").textContent = "A valid calorie target is not available in your profile. Complete your profile again before tracking against a daily plan.";
      }
    } else {
      planEmptyState.hidden = true;
      trackingDashboard.hidden = false;
      const todayRecord = dailyRecords[todayKey];

      function updateMetric(metric, target, consumed) {
        const safeTarget = Number.isFinite(target) && target > 0 ? target : 0;
        const safeConsumed = Number.isFinite(consumed) && consumed >= 0 ? consumed : 0;
        const progressBar = document.querySelector(`#${metric}-progressbar`);
        const progressFill = document.querySelector(`#${metric}-bar`);
        const remaining = Math.max(0, safeTarget - safeConsumed);
        const percent = safeTarget > 0 ? Math.min(100, (safeConsumed / safeTarget) * 100) : 0;

        document.querySelector(`#${metric}-target`).textContent = formatTrackingNumber(safeTarget);
        document.querySelector(`#${metric}-consumed`).textContent = formatTrackingNumber(safeConsumed);
        document.querySelector(`#${metric}-remaining`).textContent = safeConsumed > safeTarget
          ? `${formatTrackingNumber(safeConsumed - safeTarget)} ${metricUnits[metric]} over target`
          : `${formatTrackingNumber(remaining)} ${metricUnits[metric]}`;
        progressBar.setAttribute("aria-valuemax", String(safeTarget));
        progressBar.setAttribute("aria-valuenow", String(Math.min(safeConsumed, safeTarget)));
        progressFill.style.width = `${percent}%`;
      }

      const initialConsumed = todayRecord || { calories: 0, protein: 0, carbohydrates: 0, fats: 0 };
      Object.keys(progressTargets).forEach((metric) => {
        updateMetric(metric, progressTargets[metric], Number(initialConsumed[metric] || 0));
        trackingForm.elements[metric].value = todayRecord ? String(initialConsumed[metric]) : "";
      });
      document.querySelector("#tracking-empty-message").hidden = Boolean(todayRecord);

      trackingForm.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!trackingForm.reportValidity()) {
          return;
        }

        const formData = new FormData(trackingForm);
        const newRecord = {};
        for (const metric of Object.keys(progressTargets)) {
          const rawValue = String(formData.get(metric) || "").trim();
          const value = Number(rawValue);
          if (!rawValue || !Number.isFinite(value) || value < 0) {
            trackingStatus.textContent = `Enter a valid, non-negative value for ${metric}.`;
            trackingForm.elements[metric].focus();
            return;
          }
          newRecord[metric] = value;
        }

        newRecord.updatedAt = new Date().toISOString();
        dailyRecords[todayKey] = newRecord;

        try {
          localStorage.setItem("nutriplanDailyProgress", JSON.stringify(dailyRecords));
        } catch (error) {
          trackingStatus.textContent = "Progress could not be saved in this browser.";
          return;
        }

        Object.keys(progressTargets).forEach((metric) => updateMetric(metric, progressTargets[metric], newRecord[metric]));
        document.querySelector("#tracking-empty-message").hidden = true;
        trackingStatus.textContent = "Today's progress has been saved.";
        renderWeeklyRecords();
      });

      document.querySelector("#reset-today").addEventListener("click", () => {
        if (!window.confirm("Reset today's nutrition progress? This will clear today's saved intake values.")) {
          return;
        }

        delete dailyRecords[todayKey];
        try {
          localStorage.setItem("nutriplanDailyProgress", JSON.stringify(dailyRecords));
        } catch (error) {
          trackingStatus.textContent = "Today's progress could not be cleared in this browser.";
          return;
        }

        trackingForm.reset();
        Object.keys(progressTargets).forEach((metric) => updateMetric(metric, progressTargets[metric], 0));
        document.querySelector("#tracking-empty-message").hidden = false;
        trackingStatus.textContent = "Today's progress has been reset.";
        renderWeeklyRecords();
      });
    }

  }
});