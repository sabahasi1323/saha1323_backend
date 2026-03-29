const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth"); // ✅ your file

const app = express();

app.use(cors());
app.use(express.json());

// ✅ THIS LINE IS VERY IMPORTANT
app.use("/api/auth", authRoutes);

app.listen(5001, () => {
  console.log("Server running on port 5001");
});
