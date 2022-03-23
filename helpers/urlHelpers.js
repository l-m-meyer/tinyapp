// returns a string of 6 random alphanumeric characters
const generateRandomID = () => {
  return Math.random().toString(36).substr(2, 6);
};

module.exports = { generateRandomID };