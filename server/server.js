const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { endOfToday, roundToNearestMinutes, add } = require('date-fns');

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
const schedulesDB = db.collection("schedules");

const app = express();
const PORT = 5000;

const priorityScale = [ // how important the task is, is the class important?
  { label: "Low", min: 0, max: 2 },
  { label: "Medium", min: 3, max: 5 },
  { label: "High", min: 6, max: 8 },
  { label: "Critical", min: 9, max: 10 }
];
const difficultyScale = [ // how long a task will take to complete, how much effort it will take, etc
  { label: "Easy", min: 0, max: 2 },
  { label: "Moderate", min: 3, max: 5 },
  { label: "Hard", min: 6, max: 8 },
  { label: "Difficult", min: 9, max: 10 }
];

function getPriority(value) {
  const match = priorityScale.find(p => value >= p.min && value <= p.max);
  return match ? match.label : "Medium";
}
function getDifficulty(value) {
  const match = difficultyScale.find(p => value >= p.min && value <= p.max);
  return match ? match.label : "Medium";
}


// Middleware
app.use(cors()); // Allows frontend to call backend
app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// generates a priority
function assignPriorityAI(name, description) {
  // const priorities = ["Low", "Medium", "High"];
  return Math.floor(Math.random() * 10);
}
function assignDifficultyAI(name, description) {
  // const priorities = ["Low", "Medium", "High"];
  return Math.floor(Math.random() * 10);
}

//# Routes
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
app.get("/api/get-goal", async (req, res) => {
  const _id = req.body._id
  await goalsDB.findOne({_id: _id}).then((result) => {
    res.json(result);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.delete("/api/delete-all-goals", async (req, res) => {
  try {
    // goals
    const result = await goalsDB.deleteMany({});
    const schedules = await schedulesDB.deleteMany({});
    // schedules
    console.log(`${result.deletedCount} goals deleted.`);
    res.json({ message: "All goals deleted successfully." });
  } catch (error) {
    console.error("Error deleting goals:", error);
    res.status(500).json({ error: "Failed to delete goals." });
  }
});

app.delete("/api/delete-goal", async (req, res) => {
  // get goalId from request body
  const goalId = new ObjectId(req.body.goalId);

  // delete goal from database
  await goalsDB.deleteOne({ _id: goalId }).then((result) => {
    console.log(result);
    res.sendStatus(202);
  }).catch((error) => {
    console.log("Error:", error);
  });
  await schedulesDB.deleteOne({ goalId: goalId }).then((result) => {
    console.log(result);
    res.sendStatus(202);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.post("/api/create-goal", async (req, res) => {
  const { goalName, goalDescription, color } = req.body;

  if (!goalName) {
    return res.status(400).json({ error: "Goal name is required." });
  }

      // Generate a random number between 0 and 16777215 (FFFFFF in hex)
  let randomColor = Math.floor(Math.random() * 16777215).toString(16);
  // Pad with leading zeros if the hex string is less than 6 characters
  // This ensures a full 6-digit hex code like #RRGGBB
  while (randomColor.length < 6) {
    randomColor = "0" + randomColor;
  }
  randomColor = "#" + randomColor;

  const goal = {
    goalName: goalName,
    goalDescription: goalDescription, // optional, can be empty ""
    user:1,
    taskBank: [],
    color: color??randomColor
  };

  await goalsDB.insertOne(goal).then((result) => {
    console.log(result);
    res.status(201).json({_id: result.insertedId.toString()}); // return the id of the newly created goal
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.post("/api/add-task", async (req, res) => {
  // get goalId and task from request body
  const goalId = new ObjectId(req.body[0]);
  const {taskName, taskDescription, dueDate, priority, difficulty, autoAssign} = req.body[1];

  //! ai implementation
  if (autoAssign) {
    // assign priority and difficulty based on taskName and taskDescription
    // this is a placeholder for AI implementation, you can replace it with your own AI logic
    // for now, we will just assign random values
    const assignedPriority = assignPriorityAI(taskName, taskDescription);
    const assignedDifficulty = assignPriorityAI(taskName, taskDescription);
    console.log(`Assigned Priority: ${assignedPriority}, Assigned Difficulty: ${assignedDifficulty}`);
  }

  const task = {
    _id: new ObjectId(),
    goalId: goalId,
    taskName: taskName,
    taskDescription: taskDescription,
    checked: false,
    scheduled: false,
    priority: priority??4.5, // if theres no priority, set it to 4.5 (medium)
    difficulty: difficulty??4.5, // if theres no difficulty, set it to 4.5 (medium)
    dueDate: dueDate??endOfToday().getTime(), // if theres no due date, set it to today
    autoAssign: autoAssign // more of an internal flag
  };

  //! console.log("task:", task);
  //! return res.status(200)

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $push: {taskBank: task } }
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
    { $set: { "taskBank.$[task].checked": !status } },
    { arrayFilters: [{ "task._id": taskId }] }
  ).then((result) => {
    console.log(result);
    res.sendStatus(201);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

app.post("/api/delete-task", async (req, res) => {
  // get goalId and task from request body
  const goalId = new ObjectId(req.body.goalId);
  const taskId = new ObjectId(req.body.taskId);

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $pull: { taskBank: { _id: taskId } } }
  ).then((result) => {
    console.log(result);
    res.sendStatus(202);
  }).catch((error) => {
    console.log("Error:", error);
  });

  schedulesDB.deleteOne({_id:taskId}).catch((error) => {
    console.log("Error", error);
  })
});

app.delete("/api/delete-all-tasks", async (req, res) => {
  // get goalId and task from request body
  goalId = new ObjectId(req.body.id);

  // append task to goal's tasks array
  await goalsDB.updateOne(
    { _id: goalId },
    { $set: {taskBank: [] } }
  ).then((result) => {
    console.log(result);
    res.sendStatus(202);
  }).catch((error) => {
    console.log("Error:", error);
  });

  schedulesDB.deleteMany({goalId: goalId}).catch((error) => {
    console.log("Error", error);
  })
});

//#section schedule
// get schedule for a day - date - array of obj (day, start timestamp, end timestamp, task name, goal id, task id, )
app.get("/api/get-schedule/:day", async (req, res) => {
  const day = Number(req.params.day) ?? Math.floor(Date.now()/86400000);

  // return res.send([])

  // find document from schedulesDB by day field
  console.log(day)
  await schedulesDB.find({day: day}).toArray().then((result) => {
    console.log(result)
    res.json(result);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

// add time block for a day  - (^) - bool
app.post("/api/schedule-task", async (req, res) => {
  const goalId = new ObjectId(req.body.goalId); //  required, others are optional as user can simply add it to the schedule and modify there
  const taskId = new ObjectId(req.body.taskId); //  required
  const taskName = req.body.taskName // required
  //! must be in ms
  // const taskStart = req.body.taskStart ?? roundToNearestMinutes(new Date(), { nearestTo: 30 }); // calculate day from this value
  // const taskEnd = req.body.taskEnd ?? add(taskStart, {hours: 1});
  const taskStart = req.body.taskStart 
  ? new Date(req.body.taskStart) 
  : roundToNearestMinutes(new Date(), { nearestTo: 30 });
  const taskEnd = req.body.taskEnd 
    ? new Date(req.body.taskEnd) 
    : add(taskStart, { hours: 1 });

  console.log("taskStart: ", req.body.taskStart)

  if (!goalId || !taskId || !taskName) {
    res.status(400); // if required fields are missing
  }

  const day = Math.floor(taskStart/86400000)
  // change if we decide api should receive id
  const task2Schedule = {
    _id: taskId,
    goalId: goalId,
    day: day,
    taskName: taskName,
    taskStart: taskStart,
    taskEnd: taskEnd
  }

  await schedulesDB.insertOne(task2Schedule).then((result) => {
    console.log(result);
    res.status(201).json({_id: result.insertedId.toString()}); // return the id of the newly created goal
  }).catch((error) => {
    console.log("Error:", error);
  });

  // mark the task as scheduled
  await goalsDB.updateOne(
    { _id: goalId },
    { $set: { "taskBank.$[task].scheduled": true } },
    { arrayFilters: [{ "task._id": taskId }] }
  ).catch((error) => {
    console.log("Error:", error);
  });
})

// edit time block - time block id, (optional ^) - bool
app.post("/api/edit-scheduled-task", async (req, res) => {
  const taskId = new ObjectId(req.body.taskId)
  const newStart = req.body.newStart
  const newEnd = req.body.newEnd

  await schedulesDB.updateOne(
    { _id: taskId },
    { $set: { "taskStart": newStart, "taskEnd": newEnd } }
  ).then((result) => {
    console.log(result);
    res.sendStatus(201);
  }).catch((error) => {
    console.log("Error:", error);
  });
});

// unschedule task - time block id
app.post("/api/unschedule-task", (req, res) => {
  const _id = new ObjectId(req.body._id)
  const goalId = new ObjectId(req.body.goalId)

  schedulesDB.deleteOne({_id: _id}).then((result) => {
    console.log(result)
    res.sendStatus(200)
  }).catch((error) => {
    console.log("Error:", error)
    res.sendStatus(500)
  })

  // mark the task as unscheduled
  goalsDB.updateOne(
    { _id: goalId },
    { $set: { "taskBank.$[task].scheduled": false } },
    { arrayFilters: [{ "task._id": _id }] }
  ).catch((error) => {
    console.log("Error:", error);
  });
})

// get all events (for ai mostly) - start date (probably today)
//#endsection  

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});