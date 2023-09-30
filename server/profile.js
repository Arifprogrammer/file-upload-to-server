const express = require("express");
const router = express.Router();
const expressFileUpload = require("express-fileupload");
const path = require("path");
const assetFolder = path.join(__dirname, "assets");

router.use(expressFileUpload());

router.post("/", async (req, res) => {
  // console.log(req.files);
  const { file } = req.files;
  const fileName = file.name.replaceAll(" ", "-");
  try {
    file.mv(path.join(assetFolder, fileName));
    const result = await fileCollection.insertOne({ name: fileName });
    res.status(200).send({ message: "ok" });
  } catch (e) {
    res.status(500).send({ error: true, message: "Error occured" });
  }
});

module.exports = router;
