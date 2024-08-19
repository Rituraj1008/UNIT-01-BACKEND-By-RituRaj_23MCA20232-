const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Create or add an employee
app.post('/addEmployee', (req, res) => {
  const newEmployee = req.body;
  fs.readFile('employees.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send('Error reading file');
      return;
    }

    const employees = data ? JSON.parse(data) : [];
    employees.push(newEmployee);

    fs.writeFile('employees.json', JSON.stringify(employees, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing file');
        return;
      }

      res.status(200).send('Employee added successfully');
    });
  });
});

// Read or get all employees
app.get('/getEmployees', (req, res) => {
  fs.readFile('employees.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send('Error reading file');
      return;
    }

    const employees = data ? JSON.parse(data) : [];
    res.json(employees);
  });
});

// Update an employee
app.put('/updateEmployee/:name', (req, res) => {
  const { name } = req.params;
  const updatedEmployee = req.body;
  fs.readFile('employees.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send('Error reading file');
      return;
    }

    let employees = data ? JSON.parse(data) : [];
    employees = employees.map(emp => emp.name === name ? updatedEmployee : emp);

    fs.writeFile('employees.json', JSON.stringify(employees, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing file');
        return;
      }

      res.status(200).send('Employee updated successfully');
    });
  });
});

// Delete an employee
app.delete('/deleteEmployee/:name', (req, res) => {
  const { name } = req.params;
  fs.readFile('employees.json', 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      res.status(500).send('Error reading file');
      return;
    }

    let employees = data ? JSON.parse(data) : [];
    employees = employees.filter(emp => emp.name !== name);

    fs.writeFile('employees.json', JSON.stringify(employees, null, 2), (err) => {
      if (err) {
        res.status(500).send('Error writing file');
        return;
      }

      res.status(200).send('Employee deleted successfully');
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
