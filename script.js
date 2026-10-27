// ...existing code...

let mealDatabase = [];

function normalizeMealCategory(value) {
  const category = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  const categoryNames = {
    breakfast: "Breakfast",
    lunch: "Lunch",
    "evening snack": "Evening Snack",
    snack: "Evening Snack",
    snacks: "Evening Snack",
    dinner: "Dinner",
    supper: "Dinner"
  };

  return categoryNames[category] || null;
}

function inferMealCategory(row, ingredients = []) {
  const explicitCategory = normalizeMealCategory(row.category || row.meal_category || row.meal_type);
  if (explicitCategory) return explicitCategory;

  const mealName = String(row.name || "").toLowerCase();

  if (/breakfast|oats?|oatmeal|porridge|poha|idli|upma|chilla|paratha|thepla|dosa|omelette|omelet|egg bhurji|toast|sabudana khichdi/.test(mealName)) {
    return "Breakfast";
  }

  if (/snack|roasted chickpeas|roasted chana|makhana|chikki|fruit chaat|fruit and nut bowl|sprouts chaat|curd with fruit|boiled sweet potato/.test(mealName)) {
    return "Evening Snack";
  }

  if (/salad|sandwich|soup/.test(mealName)) {
    return "Lunch";
  }

  if (/curry|biryani|tikka|keema|pulao|khichdi|stir fry|vegetable rice|dal rice|rajma rice|chole with rice|paneer bhurji|sabzi with chapati/.test(mealName)) {
    return "Dinner";
  }

  const ingredientText = ingredients.join(" ").toLowerCase();
  if (/breakfast|oatmeal|porridge/.test(ingredientText)) return "Breakfast";

  return null;
}

function normalizeDietType(value) {
  const dietType = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-")
    .replace(/-+/g, "-");

  if (["nonveg", "non-veg", "nonvegetarian"].includes(dietType)) {
    return "non-vegetarian";
  }

  return dietType;
}

async function loadMealsFromDatabase() {
  const response = await fetch("http://localhost:5000/api/meals");

  if (!response.ok) {
    throw new Error("Could not load meals from the MySQL database.");
  }

  const rows = await response.json();

  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error("No meals were found in the MySQL database.");
  }

  return rows.map((row) => {
    const ingredients = Array.isArray(row.ingredients)
      ? row.ingredients
      : String(row.ingredients || "")
          .split(/[,;\n]+/)
          .map((food) => food.trim())
          .filter(Boolean);

    const suitableGoals = String(row.suitable_goal || "")
      .split(/[,;]+/)
      .map((goal) => goal.trim().toLowerCase().replace(/\s+/g, "-"))
      .filter(Boolean);

    return {
      id: String(row.id),
      category: inferMealCategory(row, ingredients),
      name: String(row.name || "Unnamed meal"),
      foods: ingredients,
      calories: Number(row.calories) || 0,
      protein: Number(row.protein) || 0,
      carbohydrates: Number(row.carbohydrates) || 0,
      fats: Number(row.fats) || 0,
      dietType: normalizeDietType(row.diet_type),
      suitableGoals
    };
  });
}

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
  return String(value || "")
    .split(/[,;\n]+/)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function expandAllergies(allergies) {
  return allergies.flatMap((allergy) => {
    const normalized = String(allergy || "").trim().toLowerCase();
    if (!normalized) return [];
    const singular = normalized.endsWith("s") && normalized.length > 3 ? normalized.slice(0, -1) : normalized;
    return allergenAliases[normalized] || allergenAliases[singular] || [normalized, singular];
  });
}

function mealContainsAny(meal, terms) {
  if (!meal || !Array.isArray(terms) || terms.length === 0) {
    return false;
  }

  const mealText = `${String(meal.name || "")} ${Array.isArray(meal.foods) ? meal.foods.join(" ") : ""}`.toLowerCase();

  return terms.some((term) => {
    const normalized = String(term || "").trim().toLowerCase();
    if (!normalized) return false;

    const escapedTerm = normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
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

function readStoredJSON(key, fallback = null) {
  try {
    const value = localStorage.getItem(key);
    return value === null ? fallback : JSON.parse(value);
  } catch (error) {
    return fallback;
  }
}

function safeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");

  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isExpanded));
      navigation.classList.toggle("is-open", !isExpanded);
    });
  }

  const homeDashboard = document.querySelector("#home-dashboard");
  if (homeDashboard) {
    const dashboardProfile = readStoredJSON("nutriplanProfile");
    const dashboardMealPlan = readStoredJSON("nutriplanMealPlan");
    const dashboardProgress = readStoredJSON("nutriplanDailyProgress", {}) || {};
    const dashboardProfileExists = Boolean(
      dashboardProfile &&
      typeof dashboardProfile.fullName === "string" &&
      dashboardProfile.fullName.trim()
    );

    const dashboardEmpty = document.querySelector("#dashboard-empty");
    const dashboardData = document.querySelector("#dashboard-data");
    const dashboardWelcome = document.querySelector("#dashboard-welcome");
    const dashboardGoal = document.querySelector("#dashboard-goal");
    const dashboardBmi = document.querySelector("#dashboard-bmi");
    const dashboardBmiCategory = document.querySelector("#dashboard-bmi-category");
    const dashboardCalorieTarget = document.querySelector("#dashboard-calorie-target");
    const dashboardMealCount = document.querySelector("#dashboard-meal-count");
    const dashboardMealNames = document.querySelector("#dashboard-meal-names");
    const dashboardCalories = document.querySelector("#dashboard-calories");
    const dashboardProtein = document.querySelector("#dashboard-protein");
    const dashboardCarbohydrates = document.querySelector("#dashboard-carbohydrates");
    const dashboardFats = document.querySelector("#dashboard-fats");

    if (!dashboardProfileExists) {
      if (dashboardEmpty) dashboardEmpty.hidden = false;
      if (dashboardData) dashboardData.hidden = true;
    } else {
      if (dashboardEmpty) dashboardEmpty.hidden = true;
      if (dashboardData) dashboardData.hidden = false;

      if (dashboardWelcome) {
        dashboardWelcome.textContent = `Welcome back, ${dashboardProfile.fullName}. Here's your latest overview.`;
      }

      if (dashboardGoal) {
        dashboardGoal.textContent = {
          "weight-loss": "Weight Loss",
          "weight-gain": "Weight Gain",
          "maintain-weight": "Maintain Weight",
          "muscle-gain": "Muscle Gain"
        }[dashboardProfile.nutritionGoal] || "Not set";
      }

      const bmi = Number(dashboardProfile.bmi);
      const calorieTarget = Number(dashboardProfile.dailyCalorieTarget);

      if (dashboardBmi) {
        dashboardBmi.textContent = Number.isFinite(bmi) ? bmi.toFixed(1) : "Not available";
      }
      if (dashboardBmiCategory) {
        dashboardBmiCategory.textContent = dashboardProfile.bmiCategory || "";
      }
      if (dashboardCalorieTarget) {
        dashboardCalorieTarget.textContent = Number.isFinite(calorieTarget) && calorieTarget > 0
          ? `${calorieTarget.toLocaleString()} kcal`
          : "Unavailable";
      }

      const planMatchesProfile = Boolean(
        dashboardMealPlan &&
        Array.isArray(dashboardMealPlan.meals) &&
        Number.isFinite(calorieTarget) && calorieTarget > 0 &&
        Number(dashboardMealPlan.dailyCalorieTarget) === calorieTarget &&
        dashboardMealPlan.dietPreference === dashboardProfile.dietPreference &&
        dashboardMealPlan.nutritionGoal === dashboardProfile.nutritionGoal
      );

      if (dashboardMealNames) {
        dashboardMealNames.replaceChildren();
      }

      if (dashboardMealCount) {
        dashboardMealCount.textContent = planMatchesProfile
          ? `${dashboardMealPlan.meals.length} meals`
          : "Not generated";
      }

      if (planMatchesProfile && dashboardMealNames) {
        dashboardMealPlan.meals.slice(0, 4).forEach((meal) => {
          const item = document.createElement("li");
          item.textContent = `${meal.category}: ${meal.name}`;
          dashboardMealNames.append(item);
        });
      } else if (dashboardMealNames) {
        const item = document.createElement("li");
        item.textContent = "No meal plan for this profile yet.";
        dashboardMealNames.append(item);
      }

      const todayProgress = dashboardProgress[getLocalDateKey(new Date())];
      const dashboardUnits = { calories: "kcal", protein: "g", carbohydrates: "g", fats: "g" };

      ["calories", "protein", "carbohydrates", "fats"].forEach((metric) => {
        const value = Number(todayProgress?.[metric]);
        const element = document.querySelector(`#dashboard-${metric}`);
        if (element) {
          element.textContent = todayProgress && Number.isFinite(value) && value >= 0
            ? `${value.toLocaleString()} ${dashboardUnits[metric]}`
            : "Not logged";
        }
      });
    }
  }

  const profileForm = document.querySelector("#nutrition-profile-form");
  const formStatus = document.querySelector("#form-status");

  if (profileForm && formStatus) {
    profileForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!profileForm.reportValidity()) {
        return;
      }

      const formValues = new FormData(profileForm);
      const profile = Object.fromEntries(formValues.entries());
      const age = Number(profile.age);
      const heightCm = Number(profile.heightCm);
      const weightKg = Number(profile.weightKg);

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

      const heightMeters = heightCm / 100;
      const bmi = weightKg / (heightMeters * heightMeters);

      if (!Number.isFinite(bmi)) {
        formStatus.textContent = "Those height and weight values cannot be used to calculate BMI.";
        return;
      }

      const roundedBmi = Number(bmi.toFixed(1));
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

      profile.age = Number(profile.age);
      profile.heightCm = heightCm;
      profile.weightKg = weightKg;
      profile.bmi = roundedBmi.toFixed(1);
      profile.bmiCategory = bmiCategory;

      const activityMultipliers = {
        sedentary: 1.2,
        "lightly-active": 1.375,
        "moderately-active": 1.55,
        "very-active": 1.725
      };

      const goalAdjustments = {
        "weight-loss": -400,
        "weight-gain": 400,
        "maintain-weight": 0,
        "muscle-gain": 250
      };

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
        const bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * age) + genderOffset;
        const maintenanceCalories = bmr * activityMultiplier;
        const dailyCalorieTarget = maintenanceCalories + goalAdjustment;

        if (Number.isFinite(bmr) && bmr > 0 && Number.isFinite(maintenanceCalories) && maintenanceCalories > 0 && Number.isFinite(dailyCalorieTarget) && dailyCalorieTarget > 0) {
          profile.calorieEstimateAvailable = true;
          profile.bmr = Math.round(bmr);
          profile.maintenanceCalories = Math.round(maintenanceCalories);
          profile.dailyCalorieTarget = Math.round(dailyCalorieTarget);
          profile.calorieEstimateMessage = "";
        }
      }

      let updatedProfile;

      try {
        const previousProfile = readStoredJSON("nutriplanProfile", {});
        const existingProperties = previousProfile && typeof previousProfile === "object" && !Array.isArray(previousProfile)
          ? previousProfile
          : {};
        updatedProfile = { ...existingProperties, ...profile };
        localStorage.setItem("nutriplanProfile", JSON.stringify(updatedProfile));
      } catch (error) {
        formStatus.textContent = "Your browser could not save this profile. Check its storage settings and try again.";
        return;
      }

      const token = sessionStorage.getItem("nutriplanToken");

      if (!token) {
        formStatus.textContent = "Please log in before saving your profile.";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            age: Number(updatedProfile.age),
            gender: updatedProfile.gender,
            height: Number(updatedProfile.heightCm),
            weight: Number(updatedProfile.weightKg),
            goal: updatedProfile.nutritionGoal,
            activity_level: updatedProfile.activityLevel,
            diet_type: updatedProfile.dietPreference,
            allergies: updatedProfile.foodAllergies,
            disliked_foods: updatedProfile.dislikedFoods,
            bmi: updatedProfile.bmi,
            calorie_target: updatedProfile.dailyCalorieTarget
          })
        });

        const data = await response.json();

        if (!response.ok) {
          formStatus.textContent = data.message || data.error || "Could not save profile to the database.";
          return;
        }

        window.location.href = "plan.html";
      } catch (error) {
        formStatus.textContent = "Cannot connect to the backend. Please check that the server is running.";
      }
    });
  }

  const bmiSummary = document.querySelector("#bmi-summary");
  if (bmiSummary) {
    try {
      const savedProfile = readStoredJSON("nutriplanProfile", {});
      const savedBmi = Number(savedProfile?.bmi);

      if (Number.isFinite(savedBmi) && typeof savedProfile?.bmiCategory === "string") {
        const bmiValueElement = document.querySelector("#bmi-value");
        const bmiCategoryElement = document.querySelector("#bmi-category");
        const profileNameElement = document.querySelector("#profile-name");
        const profileGoalElement = document.querySelector("#profile-goal");
        const profileDietElement = document.querySelector("#profile-diet");
        const profileCalorieTargetElement = document.querySelector("#profile-calorie-target");

        if (bmiValueElement) bmiValueElement.textContent = savedBmi.toFixed(1);
        if (bmiCategoryElement) bmiCategoryElement.textContent = savedProfile.bmiCategory;
        if (profileNameElement) profileNameElement.textContent = savedProfile.fullName || "Profile";
        if (profileGoalElement) {
          profileGoalElement.textContent = {
            "weight-loss": "Weight Loss",
            "weight-gain": "Weight Gain",
            "maintain-weight": "Maintain Weight",
            "muscle-gain": "Muscle Gain"
          }[savedProfile.nutritionGoal] || "Not set";
        }
        if (profileDietElement) {
          profileDietElement.textContent = {
            vegetarian: "Vegetarian",
            "non-vegetarian": "Non-Vegetarian",
            vegan: "Vegan"
          }[savedProfile.dietPreference] || "Not set";
        }

        bmiSummary.hidden = false;

        const calorieEstimates = document.querySelector("#calorie-estimates");
        const calorieUnavailable = document.querySelector("#calorie-unavailable");
        const calorieValues = [savedProfile.bmr, savedProfile.maintenanceCalories, savedProfile.dailyCalorieTarget].map(Number);

        if (profileCalorieTargetElement) {
          profileCalorieTargetElement.textContent = Number.isFinite(calorieValues[2]) && calorieValues[2] > 0
            ? calorieValues[2].toLocaleString()
            : "Unavailable";
        }

        if (savedProfile.calorieEstimateAvailable && calorieValues.every((value) => Number.isFinite(value) && value > 0)) {
          const bmrValue = document.querySelector("#bmr-value");
          const maintenanceCaloriesElement = document.querySelector("#maintenance-calories");
          const dailyCalorieTargetElement = document.querySelector("#daily-calorie-target");

          if (bmrValue) bmrValue.textContent = calorieValues[0].toLocaleString();
          if (maintenanceCaloriesElement) maintenanceCaloriesElement.textContent = calorieValues[1].toLocaleString();
          if (dailyCalorieTargetElement) dailyCalorieTargetElement.textContent = calorieValues[2].toLocaleString();

          if (calorieEstimates) calorieEstimates.hidden = false;
        } else {
          if (calorieUnavailable) {
            calorieUnavailable.textContent = typeof savedProfile.calorieEstimateMessage === "string" && savedProfile.calorieEstimateMessage
              ? savedProfile.calorieEstimateMessage
              : "No calorie estimate is saved for this profile yet. Submit the profile form again to calculate one.";
            calorieUnavailable.hidden = false;
          }
        }
      }
    } catch (error) {
      // Keep the summary hidden if storage is unavailable or contains invalid data.
    }
  }

  const personalizedPlan = document.querySelector("#personalized-plan");
  const profileNeeded = document.querySelector("#profile-needed");

  if (personalizedPlan && profileNeeded) {
    let savedProfile = null;
    try {
      savedProfile = readStoredJSON("nutriplanProfile", null);
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
      const profileNeededMessage = document.querySelector("#profile-needed-message");
      if (savedProfile?.calorieEstimateMessage && profileNeededMessage) {
        profileNeededMessage.textContent = `${savedProfile.calorieEstimateMessage} Update your profile to continue.`;
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
        foods.textContent = Array.isArray(meal.foods) ? meal.foods.join(", ") : "";

        const nutrition = document.createElement("dl");
        nutrition.className = "meal-nutrition";

        [
          ["Calories", `${meal.calories} kcal`],
          ["Protein", `${meal.protein} g`],
          ["Carbohydrates", `${meal.carbohydrates} g`],
          ["Fats", `${meal.fats} g`]
        ].forEach(([label, value]) => {
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

            if (categoryOptions.length === 0) {
              throw new Error(`No ${savedProfile.dietPreference} ${category.toLowerCase()} meals were found in the database. Add or categorize a matching meal to continue.`);
            }

            const allergySafeOptions = categoryOptions.filter((meal) => !mealContainsAny(meal, allergies));

            if (allergySafeOptions.length === 0) {
              const excludedMeals = categoryOptions.map((meal) => meal.name).join(", ");
              throw new Error(`No ${savedProfile.dietPreference} ${category.toLowerCase()} options remain after applying your allergy exclusions. Matching database meals: ${excludedMeals}. Review your saved allergy list or add more suitable meals.`);
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

            const unusedOptions = rankedOptions.filter((meal) => !previousMealIds.includes(meal.id));
            const availableOptions = unusedOptions.length > 0 ? unusedOptions : rankedOptions;
            const topOptions = availableOptions.slice(0, Math.min(3, availableOptions.length));
            const randomIndex = Math.floor(Math.random() * topOptions.length);

            if (!topOptions.length) {
              throw new Error(`No suitable ${category.toLowerCase()} plan options are available for your current profile.`);
            }

            selectedMeals.push(topOptions[randomIndex]);
          });
        } catch (error) {
          if (generatedMeals) generatedMeals.replaceChildren();
          if (dailySummary) dailySummary.hidden = true;
          if (regenerateButton) regenerateButton.hidden = true;
          if (planWarning) planWarning.hidden = true;
          if (planError) {
            planError.textContent = error.message;
            planError.hidden = false;
          }
          return;
        }

        if (planError) planError.hidden = true;
        if (planWarning) {
          planWarning.textContent = dislikedFoodsIncluded
            ? "Some disliked foods may appear because safe alternatives were limited. Allergy exclusions are still applied."
            : "";
          planWarning.hidden = !dislikedFoodsIncluded;
        }

        if (generatedMeals) {
          generatedMeals.replaceChildren(...selectedMeals.map(renderMealCard));
        }

        const totals = selectedMeals.reduce((summary, meal) => ({
          calories: summary.calories + meal.calories,
          protein: summary.protein + meal.protein,
          carbohydrates: summary.carbohydrates + meal.carbohydrates,
          fats: summary.fats + meal.fats
        }), { calories: 0, protein: 0, carbohydrates: 0, fats: 0 });

        const totalCalories = document.querySelector("#total-calories");
        const totalProtein = document.querySelector("#total-protein");
        const totalCarbohydrates = document.querySelector("#total-carbohydrates");
        const totalFats = document.querySelector("#total-fats");

        if (totalCalories) totalCalories.textContent = totals.calories.toLocaleString();
        if (totalProtein) totalProtein.textContent = totals.protein.toLocaleString();
        if (totalCarbohydrates) totalCarbohydrates.textContent = totals.carbohydrates.toLocaleString();
        if (totalFats) totalFats.textContent = totals.fats.toLocaleString();

        currentMealIds = selectedMeals.map((meal) => meal.id);

        if (dailySummary) dailySummary.hidden = false;

        try {
          const savedMealPlan = readStoredJSON("nutriplanMealPlan", {});
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
        const previousPlan = readStoredJSON("nutriplanMealPlan", {});
        if (Array.isArray(previousPlan.mealIds)) {
          previousMealIds = previousPlan.mealIds;
        }
      } catch (error) {
        previousMealIds = [];
      }

      if (regenerateButton) regenerateButton.disabled = true;

      loadMealsFromDatabase()
        .then((databaseMeals) => {
          mealDatabase = databaseMeals;

          if (regenerateButton) regenerateButton.disabled = false;

          generateMealPlan(previousMealIds);

          if (regenerateButton) {
            regenerateButton.addEventListener("click", () => {
              generateMealPlan(currentMealIds);
            });
          }
        })
        .catch((error) => {
          if (generatedMeals) generatedMeals.replaceChildren();
          if (dailySummary) dailySummary.hidden = true;
          if (regenerateButton) regenerateButton.disabled = true;

          if (planError) {
            planError.textContent =
              (error.message || "Meal plan could not be generated.") +
              " Make sure the NutriPlan backend and MySQL are running.";
            planError.hidden = false;
          }
        });
    }
  }

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

    try {
      profile = readStoredJSON("nutriplanProfile", null);
    } catch (error) {
      profile = null;
    }

    try {
      mealPlan = readStoredJSON("nutriplanMealPlan", null);
    } catch (error) {
      mealPlan = null;
    }

    try {
      const savedRecords = readStoredJSON("nutriplanDailyProgress", {});
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
      if (!weeklyRecords) return;

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

      const weeklyEmptyMessage = document.querySelector("#weekly-empty-message");
      if (weeklyEmptyMessage) {
        weeklyEmptyMessage.hidden = hasRecentRecord;
      }
    }

    renderWeeklyRecords();

    const hasProfile = Boolean(
      profile &&
      typeof profile.fullName === "string" && profile.fullName.trim() &&
      Number.isFinite(Number(profile.weightKg)) && Number(profile.weightKg) > 0
    );

    if (hasProfile) {
      if (profileSummary) profileSummary.hidden = false;
      if (profileEmptyState) profileEmptyState.hidden = true;

      const progressName = document.querySelector("#progress-name");
      const progressGoal = document.querySelector("#progress-goal");
      const progressCalorieTarget = document.querySelector("#progress-calorie-target");
      const progressBmi = document.querySelector("#progress-bmi");
      const progressBmiCategory = document.querySelector("#progress-bmi-category");

      if (progressName) progressName.textContent = profile.fullName;
      if (progressGoal) {
        progressGoal.textContent = {
          "weight-loss": "Weight Loss",
          "weight-gain": "Weight Gain",
          "maintain-weight": "Maintain Weight",
          "muscle-gain": "Muscle Gain"
        }[profile.nutritionGoal] || "Not set";
      }

      const calorieTarget = Number(profile.dailyCalorieTarget);
      if (progressCalorieTarget) {
        progressCalorieTarget.textContent = Number.isFinite(calorieTarget) && calorieTarget > 0
          ? `${calorieTarget.toLocaleString()} kcal`
          : "Unavailable";
      }
      if (progressBmi) progressBmi.textContent = Number.isFinite(Number(profile.bmi)) ? Number(profile.bmi).toFixed(1) : "Not available";
      if (progressBmiCategory) progressBmiCategory.textContent = profile.bmiCategory || "";

      const currentWeight = Number(profile.weightKg);
      const startingWeight = Number(profile.startingWeightKg ?? profile.weightKg);
      const targetWeight = Number(profile.targetWeightKg);
      const hasStartingWeight = Number.isFinite(startingWeight) && startingWeight > 0;
      const hasTargetWeight = Number.isFinite(targetWeight) && targetWeight > 0;

      const weightGoalSection = document.querySelector("#weight-goal-section");
      const currentWeightElement = document.querySelector("#current-weight");
      const weightGoalElement = document.querySelector("#weight-goal");
      const startingWeightElement = document.querySelector("#starting-weight");
      const targetWeightElement = document.querySelector("#target-weight");

      if (weightGoalSection) weightGoalSection.hidden = false;
      if (currentWeightElement) currentWeightElement.textContent = `${currentWeight.toLocaleString()} kg`;
      if (weightGoalElement) {
        weightGoalElement.textContent = {
          "weight-loss": "Weight Loss",
          "weight-gain": "Weight Gain",
          "maintain-weight": "Maintain Weight",
          "muscle-gain": "Muscle Gain"
        }[profile.nutritionGoal] || "Not set";
      }
      if (startingWeightElement) startingWeightElement.textContent = hasStartingWeight ? `${startingWeight.toLocaleString()} kg` : "Not set";
      if (targetWeightElement) targetWeightElement.textContent = hasTargetWeight ? `${targetWeight.toLocaleString()} kg` : "Not set";

      if (hasStartingWeight && hasTargetWeight) {
        const weightProgress = startingWeight === targetWeight
          ? (currentWeight === targetWeight ? 100 : 0)
          : Math.max(0, Math.min(100, ((currentWeight - startingWeight) / (targetWeight - startingWeight)) * 100));
        const roundedWeightProgress = Math.round(weightProgress);

        const weightProgressValue = document.querySelector("#weight-progress-value");
        const weightProgressFill = document.querySelector("#weight-progress-fill");
        const weightProgressBar = document.querySelector("#weight-progressbar");
        const weightProgressSection = document.querySelector("#weight-progress");
        const weightProgressEmpty = document.querySelector("#weight-progress-empty");

        if (weightProgressValue) weightProgressValue.textContent = `${roundedWeightProgress}%`;
        if (weightProgressFill) weightProgressFill.style.width = `${roundedWeightProgress}%`;
        if (weightProgressBar) weightProgressBar.setAttribute("aria-valuenow", String(roundedWeightProgress));
        if (weightProgressSection) weightProgressSection.hidden = false;
        if (weightProgressEmpty) weightProgressEmpty.hidden = true;
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
      if (profileEmptyState) profileEmptyState.hidden = false;
      if (planEmptyState) planEmptyState.hidden = true;
    } else if (!hasMealPlan) {
      if (planEmptyState) planEmptyState.hidden = false;
      const planEmptyMessage = document.querySelector("#plan-empty-message");
      if (planEmptyMessage && !(Number(profile.dailyCalorieTarget) > 0)) {
        planEmptyMessage.textContent = "A valid calorie target is not available in your profile. Complete your profile again before tracking against a daily plan.";
      }
    } else {
      if (planEmptyState) planEmptyState.hidden = true;
      if (trackingDashboard) trackingDashboard.hidden = false;

      const todayRecord = dailyRecords[todayKey];

      function updateMetric(metric, target, consumed) {
        const safeTarget = Number.isFinite(target) && target > 0 ? target : 0;
        const safeConsumed = Number.isFinite(consumed) && consumed >= 0 ? consumed : 0;
        const progressBar = document.querySelector(`#${metric}-progressbar`);
        const progressFill = document.querySelector(`#${metric}-bar`);
        const remaining = Math.max(0, safeTarget - safeConsumed);
        const percent = safeTarget > 0 ? Math.min(100, (safeConsumed / safeTarget) * 100) : 0;

        const targetElement = document.querySelector(`#${metric}-target`);
        const consumedElement = document.querySelector(`#${metric}-consumed`);
        const remainingElement = document.querySelector(`#${metric}-remaining`);

        if (targetElement) targetElement.textContent = formatTrackingNumber(safeTarget);
        if (consumedElement) consumedElement.textContent = formatTrackingNumber(safeConsumed);
        if (remainingElement) {
          remainingElement.textContent = safeConsumed > safeTarget
            ? `${formatTrackingNumber(safeConsumed - safeTarget)} ${metricUnits[metric]} over target`
            : `${formatTrackingNumber(remaining)} ${metricUnits[metric]}`;
        }
        if (progressBar) {
          progressBar.setAttribute("aria-valuemax", String(safeTarget));
          progressBar.setAttribute("aria-valuenow", String(Math.min(safeConsumed, safeTarget)));
        }
        if (progressFill) progressFill.style.width = `${percent}%`;
      }

      const initialConsumed = todayRecord || { calories: 0, protein: 0, carbohydrates: 0, fats: 0 };
      Object.keys(progressTargets).forEach((metric) => {
        updateMetric(metric, progressTargets[metric], Number(initialConsumed[metric] || 0));
        if (trackingForm && trackingForm.elements[metric]) {
          trackingForm.elements[metric].value = todayRecord ? String(initialConsumed[metric]) : "";
        }
      });

      const trackingEmptyMessage = document.querySelector("#tracking-empty-message");
      if (trackingEmptyMessage) trackingEmptyMessage.hidden = Boolean(todayRecord);

      if (trackingForm) {
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
              if (trackingStatus) trackingStatus.textContent = `Enter a valid, non-negative value for ${metric}.`;
              if (trackingForm.elements[metric]) trackingForm.elements[metric].focus();
              return;
            }

            newRecord[metric] = value;
          }

          newRecord.updatedAt = new Date().toISOString();
          dailyRecords[todayKey] = newRecord;

          try {
            localStorage.setItem("nutriplanDailyProgress", JSON.stringify(dailyRecords));
          } catch (error) {
            if (trackingStatus) trackingStatus.textContent = "Progress could not be saved in this browser.";
            return;
          }

          Object.keys(progressTargets).forEach((metric) => updateMetric(metric, progressTargets[metric], newRecord[metric]));
          if (trackingEmptyMessage) trackingEmptyMessage.hidden = true;
          if (trackingStatus) trackingStatus.textContent = "Today's progress has been saved.";
          renderWeeklyRecords();
        });

        const resetTodayButton = document.querySelector("#reset-today");
        if (resetTodayButton) {
          resetTodayButton.addEventListener("click", () => {
            if (!window.confirm("Reset today's nutrition progress? This will clear today's saved intake values.")) {
              return;
            }

            delete dailyRecords[todayKey];
            try {
              localStorage.setItem("nutriplanDailyProgress", JSON.stringify(dailyRecords));
            } catch (error) {
              if (trackingStatus) trackingStatus.textContent = "Today's progress could not be cleared in this browser.";
              return;
            }

            trackingForm.reset();
            Object.keys(progressTargets).forEach((metric) => updateMetric(metric, progressTargets[metric], 0));
            if (trackingEmptyMessage) trackingEmptyMessage.hidden = false;
            if (trackingStatus) trackingStatus.textContent = "Today's progress has been reset.";
            renderWeeklyRecords();
          });
        }
      }
    }
  }
});

// ...existing code...