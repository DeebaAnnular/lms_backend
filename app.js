const express = require("express");
const authRoutes = require("./routes/authRoutes");
const leaveRoutes = require("./routes/leaveManagementRoutes");
const tasksRoutes = require("./routes/taskRoutes");
const holidayRoutes = require("./routes/holidayRoutes");
const cors = require("cors");

require("dotenv").config();

const app = express();

// /etc/letsencrypt/live/lms-api.annularprojects.com/cert.pem

const sslOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/lms-api.annularprojects.com/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/lms-api.annularprojects.com/fullchain.pem"
  ),
};

const server = https.createServer(sslOptions, app);

server.use(express.json());
server.use(cors());
server.use("/api/auth", authRoutes);
server.use("/api/leave", leaveRoutes);
server.use("/api/task", tasksRoutes);
server.use("/api/holiday", holidayRoutes);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
