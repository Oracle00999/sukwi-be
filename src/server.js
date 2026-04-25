require("dotenv").config(); // MUST be first

const mongoose = require("mongoose");
const app = require("./app");
<<<<<<< HEAD
const { startInvestmentCron } = require("./services/investmentCron");
=======
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV}`);
<<<<<<< HEAD
      startInvestmentCron();
=======
>>>>>>> 95d4d4ab07238f5b27bcea9dbb733460deccf429
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose connected to DB");
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed through app termination");
  process.exit(0);
});
