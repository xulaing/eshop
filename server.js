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
const MongoStore = require('connect-mongo');
//var bootstrap = require('bootstrap');

(async ()=>{
  try{
    await mongoose.connect('mongodb://localhost:27017/shopping'); // Database will be created automatically into mongodb
  }
  catch{
      console.log("erreur dans serveur.js");
  }
})();


const app = express();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
   });
var routes = require('./routes/index');
var routes_cart = require('./routes/cart');
/********************************** */

// Using HandlingBars 
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine({
  extname: 'hbs', 
  defaultLayout: 'layout', 
  layoutsDir: path.join(__dirname, 'views/layouts'),
  partialsDir  : path.join(__dirname, 'views/partials')
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use('/cart', routes_cart);


const initializePassport = require("./passportConfig");
initializePassport(passport);

app.use("/public/stylesheets", express.static("/public/stylesheets"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    //store:MongoStore.create({ mongoUrl: 'mongodb://localhost/test-app' }),
    //cookie: { maxAge: 180 * 60 * 1000}, 
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(function(req, res, next) {
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  next();
});


app.get("/account", (req, res) => {
  res.render("./user/account");
});


app.get("/users/register", checkAuthenticated, (req, res) => {
  res.render("./user/register");
});

app.get("/users/login", checkAuthenticated, (req, res) => {
  res.render("./user/login");
});

app.get("/users/dashboard", checkNotAuthenticated, (req, res) => {
  res.render("./user/dashboard", { user: req.user.name });
});

app.get("/users/logout", (req, res) => {
  req.logout();
  res.render("/", { message: "You have logged out successfully" });
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
    res.render("./user/register", { errors });
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
              res.redirect("users/login");
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


// Payment

const paypal = require('paypal-rest-sdk');

paypal.configure({
  'mode': 'sandbox', //sandbox or live
  'client_id': 'AVlE3jnv4IzdFnc0kKlzyYCXBV4QVgSD772ITJae0-4wzej6SmCDvu85keUyMRE2gmLrMXr-nfr_W9ct',
  'client_secret': 'EEzGJTZ0yUYvu5MI2oxdQefvKRiykr46AGnetVQEhdoDoZT5HxaX0emKH52OweueP7v-ScuYMPn8VnYa'
});


// go to /index to see the index.html page where you can choose to push the payment button
app.get('/payment', (req, res) => {
  res.render("./user/payment")
});


app.post('/pay', (req, res) => {
    const create_payment_json = {
      "intent": "sale",
      "payer": {
          "payment_method": "paypal"
      },
      "redirect_urls": {
          "return_url": "http://localhost:4000/success",
          "cancel_url": "http://localhost:4000/cancel"
      },
      "transactions": [{
          "item_list": {
              "items": [{
                  "name": "Red Sox Hat",
                  "sku": "001",
                  "price": "25.00",
                  "currency": "USD",
                  "quantity": 1
              }]
          },
          "amount": {
              "currency": "USD",
              "total": "25.00"
          },
          "description": "Hat for the best team ever"
      }]
  };

  app.get('/success', (req, res) => {
    const payerId = req.query.PayerID;
    const paymentId = req.query.paymentId;
  
    const execute_payment_json = {
      "payer_id": payerId,
      "transactions": [{
          "amount": {
              "currency": "USD",
              "total": "25.00"
          }
      }]
    };
  
    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
          console.log(error.response);
          throw error;
      } else {
          console.log(JSON.stringify(payment));
          res.send('Success');
      }
  });
  });

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for(let i = 0;i < payment.links.length;i++){
              if(payment.links[i].rel === 'approval_url'){
                res.redirect(payment.links[i].href);
              }
            }
        }
      });
      
      });

  app.get('/cancel', (req, res) => res.send('Cancelled'));

module.exports = app
