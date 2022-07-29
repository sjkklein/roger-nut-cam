if (process.env.NODE_ENV !== 'production') { //loads env variables if app not in development
  require('dotenv').config()
}

//Required External Modules

const express = require('express')
const app = express()
const path = require('path')
const bcrypt = require('bcrypt')
const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')

//Database configuration

const DB_HOST = process.env.DB_HOST
const DB_USER = process.env.DB_USER
const DB_PASSWORD = process.env.DB_PASSWORD
const DB_DATABASE = process.env.DB_DATABASE
const DB_PORT = process.env.DB_PORT

const port = process.env.PORT //probably unncessary

const mysql = require("mysql")
const db = mysql.createPool({
  connectionLimit: 100,
  host: DB_HOST,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT
})

db.getConnection( (err, connection) => {
   if (err) throw (err)
   console.log ("DB connected successful: " + connection.threadId) //early warning system in case there's an issue with the db connect
})

//Passport & Passport Config
const initializePassport = require('./passport-config')

initializePassport(
  passport, 
  email => db.getConnection( async (err, connection) => {
    if (err) throw (err)
    const sqlSearch = "SELECT * FROM users WHERE email = ?"
    const searchQuery = mysql.format(sqlSearch, [email])
  
    await connection.query(searchQuery, async (err, result) => {
      connection.release()
      
      if (err) throw (err)
      console.log(result[0].email)
      return result[0].email
    })
  }),
  id => db.getConnection( async (err, connection) => {
    if (err) throw (err)
    const sqlSearch = "SELECT * FROM users WHERE id = ?"
    const searchQuery = mysql.format(sqlSearch, [id])
  
    await connection.query(searchQuery, async (err, result) => {
      connection.release()

      if (err) throw (err)
      console.log(result[0].id)
      return result[0].id
    })
  })
  // email => users.find(user => user.email === email), //method for local dev authentication
  // id => users.find(user => user.id === id)
)

// const users = [] //local var for dev ONLY; will need to redirect registration to database

//Express Public Directory
app.use(express.static(path.join(__dirname, 'public')))

//Bootstrap Node Dependecies
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

//Views Pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

//Takes Inputs from Forms for Post Methods, allows reading of URL and JSON
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
    res.render('home', { name : req.user.fName })
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
    const id = Date.now().toString()
    const fName = req.body.firstName
    const lName = req.body.lastName
    const email = req.body.email
    const password = await bcrypt.hash(req.body.password, 10)

    db.getConnection( async (err, connection) => {
      if (err) throw (err)
      const sqlSearch = "SELECT * FROM users WHERE fName = ?"
      const search_query = mysql.format(sqlSearch, [fName])
      const sqlInsert = "INSERT INTO userTable VALUES (0,?,?,?,?,?)"
      const insert_query = mysql.format(sqlInsert,[id, fName, lName, email, password])
      // ? will be replaced by values
      // ?? will be replaced by string
      await connection.query (search_query, async (err, result) => {
       if (err) throw (err)
       console.log("------> Search Results")
       console.log(result.length)
       if (result.length != 0) {
        connection.release()
        console.log("------> User already exists")
       } 
       else {
        await connection.query (insert_query, (err, result)=> {
        connection.release()
        if (err) throw (err)
        console.log ("--------> Created new User")
        console.log(result.insertId)
       })
      }
     }) //end of connection.query()
     }) //end of db.getConnection()
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

app.listen(`${port}`, () => {console.log(`listening on ${port}`)})


