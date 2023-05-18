const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.sendMail = async function (data, verification) {
  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Mailgen",
      link: "https://mailgen.js/",
      textDirection: verification ? "rtl" : "ltr",
    },
  });

  const resp = {
    body: {
      greeting: false,
      signature: false,
      intro: verification
        ? `<div dir="rtl">קוד אימות לאתר ${verification}</div>`
        : `<div>${data.mailData}</div>`,
    },
  };

  const mail = mailGenerator.generate(resp);

  const message = {
    from: process.env.MAIL,
    to: verification ? data : process.env.MAIL,
    subject: verification
      ? "https://children-and-divorce.netlify.app המשך תהליך רישום לאתר"
      : data.text,
    html: mail,
  };

  return transporter.sendMail(message).catch((e) => {
    return e;
  });
};
