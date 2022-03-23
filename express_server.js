const express = require('express');
const app = express();
const PORT = 8080;
const { urlDatabase } = require('./data/urlInfo');
const { generateRandomID } = require('./helpers/urlHelpers');

// converts the request body from a Buffer into a readable string
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.set('view engine', 'ejs');

const users = {
  ranUserID: {
    id: 'ranUserID',
    email: 'user@example.com', 
    password: 'purple-monkey-dinsosaur'
  }
};

const addUsers = () => {};

const findUsers = () => {
  
};


app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, user_id: userID };
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies.id;
  const templateVars = { user_id: userID };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies.id;
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user_id: userID };
  res.render('urls_show', templateVars);
});

app.post('/urls', (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomID();
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

// uses the shortURL to redirect to the longURL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(`http://${longURL}`);
});

// deletes a url
app.post('/urls/:shortURL/delete', (req, res) => {
  const shortURL = req.params.shortURL;
  for (let url in urlDatabase) {
    if (url === shortURL) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    }
  }
});

// edits the longURL
app.post('/urls/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect('/urls');
});

// creates a cookie to keep user logged in
app.post('/login', (req, res) => {
  const user_id = req.body['user_id'];
  console.log('user_id:', user_id);
  res.cookie('user_id', user_id);
  res.redirect('/urls');
});

// clears the cookies to logout user
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// renders registration page
app.get('/register', (req, res) => {
  res.render('register');
});

// adds a new user to users object
app.post('/register', (req, res) => {
  const id = generateRandomID();
  const { email, password } = req.body;
  users[id] = { id, email, password };
  res.cookie('id', users[id]);
  console.log('Cookie Output:', users[id]);
  console.log(users);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});