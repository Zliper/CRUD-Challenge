const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/users");

const app = express();

app.use(bodyParser.json());
app.use(express.static("public"));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

app.listen(8080, () => console.log("Server running on http://127.0.0.1:8080"));