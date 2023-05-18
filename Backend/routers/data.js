const express = require("express");
const router = express.Router();

const subsBL = require("../models/subsBL");
const mail = require("../DAL/mailSender");

router.get("/", function (req, res, next) {
  return res.json("");
});

router.post("/logorsign/:id", async function (req, res, next) {
  const obj = await subsBL.findSub(req.params.id);
  const verification = Math.floor(100000 + Math.random() * 900000);
  let message = "";

  if (!obj?.authorized) {
    const mailRes = await mail.sendMail(req.params.id, verification);

    if (!mailRes) {
      message = "חלה שגיאה ברישום, אנא נסו שוב";
    } else {
      if (!obj) {
        await subsBL.saveSub(req.params.id);
      }

      message =
        "ברגעים אלה נשלח אליכם מייל עם קוד אימות ורק לאחר מכן תוכלו להשתמש באתר";
    }
  }

  return res.json({
    authorized: obj?.authorized,
    message,
    firstFriday: obj?.firstFriday || "",
    verification,
  });
});

router.post("/completesign", async function (req, res, next) {
  await subsBL.signUp(req.body.email);
  return res.json("");
});

router.post("/updatedate", async function (req, res, next) {
  await subsBL.updateSub(req.body);
  return res.json("");
});

router.post("/admin", async function (req, res, next) {
  try {
    await mail.sendMail(req.body, null);
  } catch (e) {
    console.error(e);
  }

  return res.json("");
});

module.exports = router;
