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
app.get('/login', (req, res) => {
  res.render('homeLogin');
});

//Invalid Login
app.get('/invalidLogin', (req, res) => {
  res.render('invalidLogin');
});

//Home
app.get('/home', (req, res) => {
  res.render('home');
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

app.post('/api/login', (req, res) => {
  
  let username =  req.body.username;
  let password =  req.body.password;
  let result = userData.filter(function (i,n){
    return (n.username == username && n.password == password)
  });

  if(result.length == 0)
  {
    res.redirect('/invalidLogin');
  }
  else{
    res.redirect('/');
  }
  console.log(username+" "+password);
  let results = threadData;
  res.json(results);
});

app.post('/api/removeUser', (req, res) => {
  
  let username =  req.body.username;
  let password =  req.body.password;
  let userData = userData.filter(function (i,n){
    return !(n.username == username && n.password == password)
  });
  let json = JSON.stringify(userData);
  fs.writeFile('user.json', json);
  // Need to change
  res.redirect('/');
});

app.post('/api/addUser', (req, res) => {
  
  let username =  req.body.username;
  let password =  req.body.password;
  let newUser =  {
    "username":username,
    "password":password
}

  userData.push(newUser);
  let json = JSON.stringify(userData);
  fs.writeFile('user.json', json);
  // Need to change
  res.redirect('/');
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
