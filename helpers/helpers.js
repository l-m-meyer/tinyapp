// returns a string of 6 random alphanumeric characters
const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 6);
};

// returns an object with the unique urls for a specified user
const urlsForUser = (id, urlDB) => {
  const userUrls = {};
  for (let key in urlDB) {
    if (urlDB[key].userID === id) {
      userUrls[key] = urlDB[key];
    }
  } return userUrls;
};

// returns a boolean value to find a user by their email
const findEmail = (email, userDB) => {
  const emailExists = Object.keys(userDB).find(userID => userDB[userID].email === email);

  return emailExists;
};

// returns the user id of a user searched their email
const getUserByEmail = (email, userDB) => {
  for (let user in userDB) {
    if (userDB[user].email === email) {
      return user;
    }
  }
};

const shortURLExists = (shortURL, urlDB) => {
  return urlDB[shortURL] === undefined ? false : true;
};

module.exports = { 
  generateRandomID,
  findEmail,
  getUserByEmail,
  urlsForUser,
  shortURLExists 
};