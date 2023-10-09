const express = require("express");
const { engine } = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const LocalStrategy = require("passport-local");

const users = require("./store");
const { mustAuthenticatedMw } = require("./middleware/auth");

const app = express();
const PORT = 5000;

passport.use(
  new LocalStrategy(function verify(username, password, done) {
    const user = users.find((el) => el.username === username);
    console.log("This is passport middleware");
    if (!user) {
      console.log("Incorrect username or password.");
      return done(null, false, { message: "Incorrect username or password." });
    }
    return done(null, user);
  })
);

passport.serializeUser(function (user, cb) {
  console.log(user);
  cb(null, { id: user.id, username: user.username });
});

passport.deserializeUser(function (user, cb) {
  return cb(null, user);
});

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./views");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", mustAuthenticatedMw, (req, res) => {
  res.status(200).render("index");
});

app.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

app.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

app.get("/login", function (req, res, next) {
  res.render("login");
});

app.get("/protected", mustAuthenticatedMw, (req, res, next) => {
  res.render("protected");
});

app.get("/json", mustAuthenticatedMw, (req, res) => {
  res.status(200).send({ msg: "hello from authenticated route" });
});

app.listen(PORT, () => console.log("Server is started"));
