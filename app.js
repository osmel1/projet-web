const express = require('express')
const { PrismaClient } = require('@prisma/client')
const passport = require('passport')
const prisma = new PrismaClient()
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')

initializePassport(passport,
  async emailS => {
    return await prisma.user.findUnique({
      where: {
        email: emailS,
      },
    })
  },
  async idS => await prisma.user.findUnique({
    where: {
      id: idS,
    },
  })
)

const app = express()
app.set('view-engine', 'ejs')
app.use(express.json({ strict: false }))
app.use(express.urlencoded({ extended: false }))

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true }
}))
app.use(methodOverride('_method'))
app.use(express.static('public'));

const login = require('./routes/login')
const articles = require('./routes/articles')
const categorie = require('./routes/categories')
const user = require('./routes/users')
const comment = require('./routes/commentaires')

app.get('/', (req, res) => {
  res.render('index.html', { name: req.user.name })
})
app.use('/articles', articles)
app.use('/categories', categorie);
app.use('/users', checkAuthenticated, user);
app.use('/comments', bodyParser.json(), comment);
app.use('/login', login)
app.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) { return next(err); }
  })
  res.sendStatus(200);
})
app.get('/protected', (req, res) => {
  if (req.isAuthenticated()) {
    res.send({ authenticated: true });
  } else {
    res.send({ authenticated: false });
  }
});
app.get('/user/email', (req, res) => {
  var userEmail = req.session.userEmail || '';
  res.json({ userEmail: userEmail });
});
app.get('/user/id', (req, res) => {
  var userId = req.session.idUser || '';
  res.json({ userId: userId });
})
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

app.listen(3000, () => {
  console.log('Server started on http://localhost:3000')
})
