const express = require('express');
const app = express();
const methodOverride = require('method-override')
const path = require('path');

const res = require('express/lib/response');
const { request } = require('http');

const fs = require('fs');

let threadRaw = fs.readFileSync('thread.json');
let threadData = JSON.parse(threadRaw);

let userRaw = fs.readFileSync('user.json');
let userData = JSON.parse(userRaw);

const session = require('express-session');
app.use(session({
  secret: 'seng513',
  resave: true,
  saveUninitialized: true
}));

app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) //to parse HTML form data (aka read HTML form data)
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.


app.get('/', (req, res) => {
  res.render('index');
});

//Sign Up
app.get('/signUp', (req, res) => {
  res.render('signUp');
});

//login
app.get('/userLogin', (req, res) => {
  res.render('userLogin');
});

app.get('/adminLogin', (req, res) => {
  res.render('adminLogin');
});

app.get('/moderatorLogin', (req, res) => {
  res.render('moderatorLogin');
});

//Invalid Login
app.get('/invalidLogin', (req, res) => {
  res.render('invalidLogin');
});



//Home
app.get('/home', (req, res) => {

  // If the user is loggedin
  if (req.session.loggedin) {
    let results = threadData;
    res.render('home', { results });
  } else {
    // Not logged in
    res.send('Please login to view this page!');
  }
  res.end();

});

//Thread
app.get('/thread', (req, res) => {
  res.render('thread');
});


//Administrator
app.get('/admin', (req, res) => {
  res.render('admin');
});


//search
app.get('/search', (req, res) => {
  res.render('search', { keyword: req.query.keyword });
});

app.get('/api/movies', (req, res) => {
  const keyword = req.query.keyword;
  let results = threadData;

  res.json(results);

});

app.get('/api/getAllMovies', (req, res) => {
  let results = threadData;
  res.json(results);
});

app.post('/api/userlogin', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  let result = userData.filter(function (n) {
    return (n.username == username && n.password == password && n.type == 'user')
  });
  console.log(result);
  if (result.length == 0) {
    res.redirect('/invalidLogin');
  }
  else {
    // Authenticate the user
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/home');
  }
});

app.post('/api/adminlogin', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  let result = userData.filter(function (n) {
    return (n.username == username && n.password == password && n.type == 'admin')
  });
  console.log(result);
  if (result.length == 0) {
    res.redirect('/invalidLogin');
  }
  else {
    // Authenticate the user
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/admin');
  }
});

app.post('/api/moderatorlogin', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;

  let result = userData.filter(function (n) {
    return (n.username == username && n.password == password && n.type == 'moderator')
  });
  console.log(result);
  if (result.length == 0) {
    res.redirect('/invalidLogin');
  }
  else {
    // Authenticate the user
    req.session.loggedin = true;
    req.session.username = username;
    res.redirect('/home');
  }
});


app.post('/api/removeUser', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  let userData = userData.filter(function (i, n) {
    return !(n.username == username && n.password == password)
  });
  let json = JSON.stringify(userData);
  fs.writeFile('user.json', json);
  // Need to change
  res.redirect('/');
});

app.post('/api/signup', (req, res) => {

  let username = req.body.username;
  let password = req.body.password;
  let newUser = {
    "username": username,
    "password": password,
    "type": "user"
  }

  userData.push(newUser);
  let json = JSON.stringify(userData);
  console.log(json)
  fs.writeFile("user.json", json, (err) => {
    if (err)
      console.log(err);
    else {
      res.redirect('/home');
    }
  });
});

app.post('/api/addthread', (req, res) => {

  let title = req.body.title;
  let description = req.body.description;
  let tags = req.body.tags;
  var currentdate = new Date();
  console.log('aaaa' + req.session.username)
  var datetime =
    + (currentdate.getMonth() + 1) + "/"
    + currentdate.getDate() + "/"
    + currentdate.getFullYear() + " "
    + ((currentdate.getHours() < 10) ? "0" : "") + currentdate.getHours() + ":" + ((currentdate.getMinutes() < 10) ? "0" : "") + currentdate.getMinutes()

  let newThread = {
    "threadTitle": title,
    "threadTime": datetime,
    "username": req.session.username,
    "threadContent": description,
    "tags": tags,
  }

  threadData.push(newThread);
  let json = JSON.stringify(threadData);
  console.log(json)
  fs.writeFile("thread.json", json, (err) => {
    if (err)
      console.log(err);
    else {
      res.redirect('/home');
    }
  });
});

app.get('/index', (req, res) => {
  res.render('index');
});

// This allows the mysubs page to be reached whenever it is clicked on the navbar.
app.get('/mysubs', (req, res) => {
  res.render('mysubs');
});

// My threads
app.get('/mythreads', (req, res) => {
  res.render('mythreads');
});

// Add thread
app.get('/addthread', (req, res) => {
  res.render('addthread');
});

const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});

module.exports = app;