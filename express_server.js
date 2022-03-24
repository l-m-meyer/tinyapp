const express = require('express');
const app = express();
const PORT = 8080;
const { urlDatabase } = require('./data/urlInfo');
const { 
  generateRandomID,
  findEmail,
  findPassword,
  fetchID 
} = require('./helpers/helperFuncs');
const { users } = require('./data/userInfo');

// converts the request body from a Buffer into a readable string
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

const cookieParser = require('cookie-parser');
const res = require('express/lib/response');
app.use(cookieParser());

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.redirect('/urls');
});

app.get('/urls', (req, res) => {
  const userID = req.cookies.user_id;

  const templateVars = { 
    urls: urlDatabase, 
    user: users[userID] 
  };
  
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {
  const userID = req.cookies.id;
  const templateVars = { 
    user: users[userID] 
  };
  res.render('urls_new', templateVars);
});

app.get('/urls/:shortURL', (req, res) => {
  const userID = req.cookies.id;
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL], 
    user: users[userID] 
  };
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

// renders login page
app.get('/login', (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = { 
    urls: urlDatabase, 
    user: users[userID] 
  };
  res.render('login', templateVars);
});

// creates a cookie to keep user logged in
app.post('/login', (req, res) => {
 
  // validate email and password have been passed
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password required.');
  }

  const emailExists = findEmail(email, users);
  
  const passwordMatches = findPassword(password, users);

  if (!emailExists) {
    return res.status(403).send('Unregistered email.');
  }

  if (emailExists && !passwordMatches) {
    return res.status(403).send('Incorrect password.');
  }
  
  res.cookie('user_id', fetchID(email));
  res.redirect('/urls');
});

// clears the cookies to logout user
app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

// renders registration page
app.get('/register', (req, res) => {
  const userID = req.cookies.user_id;
  const templateVars = { 
    urls: urlDatabase, 
    user: users[userID] 
  };
  res.render('register', templateVars);
});

// adds a new user to users object
app.post('/register', (req, res) => {
  // validate email and password have been passed
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send('Email and password required.');
  }
  // check if email exists
  if (findEmail(email, users)) {
    return res.status(400).send('Email already exists.');
  }
  
  const id = generateRandomID();

  users[id] = { id, email, password };
  res.cookie('user_id', id);
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});