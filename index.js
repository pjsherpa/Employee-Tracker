// first thing I would do is install npm packages npm i, npm i inquiry, npm i mysql2, npm i express
const express = require("express");
const fs = require("fs");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const PORT = process.env.PORT || 3001;
const app = express();
// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "localhost",
    // MySQL username,
    user: "root",
    // TODO: Add MySQL password here
    password: "",
    database: "movies_db",
  },
  console.log(`Connected to the movies_db database.`)
);

const choices = function () {
  inquirer
    .prompt([
      {
        name: "office",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "Add Employee",
          "Update Employee Role",
          "View all roles",
          "Add Role",
          "View All Departments",
          "Add Department",
          "Quit",
        ],
      },
    ])
    .then(function (select) {
      if (select.office === "View All Employees") {
        showAllEmployees();
      } else if (select.office === "Add Employee") {
        addEmployee();
      } else if (select.office === "Update Employee Role") {
        updateRole();
      } else if (select.office === "View all roles") {
        allRoles();
      } else if (select.office === "Add Role") {
        addRole();
      } else if (select.office === "View All Departments") {
        viewAllDepartments();
      } else if (select.office === "Add Department") {
        addDepartment();
      } else {
        quit();
      }
    });
};

// view all employees(invokes SELECT * employee_name which presents?)
const showAllEmployees = function () {
  app.get("/api/all-employees", (req, res) => {
    const mysql = `SELECT employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary,employee.manager_id AS employee.first_name FROM department INNER JOIN roles ON department.id = roles.id 
    INNER JOIN employee ON roles.id = employee.id ORDER BY department.id;`;
    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });
};
// add employee(function with more inquiry)

// update employee role(function to delete role and create role is that how we append does the new role appear here?)

// view all roles(invokes SELECT * employee_name which presents?)
const allRoles = function () {
  app.get("/api/roles", (req, res) => {
    const sql = `SELECT id, title FROM roles`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "success",
        data: rows,
      });
    });
  });
};
// add role()(function add new role with more inquiry) --->

// Create a role 2 steps inquiry and express
// Step 1:inquiry bit
const addRole = function () {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Add new Role title:",
      },
      {
        name: "salary",
        type: "inputy",
        message: "How much is the salary for this role?",
      },
      {
        //check department_id no. which is which. It has not been created yet.
        name: "deprtment_id",
        type: "list",
        message: "Department id?",
        choices: [1, 2, 3, 4],
      },
    ])
    // Step2:express bit read from file?
    .then(function () {
      app.post("/api/add-role", ({ body }, res) => {
        const mysql = `INSERT INTO roles (title, salary, department_id)
    VALUES (?)`;
        const params = [body.title, body.salary, body.department_id];

        db.query(sql, params, (err, result) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "success",
            data: body,
          });
        });
      });
    });
};
// view all department(invokes SELECT * employee_name which presents?)

// add department(function create new department with inquiry questions)

// quit(invoke exit in sql)

choices();

// fs write file to data here

// where routing is listening
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
