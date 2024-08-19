const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Path to the JSON file
const usersFilePath = path.join(__dirname, 'users.json');

// Helper function to read users data from the JSON file
function readUsersData() {
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    return JSON.parse(data);
  } else {
    return [];
  }
}

// Helper function to write users data to the JSON file
function writeUsersData(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

// Handle signup request
app.post('/signup', (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validation
  const namePattern = /^[A-Z][a-zA-Z]*$/;
  const phonePattern = /^\d{10}$/;
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  if (!namePattern.test(name)) {
    return res.status(400).send('Name should start with a capital letter and contain only alphabets.');
  }

  if (!phonePattern.test(phone)) {
    return res.status(400).send('Phone number must be exactly 10 digits.');
  }

  if (!passwordPattern.test(password)) {
    return res.status(400).send('Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, and one number.');
  }

  // Check if the email is valid
  const emailPattern = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
  if (!emailPattern.test(email)) {
    return res.status(400).send('Invalid email address.');
  }

  const users = readUsersData();

  // Check if the email already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).send('Email already in use');
  }

  // Add the new user to the users array
  const newUser = { id: users.length + 1, name, email, password, phone };
  users.push(newUser);

  // Save the updated users array to the JSON file
  writeUsersData(users);

  res.status(201).send('User registered successfully');
});

// Handle login request
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readUsersData();
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  res.status(200).json(user);
});

// Get all users (Read)
app.get('/users', (req, res) => {
  const users = readUsersData();
  res.status(200).json(users);
});

// Update user data (Update)
app.put('/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, password, phone } = req.body;

  const users = readUsersData();
  const userIndex = users.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  const updatedUser = { ...users[userIndex], name, email, password, phone };
  users[userIndex] = updatedUser;

  writeUsersData(users);
  res.status(200).send('User updated successfully');
});

// Delete a user (Delete)
app.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  const users = readUsersData();
  const filteredUsers = users.filter(user => user.id !== parseInt(id));

  if (users.length === filteredUsers.length) {
    return res.status(404).send('User not found');
  }

  writeUsersData(filteredUsers);
  res.status(200).send('User deleted successfully');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
