const fs = require("fs");
const express = require("express");
const router = express.Router();
const { upload } = require("../middlewares/multer");
const { uploadPath, jsonPath } = require('../config');

router.get("/", (req, res) => {
  res.send("API Home.");
});

router.get("/tokens", (req, res) => {
  let rawdata = fs.readFileSync(jsonPath);
  let { tokens } = JSON.parse(rawdata);

  res.send(tokens);
});

router.post("/tokens", (req, res) => {

  if(!req.body.tokens && !req.body.length) {
    return res.send({
      success: false,
      error: "empty_data",
    });
  }

  // convert decimals to int
  for(let i = 0; i < req.body.tokens.length; i++) {
    req.body.tokens[i].decimals = parseInt(req.body.tokens[i].decimals); 
  }

  // read file
  try {
    var rawdata = fs.readFileSync(jsonPath);
    var mainJson = JSON.parse(rawdata);
  } catch (err) {
    return res.send({
      success: false,
      error: "read_error",
    });
  }

  // patch tokens & write to file
  try {
    mainJson.tokens = req.body.tokens;
    fs.writeFileSync(jsonPath, JSON.stringify(mainJson));
  } catch (err) {
    return res.send({
      success: false,
      error: "write_error",
    });
  }

  return res.send({
    success: true,
  });
});

router.post("/logo", upload.single("logo"), function (req, res, next) {
  let oldFile = uploadPath + req.file.filename;
  let newFile = uploadPath + JSON.parse(req.body.data).address + ".png";

  // delete old logo file - in case of update
  try {
    fs.unlinkSync(newFile);
  } catch (err) {
    console.log(
      "Error while deleting file at:",
      newFile,
      "maybe file does not exist"
    );
  }

  // rename file to address
  try {
    fs.renameSync(oldFile, newFile);
  } catch (err) {
    console.log("ERROR: " + err);
    return res.send({
      success: false,
      error: "rename_error",
    });
  }

  // send response
  return res.status(200).send({
    success: true,
  });
});

module.exports = router;
