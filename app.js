const express = require("express");
const cors = require("cors");

const sendHandler = require("./controllers/send");
const verifyHandler = require("./controllers/verify");
const getAllHandler = require("./controllers/getAll");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/invites", getAllHandler);
app.post("/invites/send", sendHandler);
app.post("/invites/verify", verifyHandler);

app.use((req, res, next) => {
  res.status(404).json({
    message: "the requested resource was not found",
  });
});

app.use((err, req, res, next) =>
  res.status(500).json({
    message: "an error occured while processing your request",
  })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Invitation microservice running on port ${PORT}`);
});
