const express = require("express");
const cors = require("cors");

const sendHandler = require("controllers/send");
const verifyHandler = require("controllers/verify");

const app = express();

app.use(cors());
app.use(express.json());
app.post("/invite/send", sendHandler);
app.post("/invite/verify", verifyHandler);

app.use((err, req, res, next) =>
  res.status(500).json({
    message: "an error occured while processing your request",
  })
);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Invitation microservice running on port ${PORT}`);
});
