const express = require("express");
const fileRouter = express.Router();
//*=============== use multer
const multer = require("multer");

fileRouter.get("/", (req, res) => {
  console.log("hi");
  res.status(201).json({ massage: "hi" });
});

module.exports = fileRouter;
