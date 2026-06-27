const admin = require("firebase-admin");
const { onSchedule } = require("firebase-functions/v2/scheduler");

admin.initializeApp();

const { checkMeals } = require("./mealScheduler");

exports.mealReminder = onSchedule(
  {
    schedule: "every 1 minutes",
    timeZone: "Asia/Kolkata",
  },
  async () => {
    console.log("Running Meal Reminder...");
    await checkMeals();
  }
);