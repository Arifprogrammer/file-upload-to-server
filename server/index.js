const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
// const profile = require("./profile");
const cors = require("cors");
const expressFileUpload = require("express-fileupload");
const path = require("path");
const assetFolder = path.join(__dirname, "assets");
const { MongoClient, ServerApiVersion } = require("mongodb");
// const multer = require("multer");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
//* middlewares
app.use(cors(corsOptions));
// app.use(express.urlencoded({ extended: false }));
// app.use("/profile", profile);
app.use(express.static("assets"));
app.use(expressFileUpload());

/* const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./my-uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage }); */

/* app.post("/profile", upload.single("file"), (req, res) => {
  console.log(req.file + " file");
  return res.status(200).send({ message: "ok" });
}); */

//! ------------------------------MongoDB------------------------

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASS}@cluster0.ketp048.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const fileCollection = client.db("fileUploadDB").collection("files");
    // Connect the client to the server	(optional starting in v4.7)
    client.connect();

    app.post("/profile", async (req, res) => {
      console.log(req.files);
      const { file } = req.files;
      const fileName = file.name.replaceAll(" ", "-");
      try {
        file.mv(path.join(assetFolder, fileName));
        const result = await fileCollection.insertOne({ name: fileName });
        res.status(200).send({ message: "ok", result });
      } catch (e) {
        res.status(500).send({ error: true, message: "Error occured" });
      }
    });

    app.get("/getimage", async (req, res) => {
      const result = await fileCollection.find().toArray();
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Yo working");
});

app.listen(port, () => {
  console.log(`Server is running on the port ${port}`);
});
