const express = require("express");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveManagementRoutes");
const cors = require('cors')

require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors())
app.use("/api/auth", authRoutes);
app.use("/api/leave", leaveRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
