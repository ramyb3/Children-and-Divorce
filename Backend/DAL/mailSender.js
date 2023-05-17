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
      intro: [
        "לקבלת גישה לאתר אנא העבירו בביט 5₪ למספר 0543079496\n",
        ".רק לאחר קבלת התשלום תהיה לכם גישה לאתר\n\n",
        ".לכל בעיה/הצעה אנא שלחו מייל חוזר למייל זה ואגיב בהקדם",
      ],
    },
  };

  const mail = mailGenerator.generate(resp);

  const message = {
    from: process.env.MAIL,
    to: email,
    subject: "המשך תהליך רישום לאתר ",
    html: mail,
  };

  return transporter.sendMail(message).catch((e) => {
    return e;
  });
};
