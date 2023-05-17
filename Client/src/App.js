import "./App.css";
import { useState } from "react";
import axios from "axios";
import Dialog from "@mui/material/Dialog";

export default function App() {
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [firstFriday, setFirstFriday] = useState("");
  const [email, setEmail] = useState("");

  const login = async () => {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      alert("אנא הזן כתובת מייל תקינה!");
      setEmail("");
      return;
    }

    setLoading(true);

    try {
      const resp = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/logorsign/${email}`
      );

      if (!resp.data.authorized) {
        alert(resp.data.message);
      } else {
        setAuthorized(true);
        setFirstFriday(resp.data.firstFriday);
        setOpen(false);
      }
    } catch (e) {
      alert("נסה שוב");
      console.error(e);
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog open={open} fullScreen>
        <h1>הילדים איתי או עם הגרוש/ה בסופ"ש?</h1>
        <div className="flex dialog" style={{ marginTop: "10%" }}>
          <input
            value={email}
            placeholder="נא להזין אימייל"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={login}>כניסה / הרשמה לאתר</button>
          {loading && <h3>טוען...</h3>}
        </div>
      </Dialog>

      {authorized && <DateCalc data={{ firstFriday, email, setFirstFriday }} />}
    </>
  );
}

function DateCalc({ data }) {
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState("");
  const [hebrewEvents, setHebrewEvents] = useState({ hebrew: "", events: [] });

  const calcFriday = async () => {
    if (!checkFriday()) {
      setHebrewEvents({ hebrew: "", events: [] });
      return;
    }

    const dates = date.split("-");
    const dateWithParent = new Date(data.firstFriday);
    let parsedDate = new Date(date);

    if (parsedDate >= dateWithParent) {
      for (let i = 0; ; i += 14) {
        parsedDate = new Date(date);
        parsedDate.setDate(parsedDate.getDate() - i);

        if (parsedDate <= dateWithParent) {
          alert(
            Date.parse(parsedDate.toDateString()) ===
              Date.parse(dateWithParent.toDateString())
              ? "התור שלך"
              : "התור של הגרוש/ה"
          );
          break;
        }
      }

      try {
        const resp = await axios.get(
          `https://www.hebcal.com/converter?cfg=json&gy=${dates[0]}&gm=${dates[1]}&gd=${dates[2]}&g2h=1`
        );

        setHebrewEvents({ hebrew: resp.data.hebrew, events: resp.data.events });
      } catch (e) {
        console.error(e);
      }
    } else {
      const first = new Date(data.firstFriday).toLocaleDateString("en-GB");
      alert(`יש תוצאות החל מ- ${first}`);
    }
  };

  const save = async () => {
    if (!checkFriday()) {
      return;
    }

    data.setFirstFriday(date);
    setLoading(true);

    try {
      await axios.post(`${process.env.REACT_APP_API_SERVER}/updatedate`, {
        email: data.email,
        date,
      });
    } catch (e) {
      alert("נסה שוב");
      console.error(e);
    }

    setLoading(false);
  };

  const checkFriday = () => {
    const day = new Date(date).getDay();

    if (day !== 5) {
      alert("בחר רק ימי שישי!");
    }

    return day === 5;
  };

  return (
    <>
      <Dialog open={data.firstFriday === ""} fullWidth>
        <div className="flex dialog">
          <span>בחר את יום השישי האחרון שלקחת את הילדים</span>
          <input type="date" onChange={(e) => setDate(e.target.value)} />
          <button onClick={save}>שמור</button>
          {loading && <h3>טוען...</h3>}
        </div>
      </Dialog>

      {data.firstFriday !== "" && (
        <div className="flex dates">
          <h1>בחר תאריך:</h1>
          <input type="date" onChange={(e) => setDate(e.target.value)} />
          <button onClick={calcFriday}>בדוק</button>

          {hebrewEvents.hebrew && (
            <>
              <span>{hebrewEvents.hebrew}</span>
              <span style={{ textDecoration: "underline" }}>
                אירועים באותו תאריך:
              </span>
            </>
          )}

          <div className="flex events">
            {hebrewEvents.events.map((item, index) => {
              return <span key={index}>{item}</span>;
            })}
          </div>
        </div>
      )}
    </>
  );
}
