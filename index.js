const express = require('express');
const app = express();
const methodOverride = require('method-override')
const path = require('path');

const res = require('express/lib/response');
const { request } = require('http');



app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true })) //to parse HTML form data (aka read HTML form data)
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());

app.set('view engine', 'ejs'); //using the ejs view engine, so we can do dynamic HTML templating.
app.set('views', path.join(__dirname, '/views')); //Add this so that we can run our app from any directory.


app.get('/', (req, res) => {
  res.render('index');
});

//login
app.get('/login', (req, res) => {
  res.render('homeLogin');
});

//Home
app.get('/home', (req, res) => {
  res.render('home');
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

});

app.get('/index', (req, res) => {
  res.render('index');
});

// This allows the mysubs page to be reached whenever it is clicked on the navbar.
app.get('/mysubs', (req, res) => {
  res.render('mysubs');
});

const server = app.listen(3000, () => {
  console.log('listening on *:3000');
});
