const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;
const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("wonderlast");
    const destinationsCollection = db.collection("destinations");

    app.get("/destination", async (req, res) => {
        const result = await destinationsCollection.find().toArray();
        res.json(result);

    })

    app.get("/destination/:id", async (req, res) => {
        const {id} = req.params;
        const result = await destinationsCollection.findOne({_id: new ObjectId(id)})
        res.json(result);
    })

    app.patch("/destination/:id", async (req, res) => {
        const {id} = req.params;
        const updatedData = req.body;
        const result = await destinationsCollection.updateOne(
            {_id: new ObjectId(id)},
            {$set: updatedData}
        )
        res.json(result);


        
        });



    app.post("/destination", async (req, res) => {
        const destinationData = req.body;
        console.log(destinationData);
        const result = await destinationsCollection.insertOne(destinationData);
        res.json(result);
    });










    await client.db("admin").command({ ping: 1 });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(error);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Server is running successfully!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});