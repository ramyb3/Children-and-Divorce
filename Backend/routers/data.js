const express = require("express");
const router = express.Router();

const subsBL = require("../models/subsBL");

router.get("/", function (req, res, next) {
  return res.json("");
});

//sign up page
router.post("/:id", async function (req, res, next) {
  const obj = await subsBL.findSub(req.params.id);

  return res.json({authorized: obj? obj.paid : false});
});

//login in page
router.post("/:id", async function (req, res, next) {
  const obj = await subsBL.findSub(req.params.id);

  return res.json({authorized: obj? obj.paid : false});
});

module.exports = router;
