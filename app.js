const express = require('express')
const { PrismaClient } = require('@prisma/client')
const passport = require('passport')
const prisma = new PrismaClient()
const initializePassport = require('./passport-config')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')


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
app.use(express.static('public'));

const login = require('./routes/login')
const articles = require('./routes/articles')
const categorie = require('./routes/categories')
const user = require('./routes/users')

app.get('/', (req, res) => {
  res.render('index.html', { name: req.user.name })
})
app.use('/articles',  articles)
app.use('/categories', categorie);
app.use('/users',checkAuthenticated, user);
app.use('/login', login)
app.delete('/logout', (req, res) => {
  req.logOut(function (err) {
    if (err) { return next(err); }
    res.redirect('/login');
  })
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
