var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const db = require("./config/connection");
const passport = require("passport");
require("./passport_config");
const hbs = require("express-handlebars");



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var adminRouter = require('./routes/admin');

var app = express();

let handle = hbs.create({
  extname: "hbs",
  defaultLayout: "layout",
  layoutsDir: __dirname + "/views/layout/",
  partialDir: __dirname + "/views/partials/",

});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine("hbs", handle.engine);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: "key",
    cookie: { maxAge: 600000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());


db.connect((err) => {
  if (err) {
    console.log("Error Occured" + err);
  } else {
    console.log("[+]DB connected to port 27017");
  }
});




app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
// // app.get(
//   "/google",(req,res)=>{
//     if(req.session.user){
//       res.redirect("/")
//     }else{
// passport.authenticate("google", { scope: ["profile", "email"] })
//     }

//   }
  
// );

app.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // console.log("req>>>>>>>>>>>>>>>>>>>>>>>>", req.user._json);
    req.session.user = req.user._json;
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
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
});

module.exports = app;
