const { assert } = require('chai');

const { getUserByEmail } = require('../helpers/helpers');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers);
    const expectedUserID = "userRandomID";
    
    assert.deepEqual(user, expectedUserID);
  });

  it('should return undefined if an email is non-existent', function() {
    const user = getUserByEmail("does@notexist.com", testUsers);
    const expectedUserID = undefined;

    assert.deepEqual(user, expectedUserID);
  });
});