import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";
import { useDeviceData } from "react-device-detect";
import DateCalc from "./DateCalc";

export default function App() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [verification, setVerification] = useState(false);
  const [num, setNum] = useState("");
  const [firstFriday, setFirstFriday] = useState("");
  const [email, setEmail] = useState("");

  const userData = useDeviceData();

  const mailData = {
    resolution: `${window.screen.width} X ${window.screen.height}`,
    response: JSON.stringify(userData, null, 2),
    name: "Children-Divorce",
  };

  useEffect(() => {
    sendMail("Site Enter");
  }, []);

  const sendMail = async (text) => {
    await axios.post(`${process.env.REACT_APP_API_SERVER}admin`, {
      ...mailData,
      text,
    });
  };

  const login = async () => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      alert("אנא הזן כתובת מייל תקינה!");
      setEmail("");
      return;
    }

    setLoading(true);

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_API_SERVER}logorsign`,
        { email }
      );

      if (!resp.data.authorized) {
        setVerification(true);
        alert(resp.data.message);

        await sendMail(`First Sign- ${email}`);
      } else {
        setVerification(false);
        setAuthorized(true);
        setFirstFriday(resp.data.firstFriday);
        setOpen(false);

        await sendMail(`Logged in- ${email}`);
      }
    } catch (e) {
      alert("נסו שוב");
      console.error(e);
    }

    setLoading(false);
  };

  const checkVerification = async () => {
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVER}completesign`, {
        email,
        num,
      });

      setVerification(false);
      setAuthorized(true);
      setOpen(false);

      await sendMail(`Complete Sign Up- ${email}`);
    } catch (e) {
      setNum("");
      alert(e.response.data);
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} fullScreen>
        <h1>הילדים איתי או עם הגרוש/ה בסופ"ש?</h1>
        <div className="flex dialog" style={{ marginTop: "10%" }}>
          <input
            value={verification ? num : email}
            placeholder={
              verification ? "נא להזין את קוד האימות" : "נא להזין אימייל"
            }
            type={verification ? "number" : "email"}
            onChange={(e) => {
              if (verification) {
                setNum(parseInt(e.target.value));
              } else {
                setEmail(e.target.value);
              }
            }}
          />
          <button
            onClick={() => {
              if (verification) {
                checkVerification();
              } else {
                login();
              }
            }}
          >
            כניסה / הרשמה לאתר
          </button>

          {loading && <h3>טוען...</h3>}
        </div>
      </Dialog>

      {authorized && !verification && (
        <DateCalc data={{ firstFriday, email, setFirstFriday }} />
      )}
    </>
  );
}
