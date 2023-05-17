const nodeMailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.sendMail = async function (email) {
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
      textDirection: "rtl",
    },
  });

  const resp = {
    body: {
      greeting: false,
      signature: false,
      intro: `<div dir="rtl">
        לקבלת גישה לאתר אנא העבירו 5₪ למספר 0543079496 דרך אפליקציית bit עם כתובת המייל,<br/>
        רק לאחר קבלת התשלום תהיה לכם גישה לאתר.<br/><br/>
        לכל בעיה/הצעה אנא שלחו מייל חוזר ואגיב בהקדם.
      </div>`
    },
  };

  const mail = mailGenerator.generate(resp);

  const message = {
    from: process.env.MAIL,
    to: email,
    subject: "https://children-and-divorce.netlify.app המשך תהליך רישום לאתר ",
    html: mail,
  };

  return transporter.sendMail(message).catch((e) => {
    return e;
  });
};
