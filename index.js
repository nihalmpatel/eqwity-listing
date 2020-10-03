const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const api = require("./routes/api");
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// API routes
app.use("/api", api);

// Run server
app.listen(port, () => {
  console.log("server started on port:", port);
});
