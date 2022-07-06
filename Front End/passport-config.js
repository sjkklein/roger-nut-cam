const LocalStrategy = require('passport-local').Strategy
const mysql = require('mysql')

const connection = mysql.createConnection({
  host : 'localhost',
  user : 'root',
  password : ''
})

connection.query('USE vidyaww_build2')

const bcrypt = require('bcrypt') //figure out passport + mysql repo

function initialize(passport, getUserByEmail, getUserById) {
  const authenticateUser = async (req, email, password, done) => {
    const user = getUserByEmail(email)
    if (user == null) {
      return done(null, false, { message: 'No user with that email' })
    }
    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user)
      } else {
        return done(null, false, { message: 'Password incorrect' })
      }
    } catch (e) {
      return done(e)
    }
  }

  passport.use(new LocalStrategy({ 
    usernameField: 'email', 
    passwordField: 'password' }, authenticateUser))
  passport.serializeUser((user, done) => done(null, user.id))
  passport.deserializeUser((id, done) => {
    return done(null, getUserById(id))
  })
}

module.exports = initialize

