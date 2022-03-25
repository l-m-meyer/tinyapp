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

const getUserByEmail = (email, userDB) => {
  for (let user in userDB) {
    if (userDB[user].email === email) {
      return user;
    }
  }
};

module.exports = { 
  generateRandomID,
  getCurrentUser,
  findEmail,
  getUserByEmail,
  urlsForUser 
};