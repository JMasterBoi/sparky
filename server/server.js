const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const uri = "mongodb+srv://Juanito:3gaDE9iMO3BIeGVh@cluster0.2duv9fo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const db = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
}).db("Goal_Todo");
const goalsDB = db.collection("goals");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Allows frontend to call backend
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Example API route
app.get("/api/tests", (req, res) => {
  res.json({ message: "Hello from Express!" });
});

app.get("/api/get-goals", async (req, res) => {
  await goalsDB.find().toArray().then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.delete("/api/delete-all-goals", async (req, res) => {
  try {
    const result = await goalsDB.deleteMany({});
    console.log(`${result.deletedCount} goals deleted.`);
    res.json({ message: "All goals deleted successfully." });
  } catch (error) {
    console.error("Error deleting goals:", error);
    res.status(500).json({ error: "Failed to delete goals." });
  }
});

app.post("/api/create-goal", async (req, res) => {
  const goal = {user:1, ...req.body, tasks: []};

  await goalsDB.insertOne(goal).then((result) => {
    console.log(result);
    res.sendStatus(201);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.post("/api/add-task", async (req, res) => {
  // get goalId and task from request body
  const goalId = new ObjectId(req.body[0]);
  const task = {_id: new ObjectId(), ...req.body[1], checked: false};

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $push: {tasks: task } }
  ).then((result) => {
    console.log(result);
    res.sendStatus(201);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.post("/api/check-task", async (req, res) => {
  // get goalId and task from request body
  const goalId = new ObjectId(req.body.goalId);
  const taskId = new ObjectId(req.body.taskId);
  const status = req.body.status;

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $set: { "tasks.$[task].checked": !status } },
    { arrayFilters: [{ "task._id": taskId }] }
  ).then((result) => {
    console.log(result);
    res.sendStatus(201);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.delete("/api/delete-all-tasks", async (req, res) => {
  // get goalId and task from request body
  goalId = new ObjectId(req.body.id);

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $set: {tasks: [] } }
  ).then((result) => {
    console.log(result);
    res.sendStatus(202);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});