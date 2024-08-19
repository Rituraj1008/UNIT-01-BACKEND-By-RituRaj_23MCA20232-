const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

// Path to the JSON file where data will be stored
const dataFilePath = path.join(__dirname, 'data.json');

// Helper function to read data from the JSON file
function readData() {
  const jsonData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(jsonData);
}

// Helper function to write data to the JSON file
function writeData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

// API to handle user sign-up (Create)
app.post('/signup', (req, res) => {
  const { name, email, password } = req.body;
  const users = readData();
  const userExists = users.find(user => user.email === email);

  if (userExists) {
    return res.status(400).send('User already exists');
  }

  users.push({ name, email, password });
  writeData(users);
  res.status(201).send('User created successfully');
});

// API to handle login (Read)
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = readData();
  const user = users.find(user => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).send('Invalid email or password');
  }

  res.status(200).json(user);
});

// API to update user data (Update)
app.put('/users/:email', (req, res) => {
  const { email } = req.params;
  const { name, password } = req.body;
  const users = readData();
  const userIndex = users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  users[userIndex] = { ...users[userIndex], name, password };
  writeData(users);
  res.status(200).send('User updated successfully');
});

// API to delete a user (Delete)
app.delete('/users/:email', (req, res) => {
  const { email } = req.params;
  const users = readData();
  const filteredUsers = users.filter(user => user.email !== email);

  if (users.length === filteredUsers.length) {
    return res.status(404).send('User not found');
  }

  writeData(filteredUsers);
  res.status(200).send('User deleted successfully');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
