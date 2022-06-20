// Imports
const express = require("express");
const { pool } = require("./dbConfig");
var favicon = require('serve-favicon');
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bcrypt = require("bcrypt");
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require("body-parser");
var hbs = require('express-handlebars');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shopping');

const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const ejs = require('ejs');
var routes = require('./routes/index')
/********************************** */

// Using HandlingBars and EJS
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir  : path.join(__dirname, 'views/partials')
}));

//app.set("view engine", "ejs");

/********************************** */
/****************Handle articles ******************/
var router = express.Router();
var Product = require('./models/product');
var shoppinDB = require("./models/product-seeder");




/************************************************ */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
// catch 404 and forward to error handler
/*app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});*/




//var bootstrap = require('bootstrap');



//const initializePassport = require("./passportConfig");

//initializePassport(passport);

app.use("/public/stylesheets", express.static("/public/stylesheets"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

//app.use(passport.initialize());
//app.use(passport.session());

app.use(flash());


app.get("/account", (req, res) => {
  res.render("./account/account");
});

app.get("/cart", (req, res) => {
  res.render("./cart");
});


app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("index", { message: "You have logged out successfully" });
});

app.post("/users/register", async (req, res) => {
  let { username, email, password, password2 } = req.body;

  let errors = [];

  if (!username || !email || !password || !password2) {
    errors.push({ message: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }

  if (errors.length > 0) {
    res.render("register", { errors });
  } else {
    hashedPassword = await bcrypt.hash(password, 10);
    // Form validation has passed
    pool.query(
      `select * from users where email = $1`,
      [email],
      (err, response) => {
        if (err) {
          throw err;
        }
        if (response.rows.length > 0) {
          errors.push({ message: "User already registered" });
          res.render("register", { errors });
        } else {
          pool.query(
            `insert into users(name, email, password) values ($1, $2, $3) RETURNING id, password`,
            [username, email, hashedPassword],
            (err, response) => {
              if (err) {
                throw err;
              }
              req.flash("sucess_msg", "You are now registered. Please log in");
              res.redirect("/users/login");
            }
          );
        }
      }
    );
  }
});

// Connection sécurisée
app.post(
  "/users/login",
  passport.authenticate("local", {
    successRedirect: "/users/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true
  })
);

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/users/dashboard");
  }
  next();
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/users/login");
}



module.exports = app
