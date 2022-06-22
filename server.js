const express = require("express");
const app = express();
const { pool } = require("./dbConfig");
const session = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
const bcrypt = require("bcrypt");

const initializePassport = require("./passportConfig");

initializePassport(passport);

const PORT = process.env.PORT || 8085;
app.use("/css", express.static("css"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
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
            `insert into users(name, email, password, level) values ($1, $2, $3, $4) RETURNING id, password`,
            [username, email, hashedPassword, 1],
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

/*
// Connection non sécurisée
app.post("/users/login", function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  var query =
    "SELECT name FROM users where email = '" + email + "' and password = '" + password + "'";

  console.log("email: " + email);
  console.log("password: " + password);
  console.log("query: " + query);

  pool.query(query, (err, response) => {
    if (err) {
      console.log('here');
      throw err;
    } else if (response.rowCount == 0) {
      res.redirect("/users/login");
    } else {
      const user = response.rows[0];
      res.render("dashboard", { user: user.name });
    }
  });
});*/

app.get("/users/administrator", checkAdministrator, (req, res) => {
  var query = "SELECT id, name, email, level from users"
  pool.query(query, (err, response) => {
    if (err) {
      console.log('here');
      throw err;
    } 
    else {
      const users = response.rows;
      console.log(users);
      console.log(req.user);
      res.render("admin", { users: users, admin: req.user })
    }
  })
})

app.get("/users/profile", checkAdministrator, (req, res) => {
  var query = "SELECT id, name, email, level from users"
  pool.query(query, (err, response) => {
    if (err) {
      throw err;
    } else {
      res.render("profile", { name: req.user.name, email: req.user.email });
    }
  })
})

app.post("/users/profile", async (req, res) => {
  let { email, username, password, password2 } = req.body;
  let name = req.user.name;
  let errors = [];
  if (password != password2) {
    errors.push({ message: "Passwords do not match" });
  }
  if (errors.length > 0) {
    res.render("profile", { name, email, errors });
  } 
  else {
    hashedPassword = await bcrypt.hash(password, 10);
    let query = "update users set name='" + username + "', password='" + hashedPassword + "' where email='" + email + "'";
    pool.query(
    query,
    (err, response) => {
    if (err) {
      throw err;
    }
    req.flash("sucess_msg", "Modifications saved !");
    res.redirect("/users/profile");
    });
  }
});


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

function checkAdministrator(req, res, next) {
  if (req.isAuthenticated() && (req.user.level === 0)) {
    return next();
  } else if (req.isAuthenticated()) {
    return res.redirect("/users/login");
  }
  return res.redirect(403, "/error");
}

app.listen(PORT, () => {
  console.log(`Server ruuning on port ${PORT}`);
});
