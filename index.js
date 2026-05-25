const express = require("express");
const cors = require("cors");
require("dotenv").config();

const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

/* Middleware */
app.use(cors());
app.use(express.json());

/* MongoDB URI */
const uri = `mongodb://admin:admin123@ac-tqqr6fy-shard-00-00.zq4zgm8.mongodb.net:27017,ac-tqqr6fy-shard-00-01.zq4zgm8.mongodb.net:27017,ac-tqqr6fy-shard-00-02.zq4zgm8.mongodb.net:27017/?ssl=true&replicaSet=atlas-rp029m-shard-0&authSource=admin&appName=PPC`;

/* Mongo Client */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  
  try {

    /* Connect Database */
    // await client.connect();

    console.log("MongoDB Connected Successfully");

    /* Database */
    const database = client.db("probartanDB");

    /* Collection */
    const studentsCollection = database.collection("students");
    const attendanceCollection = database.collection("attendance");
    const feesCollection = database.collection("fees");
    const usersCollection = database.collection("users");
    const routineCollection = database.collection("routine");

    /* Root Route */
    app.get("/", (req, res) => {
      res.send("Server Running Successfully");
    });

    /* Get Students */
    app.get("/students", async (req, res) => {

      const result = await studentsCollection.find().toArray();

      res.send(result);

    });
    app.get("/students/:id", async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await studentsCollection.findOne(query);

      res.send(result);

    });
    app.post("/students", async (req, res) => {

        const student = req.body;

        const result = await studentsCollection.insertOne(student);

        res.send(result);

    });
    app.delete("/students/:id", async (req, res) => {

      const id = req.params.id;

      const query = {
        _id: new ObjectId(id),
      };

      const result = await studentsCollection.deleteOne(query);

      res.send(result);

    });
    app.patch("/students/:id", async (req, res) => {

      const id = req.params.id;

        const updatedStudent = req.body;

        const query = {
          _id: new ObjectId(id),
        };

        const updatedDoc = {
          $set: {
            name: updatedStudent.name,
            email: updatedStudent.email,
            batch: updatedStudent.batch,
          },
        };

        const result = await studentsCollection.updateOne(
          query,
          updatedDoc
        );

        res.send(result);
    });
    
    app.post("/attendance", async (req, res) => {

      const attendanceInfo = req.body;

      const result = await attendanceCollection.insertOne(
        attendanceInfo
      );

      res.send(result);

    });
    app.get("/attendance/:email", async (req, res) => {

      const email = req.params.email;

      const result = await attendanceCollection
        .find({ email })
        .toArray();

      res.send(result);

    });

    app.get("/attendance", async (req, res) => {

      const result = await attendanceCollection.find().toArray();

      res.send(result);

    });
    
    app.post("/fees", async (req, res) => {

      const feesInfo = req.body;

      const result = await feesCollection.insertOne(
        feesInfo
      );

      res.send(result);

    });
    app.get("/fees", async (req, res) => {

      const result = await feesCollection.find().toArray();

      res.send(result);

    });

    app.post("/users", async (req, res) => {

      const user = req.body;

      const existingUser =
        await usersCollection.findOne({
          email: user.email,
        });

      if (existingUser) {

        return res.send({
          message: "User already exists",
        });

      }

      const result =
        await usersCollection.insertOne(user);

      res.send(result);

    });
    app.get("/users/:email", async (req, res) => {

      const email = req.params.email;

      const query = { email };

      const user =
        await usersCollection.findOne(query);

      res.send(user);

    });
    
    app.get("/routine/:batch", async (req, res) => {

      try {

        const batch = req.params.batch;

        const result = await routineCollection
          .find({ batch })
          .toArray();

        res.send(result);

      } catch (error) {

        console.log(error);
        res.status(500).send({ error: "Failed to load routine" });

      }

    });

    app.post("/routine", async (req, res) => {

      const routineData = req.body;

      const result = await routineCollection.insertOne(routineData);

      res.send(result);

    });

  }

  catch (error) {

    console.log(error);

  }

}

run();

/* Server */
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});