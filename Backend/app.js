const dotenv = require("dotenv");
dotenv.config();

require("./configs/database");
const router = require("./routers/data");

const cors = require("cors");
const express = require("express");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/", router);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log("https Server listening on port: " + PORT));
