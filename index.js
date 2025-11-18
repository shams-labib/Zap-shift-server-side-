const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const cors = require("cors");
const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gs1mqwb.mongodb.net/?appName=Cluster0`;

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

    const db = client.db("zap_shift_db");
    const parcelConnection = db.collection("parcels");

    // parcels api
    app.get("/parcels", async (req, res) => {
      const query = {};
      const { email } = req.query;
      if (email) {
        query.senderEmail = email;
      }

      const cursor = await parcelConnection.find(query).toArray();
      res.send(cursor);
    });

    app.post("/parcels", async (req, res) => {
      const parcel = req.body;
      const result = await parcelConnection.insertOne(parcel);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("This is mal");
});

app.listen(port, () => {
  console.log(`This is port ${3000}`);
});
