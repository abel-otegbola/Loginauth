const express = require("express")
const mysql = require("mysql");
const bcrypt = require("bcryptjs")
var passport = require('passport');
var LocalStrategy = require('passport-local');

const router = express.Router()
const app = express()

//Create mysql database connection
const db = mysql.createConnection({
    host: "localhost",
    user: "Abel",
    password: "1234",
    database: "users"
  });
  
  db.connect(function(err) {
    if (err) throw err;
    console.log("db Connected!");
  });
  
  passport.use(new LocalStrategy(function verify(username, password, cb) {
            let findsql = `SELECT * FROM users WHERE name = '${username}'`;
            
            let query = db.query(findsql, (err, result) => {
                if (err) {
                    return cb(err)
                }
                if(result.length < 1) {
                    return cb(null, false, { message: 'Username does not exist' });
                }
                else {
                    bcrypt.compare(password, result[0].password, (err, isMatch) => {
                        if(err) throw err;
        
                        if(isMatch) { 
                            return cb(null, username)
                        }
                        else {
                            return cb(null, false, { message: 'Password Incorrect' });
                        }
                    })
                }
            })
  }));

router.get('/logout', (req, res, next) => {
    req.logout(function(err) {
        if (err) {
            return next(err)
        }
        res.redirect('/')
    });
    req.flash('success_msg', "You are logged out")
    res.redirect('/login');
});
//User Login
router.post("/handleLogin", (req, res, next) => {
    passport.authenticate('local', { 
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
})



passport.serializeUser(function(user, cb) {
    process.nextTick(function() {
      cb(null, { id: user.id, user: user.name });
    });
});
  
passport.deserializeUser(function(user, cb) {
    process.nextTick(function() {
      return cb(null, user);
    });
});

//Get user
router.get("/getUser", (req, res) => {
    res.send({user : user})
})

let regMsg = {}
router.post('/handleRegister', (req, res) => 
{//Hash password
     bcrypt.genSalt(10, (err, salt) => 
     bcrypt.hash(req.body.password, salt, (err, hash) => {
         if(err) throw err;
         hashedPassword = hash
         let newuser = {
                     name: req.body.username,
                     email: req.body.email,
                     password: hash
                 }
        let findemail = `SELECT * FROM users WHERE email = '${newuser.email}'`;

        let query = db.query(findemail, (err, result) => {
            if (err) {
                console.log(err)
            }
            if(result.length < 1) {

                let findname = `SELECT * FROM users WHERE name = '${newuser.name}'`;
                let query = db.query(findname, (err, result) => {
                    if (err) {
                        console.log(err)
                    }
                    if(result.length < 1) {
                        let sql = 'INSERT INTO users SET ?';
                        let query = db.query(sql, newuser, (err) => {
                            if (err) throw err;
                            msg = { status: "success", msg: "Registered! Please login in with username and password to continue" }
                            res.redirect("/login")
                    })}
                    else {
                        regMsg = { status: "fail", msg: "username already exists"}
                        res.redirect("/register")
                    }
                })

                
            }
            else {
                regMsg = { status: "fail", msg: 'Email already registered'}
                res.redirect("/register")
            }
        })
   })
   )
})
router.get("/registerStatus", (req, res) => {
    res.json(regMsg)
})
         
        



module.exports = router;