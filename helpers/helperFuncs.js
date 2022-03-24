const { users } = require('../data/userInfo');

// returns a string of 6 random alphanumeric characters
const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 6);
};

const getCurrentUser = (userDB, req) => {
  
};

const addUsers = () => {};

const findEmail = (email, userDB) => {
  const emailExists = Object.keys(userDB).find(userID => userDB[userID].email === email);

  return emailExists;
};

const findPassword = (password, userDB) => {
  const passwordMatches = Object.keys(userDB).find(userID => userDB[userID].password === password);

  return passwordMatches;
}

const fetchID = (email) => {
  for (let key in users) {
    if (users[key].email === email) {
      return key;
    }
  }
};

module.exports = { 
  generateRandomID,
  getCurrentUser,
  findEmail,
  findPassword,
  fetchID 
};