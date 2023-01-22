require("dotenv").config();

console.log(process.env.JWT_SECRET);

// inside index.js
const PORT = 3000;
const express = require("express");
const bodyParser = require("body-parser");

const server = express();
server.use(bodyParser.json());
const { client } = require("./db");
client.connect();

const apiRouter = require("./api");
server.use("/api", apiRouter);

server.listen(PORT, () => {
  console.log("The server is up on port", PORT);
});

const morgan = require("morgan");
server.use(morgan("dev"));

server.use(express.json());

server.use((req, res, next) => {
  console.log("<____Body Logger START____>");
  console.log(req.body);
  console.log("<_____Body Logger END_____>");

  next();
});
