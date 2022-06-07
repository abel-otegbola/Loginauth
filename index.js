const express = require("express");
const mysql = require("mysql");
const passport = require('passport');
const path = require('path')
const expressLayouts = require("express-ejs-layouts");
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const flash = require("connect-flash")

const app = express();

//Bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json())
app.use(expressLayouts);
app.set("view engine", "ejs")


//Create mysql database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "Abel",
    password: "1234",
    database: "simpz"
  });
  
  db.connect(function(err) {
    if (err) throw err;
    console.log("db Connected!");
  });
  
  //Create mysql database
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE simpz';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result)
        console.log("db Created!");
    })
})

//Create mysql database table
app.get("/createTable", (req, res) => {
    let sql = 'CREATE TABLE users(id int AUTO_INCREMENT, name VARCHAR(255), email VARCHAR(255), workspace VARCHAR(255), option VARCHAR(255), password VARCHAR(255), PRIMARY KEY(id))';
    db.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Users table created")
    })
})

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({ db: 'sessions.db', dir: './db' })
}));
app.use(passport.authenticate('session'));

app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next()
})

// Routes
app.use("/user", require("./router/user"))

function requireLogin(req, res, next) {
    if(!req.user) return res.redirect("/login");
    next();
}

app.get("/",  requireLogin, (req, res) => {
    res.render("index")
})
app.get("/login", (req, res) => {
    res.render("login")
})
app.get("/register", (req, res) => {
    res.render("register")
})

const PORT = process.env.PORT || '3007'

app.listen(PORT, "localhost", () => {
    console.log(`server started on port ${PORT}`)
})