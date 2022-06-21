
//Required External Modules

const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt")

const app = express()

app.use(express.json()) //allows app to accept JSON

//User Capture
const users = []
app.post('/users', async (req, res) => { //bcrypt is async library
  try {
    const salt = await bcrypt.genSalt() //default salt is 10
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const user = { name: req.body.name, password: hashedPassword }
    console.log(salt)
    console.log(hashedPassword)
    users.push(user)
    res.status(201).send()
  } catch {
    res.status(500).send()
  }
 
})

//Express Public Directory
app.use(express.static(path.join(__dirname, 'public')))

//Bootstrap Node Dependecies
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

//Views Pathing
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))

app.get('/users', (req, res) => {
  res.json(users)
})

//Authentication Check
app.post('/users/login', async (req, res) => {
  const user = users.find(user => user.name = req.body.name)
  if (user == null) {
    return res.status(400).send('Cannot find user!')
  }
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.send('Success')
    } else {
      res.send('Incorrect Password')
    }
  } catch {
    res.status(500).send()
  }
})

app.get('/login', (req, res) => {
    res.render('home')
})

app.listen('3000')


