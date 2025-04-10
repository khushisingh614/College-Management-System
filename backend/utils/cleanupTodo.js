const cron = require("node-cron");
const Todo = require("../models/Other/todolist.model"); // Adjust if your path is different

// This job runs every day at 4:50 PM
cron.schedule("0 6 * * *", async () => {
  try {

    const result = await Todo.deleteMany({
      completed: true,
    });

    console.log(`🧹 ${result.deletedCount} completed tasks deleted at 6:00 AM`);
  } catch (err) {
    console.error("❌ Error during scheduled cleanup:", err);
  }
});