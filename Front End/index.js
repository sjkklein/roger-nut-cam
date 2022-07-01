if (process.env.NODE_ENV !== 'production') { //loads env variables if app not in development
  require('dotenv').config()
}

//Required External Modules

const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

const initializePassport = require('./passport-config')

initializePassport(
  passport, 
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

//User Setup & Capture
const users = [] //local var for dev ONLY; will need to redirect registration to database

//Express Public Directory
app.use(express.static(path.join(__dirname, 'public')))

//Bootstrap Node Dependecies
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

//Views Pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

//Takes Inputs from Forms for Post Methods
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false, //resaves if something has changed in session
  saveUninitialized: false //don't want to save empty values in session
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

//Get Rendering
app.get('/', checkAuthenticated, (req, res) => {
    res.render('home')
})

app.get('/login', checkNotAuthenticated,  (req, res) => {
    res.render('login')
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

app.get('/passForgot', checkNotAuthenticated, (req, res) => {
    res.render('passForgot')
})

app.get('/viewPage', checkAuthenticated, (req, res) => {
    res.render('viewPage')
})

app.get('/register', checkNotAuthenticated, (req, res) => {
  res.render('register')
})

app.post('/register', checkNotAuthenticated, async (req, res) => { //bcrypt is async library
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)   
    users.push({
      id: Date.now().toString(),
      fName: req.body.firstName,
      lName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword
    })
    res.redirect('/login')
  } catch {
    res.redirect('/register')
  }
})

app.delete('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err) }
    res.redirect('/login')
  })
})

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect('/')
  } 
  next()
}

app.listen('3000')


