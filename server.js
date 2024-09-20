
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

const { createUser, findUserByEmail, comparePassword } = require('./models/User');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('./models/Todo');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Registration endpoint
app.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await createUser(email, password);
    res.status(201).json({ message: 'User registered', user });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user || !(await comparePassword(password, user.password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Middleware to authenticate JWT
const authenticate = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ message: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ message: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Get all todos
app.get('/get', authenticate, async (req, res) => {
  try {
    const todos = await getTodos();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Add a new todo
app.post('/add', authenticate, async (req, res) => {
  try {
    const { task } = req.body;
    const todo = await createTodo(task);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Update a todo status
app.put('/update/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await updateTodo(id, true);
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error });
  }
});

// Delete a todo
app.delete('/delete/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteTodo(id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
