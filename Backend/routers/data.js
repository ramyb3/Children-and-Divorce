const express = require("express");
const router = express.Router();

const subsBL = require("../models/subsBL");

router.get("/", function (req, res, next) {
  return res.json("");
});

router.post("/logorsign/:id", async function (req, res, next) {
  const obj = await subsBL.findSub(req.params.id);
  let authorized = false;
  let message = "";
  let firstFriday = "";

  if (obj) {
    if (obj.paid) {
      authorized = true;
      firstFriday = obj.firstFriday;
    } else {
      message = "אנא הסדירו את התשלום כדי שתוכלו להשתמש באתר!";
    }
  } else {
    await subsBL.saveSub(req.params.id);
    message =
      "ברגעים אלה נשלח אליכם מייל להסדר התשלום ורק לאחר מכן תוכלו להשתמש באתר";
  }

  return res.json({ authorized, message, firstFriday });
});

router.post("/updatedate", async function (req, res, next) {
  await subsBL.updateSub(req.body);
});

module.exports = router;
