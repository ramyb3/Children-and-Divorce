import "./App.css";
import { useEffect } from "react";
import axios from "axios";

export default function App() {
  useEffect(() => {
    const getData = async () => {
      let id = "ramybachayev3@gmail.com    ";

      const resp = await axios.post(
        `${process.env.REACT_APP_API_SERVER}/${id}`
      );
      console.log(resp.data);
    };

    getData();
  }, []);

  return (
    <div>
      <h2>Login Page</h2>
      {/* <input
        placeholder="Enter User Name"
        type="text"
        onChange={(e) => setUser({ ...user, user: e.target.value })}
      />
      <input
        placeholder="Enter Password"
        type="password"
        onChange={(e) => setUser({ ...user, psw: e.target.value })}
      />
      <button onClick={login}>Login</button>
      {loading ? <h3>Loading...</h3> : null}
      <LinK to="/create">CLICK ME IF YOU A NEW USER</Link> */}
    </div>
  );
}
