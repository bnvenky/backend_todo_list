const db = require('../db');

// Function to create a new todo
const createTodo = (task) => {
  return new Promise((resolve, reject) => {
    db.run(`INSERT INTO todos (task) VALUES (?)`, [task], function(err) {
      if (err) return reject(err);
      resolve({ id: this.lastID, task });
    });
  });
};

// Function to fetch all todos
const getTodos = () => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM todos`, [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

// Function to update a todo
const updateTodo = (id, done) => {
  return new Promise((resolve, reject) => {
    db.run(`UPDATE todos SET done = ? WHERE id = ?`, [done, id], function(err) {
      if (err) return reject(err);
      resolve({ id });
    });
  });
};

// Function to delete a todo
const deleteTodo = (id) => {
  return new Promise((resolve, reject) => {
    db.run(`DELETE FROM todos WHERE id = ?`, [id], function(err) {
      if (err) return reject(err);
      resolve({ id });
    });
  });
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };
