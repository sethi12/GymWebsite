const admin = require("firebase-admin");

const db = admin.firestore();

const checkMeals = async () => {
  try {
    const now = new Date();

    const today = now.toLocaleDateString("en-CA", {
      timeZone: "Asia/Kolkata",
    });

    const currentTime = now
      .toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .toUpperCase();

    console.log("======================================");
    console.log("Current IST:", currentTime);
    console.log("Date:", today);
    console.log("======================================");

    const gymsSnapshot = await db.collection("gyms").get();

    const matchedMeals = [];

    for (const gym of gymsSnapshot.docs) {
      console.log(`Checking Gym: ${gym.id}`);

      const membersSnapshot = await gym.ref
        .collection("gymmembers")
        .where("notificationEnabled", "==", true)
        .get();

      for (const member of membersSnapshot.docs) {
        const memberData = member.data();

        if (!memberData.fcmtoken) {
          console.log(`Skipping ${memberData.userid} (No FCM Token)`);
          continue;
        }

        const lastNotifications = memberData.lastNotifications || {};

        const dietsSnapshot = await member.ref.collection("diets").get();

        for (const diet of dietsSnapshot.docs) {
          const dietData = diet.data();

          if (!dietData.diet?.meals) continue;

          for (const meal of dietData.diet.meals) {
            const mealTime = meal.time.trim().toUpperCase();

            console.log(
              `${memberData.userid} | ${meal.mealName} | ${mealTime}`
            );

            if (mealTime !== currentTime) continue;

            if (lastNotifications[meal.mealName] === today) {
              console.log(
                `⏩ Already Sent : ${memberData.userid} -> ${meal.mealName}`
              );
              continue;
            }

            const notification = {
              token: memberData.fcmtoken,

              notification: {
                title: "🏋 Elite Fitness",
                body: `🍽 ${meal.mealName}

${meal.recipe.title}

🔥 ${meal.calories} kcal
💪 ${meal.protein}g Protein

Tap to view recipe`,
              },

              data: {
                mealName: meal.mealName,
                recipe: meal.recipe.title,
                userid: memberData.userid,
                type: "diet",
              },
            };

            try {
              await admin.messaging().send(notification);

              await member.ref.set(
                {
                  lastNotifications: {
                    ...lastNotifications,
                    [meal.mealName]: today,
                  },
                },
                { merge: true }
              );

              matchedMeals.push({
                userid: memberData.userid,
                meal: meal.mealName,
                recipe: meal.recipe.title,
                time: meal.time,
              });

              console.log(
                `✅ Sent ${meal.mealName} notification to ${memberData.userid}`
              );
            } catch (err) {
              console.error(
                `❌ Failed for ${memberData.userid}`,
                err.message
              );
            }
          }
        }
      }
    }

    console.log("======================================");
    console.log(`Finished. Notifications Sent: ${matchedMeals.length}`);
    console.log("======================================");

    return {
      success: true,
      currentTime,
      today,
      totalMatched: matchedMeals.length,
      meals: matchedMeals,
    };
  } catch (err) {
    console.error(err);

    return {
      success: false,
      message: err.message,
    };
  }
};

module.exports = { checkMeals };