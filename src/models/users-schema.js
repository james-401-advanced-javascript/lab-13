'use strict';

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const roles = require('./roles-schema');

/**
 * The schema definition for a user record
 * @type {mongoose.Schema}
 */
const users = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String },
  role: {
    type: String,
    default: 'user',
    enum: ['admin', 'editor', 'user'],
    ref: 'roles',
  },
});

/**
 * Pre middleware which converts a string password into a hashed password before every save to MongoDB
 */
users.pre('save', async function() {
  this.password = await bcrypt.hash(this.password, 10);
});

/**
 * This function does a simple authentication by hashing the inputted password, and comparing it against an existing hashed password.
 * Because this is a statics function, `this` refers to the entire Users model
 * @param  {object}     auth    The authentication credentials, containing a key username and password
 * @return {Promise<object>}    A record of a user that was successfully authenticated against the credentials
 */
users.statics.authenticateBasic = async function(auth) {
  let query = { username: auth.username };
  let foundUser = await this.findOne(query);
  let isSamePassword = null;

  if (foundUser)
    isSamePassword = await bcrypt.compare(auth.password, foundUser.password);

  if (isSamePassword) return foundUser;
  else return null;
};

/**
 * This function generates a JSON Web Token from a user's id, role and the application's secret
 * Because this is a methods function, `this` refers to an individual user record
 * @return {string} The generated jwt token
 */
// === Implement timeout functionality for this token ====
// === Have code pass generateToken a flag that ===
// === sets a long or short (5 sec) timeout ===
// If the timeout param has been passed, set timeout for 5 secs
// otherwise, timeout is 1 hour
users.methods.generateToken = function(timeout) {
  let exp = Math.floor(Date.now() / 1000 + 60 * 60);
  if (timeout) exp = Math.floor(Date.now() / 1000 + 5);
  let secret = process.env.SECRET || 'this-is-my-secret';
  let tokenData = {
    id: this._id,
  };

  return jwt.sign({ exp, data: tokenData }, secret);
};

/**
 * Exporting a mongoose model generated from the above schema, statics, methods and middleware
 * @type {mongoose model}
 */
module.exports = mongoose.model('users', users);
