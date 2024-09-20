const bcrypt = require('bcrypt');
const db = require('../db');

// Function to create a new user
const createUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [email, hashedPassword], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, email });
    });
  });
};

// Function to find a user by email
const findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
};

// Function to compare password
const comparePassword = (inputPassword, hashedPassword) => {
  return bcrypt.compare(inputPassword, hashedPassword);
};

module.exports = { createUser, findUserByEmail, comparePassword };
