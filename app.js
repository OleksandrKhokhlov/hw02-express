const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const path = require("node:path");

const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/auth");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);
app.use("/users", userRouter);
app.use(
  "users/avatars",
  express.static(path.join(__dirname, "public", "avatars"))
);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message } = err;
  res.status(status).json({ message });
});

module.exports = app;
