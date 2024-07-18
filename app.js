const express = require("express");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveManagementRoutes");
const tasksRoutes = require ("./routes/taskRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const cors = require('cors')

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/task", tasksRoutes);
app.use("/api/holiday",holidayRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
