// app.js

const express = require("express");
const bodyParser = require("body-parser");

const employees = [
  {
    employeeId: "1",
    employeeName: "Ritu Raj",
    employeePost: "Developer",
    employeeSalary: "56000",
  },
  {
    employeeId: "2",
    employeeName: "Amit kumar",
    employeePost: "Front-End Developer",
    employeeSalary: "40000",
  },
];

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("EmpSalaryUI", {
    data: employees,
  });
});

app.post("/", (req, res) => {
  const inputEmployeeId = (employees.length + 1).toString();
  const inputEmployeeName = req.body.employeeName;
  const inputEmployeePost = req.body.employeePost;
  const inputEmployeeSalary = req.body.employeeSalary;

  employees.push({
    employeeId: inputEmployeeId,
    employeeName: inputEmployeeName,
    employeePost: inputEmployeePost,
    employeeSalary: inputEmployeeSalary,
  });

  res.render("EmpSalaryUI", {
    data: employees,
  });
});

app.post("/delete", (req, res) => {
  const requestedEmployeeId = req.body.employeeId;
  const index = employees.findIndex(
    (employee) => employee.employeeId === requestedEmployeeId
  );

  if (index !== -1) {
    employees.splice(index, 1);
  }

  res.render("EmpSalaryUI", {
    data: employees,
  });
});

app.post("/update", (req, res) => {
  const requestedEmployeeId = req.body.employeeId;
  const inputEmployeeName = req.body.employeeName;
  const inputEmployeePost = req.body.employeePost;
  const inputEmployeeSalary = req.body.employeeSalary;

  const employee = employees.find(
    (employee) => employee.employeeId === requestedEmployeeId
  );

  if (employee) {
    employee.employeeName = inputEmployeeName;
    employee.employeePost = inputEmployeePost;
    employee.employeeSalary = inputEmployeeSalary;
  }

  res.render("EmpSalaryUI", {
    data: employees,
  });
});

app.listen(3000, () => {
  console.log("App is running on port 3000");
});
