const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const tasksRouter = require("./routes/tasks");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api/v1/tasks", tasksRouter);

// Healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Démarrage serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ API ToDoList démarrée sur http://localhost:${PORT}`);
});
