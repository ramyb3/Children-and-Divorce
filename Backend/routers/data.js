const express = require("express");
const router = express.Router();

const subsBL = require("../models/subsBL");
const mail = require("../DAL/mailSender");

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
    const mailRes = await mail.sendMail(req.params.id);

    if (!mailRes) {
      message = "חלה שגיאה ברישום, אנא נסו שוב";
    } else {
      await subsBL.saveSub(req.params.id);
      message =
        "ברגעים אלה נשלח אליכם מייל להסדר התשלום ורק לאחר מכן תוכלו להשתמש באתר";
    }
  }

  return res.json({ authorized, message, firstFriday });
});

router.post("/updatedate", async function (req, res, next) {
  await subsBL.updateSub(req.body);
  return res.json("");
});

module.exports = router;
