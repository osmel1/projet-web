const express = require('express')
const app = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
  res.render('login.ejs')
})
// app.post('/', passport.authenticate('local'), (req, res) => {
//   req.session.userEmail = req.user.email;
//   req.session.idUser = req.user.id;
//   req.session.userName = req.user.name;
//   const user = req.user;
//   console.log(req.session);
//   res.json({ success: true, user: user });
// });
app.post('/', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {

    if (err) {
      return next(err);
    }

    if (!user) {
      return res.json({ success: false, message: info.message });
    }
    req.session.userEmail = user.email;
    req.session.idUser = user.id;
    req.session.userName = user.name;
    req.session.myRole= user.role;
   console.log(user) 
    return res.json({ success: true, user: user,Myrole:user.role, });
  })(req, res, next);
});


function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/')
  }
  next()
}


module.exports = app