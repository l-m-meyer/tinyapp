const bcrypt = require('bcryptjs/dist/bcrypt');
const { users } = require('../data/userInfo');

// returns a string of 6 random alphanumeric characters
const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 6);
};

const getCurrentUser = (userDB, req) => {
  
};


const urlsForUser = (id, urlDB) => {
  const userUrls = {};
  for (let key in urlDB) {
    if (urlDB[key].userID === id) {
      userUrls[key] = urlDB[key];
    }
  } return userUrls;
}


const addUsers = () => {};

const findEmail = (email, userDB) => {
  const emailExists = Object.keys(userDB).find(userID => userDB[userID].email === email);

  return emailExists;
};

// const findPassword = (password, userDB) => {
//   const passwordMatches = bcrypt.compareSync(password, hash);
  
//   const passwordMatches = Object.keys(userDB).find(userID => userDB[userID].password === password);

//   return passwordMatches;
// }

const fetchID = (email, userDB) => {
  for (let key in userDB) {
    if (userDB[key].email === email) {
      return key;
    }
  }
};

module.exports = { 
  generateRandomID,
  getCurrentUser,
  findEmail,
  fetchID,
  urlsForUser 
};