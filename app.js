const express = require("express");
const { engine } = require("express-handlebars");
const app = express();

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

const PORT = 5000;

app.get("/", (req, res) => {
  res.status(200).render("index");
});

app.listen(PORT, () => console.log("Server is started"));
