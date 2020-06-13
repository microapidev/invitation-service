const express = require("express");
const cors = require("cors");
const path = require("path");
const fetch = require("node-fetch");

const sendHandler = require("./controllers/send");
const verifyHandler = require("./controllers/verify");
const getAllHandler = require("./controllers/getAll");
const registerHandler = require("./controllers/register");
const loginHandler = require("./controllers/login");
const configureHandler = require("./controllers/configure");

const authenticate = require("./services/authenticate");
const app = express();

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("/v1/documentation", async (req, res, next) => {
  let docUrl = "https://api.jsonbin.io/b/5ee274301f9e4e57881bc673/3";
  try {
    let json = await fetch(docUrl);
    console.log(json);
    return res.json(json.json());
  } catch (err) {
    return next(err);
  }
});
app.post("/v1/register", registerHandler);
app.post("/v1/login", loginHandler);
app.get("/v1/pending", authenticate, getAllHandler);
app.post("/v1/send", authenticate, sendHandler);
app.post("/v1/verify", authenticate, verifyHandler);

app.post("/v1/configure", authenticate, configureHandler);
app.use((req, res, next) => {
  res.status(404).json({
    message: "the requested resource was not found",
  });
});

app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).json({
    message: "an error occured while processing your request",
    developer: err.toString(),
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Invitation microservice running on port ${PORT}`);
});
