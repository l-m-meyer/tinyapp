/******************
 *  SETUP SERVER  *
 *****************/

const express = require('express');
const cookieSession = require('cookie-session');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const res = require('express/lib/response'); 

const app = express();
const PORT = 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}));
app.set('view engine', 'ejs');


/*****************************
 *  IMPORT HELPER FUNCTIONS  *
 ****************************/

const { 
  generateRandomID,
  findEmail,
  getUserByEmail,
  urlsForUser 
} = require('./helpers/helpers');

/**************************
 *  INITIALIZE DATABASES  *
 *************************/

const { urlDatabase } = require('./data/urlInfo');
const users = {};

/************
 *  ROUTES  *
 ***********/

// GET /
// redirects to urls_index for current logged in user or login page if not logged in
app.get('/', (req, res) => {
  const userID = req.session.user_id;
  
  if (!userID){
    return res.redirect('/login');
  }
  res.redirect('/urls');
});

// GET /urls
// renders urls_index page for current logged in user or status message if not logged in
app.get('/urls', (req, res) => {
  const userID = req.session.user_id;

  if (!userID){
    return res.status(403).send('<p>Please <a href="/login">login</a> first.</p>');
  }

  const userUrls = urlsForUser(userID, urlDatabase);

  const templateVars = { 
    urls: userUrls, 
    user: users[userID] 
  };
  
  res.render('urls_index', templateVars);
});


// GET /urls/new
app.get('/urls/new', (req, res) => {
  const userID = req.session.user_id;
  const templateVars = { 
    user: users[userID] 
  };

  if (!userID){ 
    return res.redirect('/login');
  }
  res.render('urls_new', templateVars);
});


// GET /urls/:shortURL
app.get('/urls/:shortURL', (req, res) => {
  const userID = req.session.user_id;
  const urlToEdit = urlDatabase[req.params.shortURL];

  if (urlToEdit.userID !== userID) {
    return res.status(403).send('You do not have permission.');
  }

  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL, 
    user: users[userID] 
  };
  res.render('urls_show', templateVars);
});

// GET /u/:shortURL
// uses the shortURL to redirect to the longURL
app.get('/u/:shortURL', (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  
  res.redirect(longURL);
});

// POST /urls
app.post('/urls', (req, res) => {
  const userID = req.session.user_id;
  
  let longURL = req.body.longURL;
  if (!longURL.includes('http')) {
    longURL = 'http://' + longURL;
  }

  const shortURL = generateRandomID();
  urlDatabase[shortURL] = {
    longURL,
    userID
  };
  res.redirect(`/urls/${shortURL}`);
});

// POST /urls/:shortURL/delete
// deletes a url
app.post('/urls/:shortURL/delete', (req, res) => {
  const userID = req.session.user_id;
  const urlToDelete = urlDatabase[req.params.shortURL];

  if (urlToDelete.userID !== userID) {
    return res.status(403).send('You do not have permission.');
  }
  
  const shortURL = req.params.shortURL;
  for (let url in urlDatabase) {
    if (url === shortURL) {
      delete urlDatabase[shortURL];
      res.redirect('/urls');
    }
  }
});

// POST /urls/:shortURL
// edits the longURL
app.post('/urls/:shortURL', (req, res) => {
  const userID = req.session.user_id;
  const shortURL = req.params.shortURL;
  let longURL = req.body.longURL;

  if (!longURL.includes('http')) {
    longURL = 'http://' + longURL;
  }
  if (!users[userID]) {
    return res.redirect('/login');
  }
  urlDatabase[shortURL] = {longURL, userID}
  res.redirect('/urls');
});

// renders login page
app.get('/login', (req, res) => {
  const userID = req.session.user_id;
  if (users[userID]){
    return res.redirect('/urls');
  }
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
  const userID = getUserByEmail(email, users);
  
  if (!emailExists) {
    return res.status(403).send('Unregistered email.');
  }
  const passwordMatches = bcrypt.compareSync(password, users[userID].password);

  if (emailExists && !passwordMatches) {
    return res.status(403).send('Incorrect password.');
  }
  
  req.session.user_id = users[userID].id;
  res.redirect('/urls');
});

// clears the cookies to logout user
app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect('/login');
});

// renders registration page
app.get('/register', (req, res) => {
  const userID = req.session.user_id;
  if (userID && users[userID]){
    return res.redirect('/urls');
  }
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
  
  const hash = bcrypt.hashSync(password, 10);
  
  users[id] = { 
    id, 
    email, 
    password: hash 
  };
  
  req.session.user_id = id;
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}!`);
});