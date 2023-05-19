const express = require("express");
const router = express.Router();
const axios = require("axios");

const subsBL = require("../models/subsBL");

router.get("/", function (req, res, next) {
  return res.json("");
});

router.post("/logorsign", async function (req, res, next) {
  const obj = await subsBL.findSub(req.body.email);
  const verification =
    obj?.verification || Math.floor(100000 + Math.random() * 900000);
  let message = "";

  if (!obj?.authorized) {
    const mailRes = await axios.post(process.env.MAIL, {
      email: req.body.email,
      verification,
    });

    if (!mailRes) {
      message = "חלה שגיאה ברישום, אנא נסו שוב";
    } else {
      if (!obj) {
        await subsBL.saveSub(req.body.email, verification);
      }

      message =
        "ברגעים אלה נשלח אליכם מייל עם קוד אימות ורק לאחר מכן תוכלו להשתמש באתר";
    }
  }

  return res.json({
    authorized: obj?.authorized,
    message,
    firstFriday: obj?.firstFriday || "",
  });
});

router.post("/completesign", async function (req, res, next) {
  const obj = await subsBL.findSub(req.body.email);

  if (obj.verification === req.body.num) {
    await subsBL.signUp(req.body.email);
    return res.status(200).json("");
  } else {
    return res.status(500).json("קוד האימות שגוי!");
  }
});

router.post("/updatedate", async function (req, res, next) {
  await subsBL.updateSub(req.body);
  return res.json("");
});

router.post("/admin", async function (req, res, next) {
  try {
    await axios.post(process.env.MAIL, req.body);
  } catch (e) {
    console.error(e);
  }

  return res.json("");
});

module.exports = router;
