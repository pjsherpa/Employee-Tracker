// first thing I would do is install npm packages npm i, npm i inquiry, npm i mysql2, npm i express
const express = require("express");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const QueryString = require("qs");
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
    password: "",
    database: "office_db",
  },
  console.log(`Connected to the office_db database.`)
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

// view all employees(invokes SELECT * employee_name which presents?) -->done
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
    return choices();
  });
};
// add employee(function with more inquiry)-->done
const addEmployee = function () {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is your first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is your last name?",
      },
      {
        //check role_id no. which is which. It has not been created yet.
        name: "role_id",
        type: "list",
        message: "role id?",
        choices: [1, 2, 3, 4, 5, 6],
      },
    ])
    .then(function () {
      app.post("/api/add-Employee", ({ body }, res) => {
        const mysql = `INSERT INTO employee (first_name, last_name, role_id)
    VALUES (?)`;
        const params = [body.first_name, body.last_name, body.role_id];

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
      return choices();
    });
};
//WIP--->
// update employee role(function to delete role and create role is that how we append does the new role appear here?)
//We join the table which connect the name and role_id to the role.
const updateRole = function () {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is your id number?",
      },
    ])
    //not sure here-->
    .then(function () {
      app.delete("/api/roles/:id", (req, res) => {
        const sql = `DELETE FROM roles WHERE title = ?`;
        const params = [req.params.title];

        db.query(sql, params, (err, result) => {
          if (err) {
            res.statusMessage(400).json({ error: res.message });
          } else if (!result.affectedRows) {
            res.json({
              message: "id not found",
            });
          } else {
            res.json({
              message: "Role deleted for id",
              changes: result.affectedRows,
              id: req.params.title,
            });
          }
        });
      });
    })
    .then(function () {
      inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is your new title?",
        },
      ]);
    });
  // adding title after deleting title
  app.post("/api/roles/:id", ({ body }, res) => {
    const mysql = `INSERT INTO roles (title)
  VALUES (?)`;
    const params = [body.title];

    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({
        message: "Updated Role to database",
        data: body,
      });
    });
    return choices();
  });
};

// view all roles(invokes SELECT * employee_name which presents?)--->done
const allRoles = function () {
  app.get("/api/roles", (req, res) => {
    const sql = `SELECT id, title FROM roles`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "All Roles Displayed",
        data: rows,
      });
    });
    return choices();
  });
};

// add role()(function add new role with more inquiry) --->done
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
        name: "department_id",
        type: "list",
        message: "Which department does the role belong to?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Services"],
      },
    ])
    // Step2:read from file?
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
            message: "New Role has now been added",
            data: body,
          });
        });
      });
      return choices();
    });
};
// view all department(invokes SELECT * employee_name which presents?)-->done
const viewAllDepartments = function () {
  app.get("/api/alldepartments", (req, res) => {
    const sql = `SELECT department_name title FROM department`;

    db.query(sql, (err, rows) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({
        message: "All Department Displayed",
        data: rows,
      });
    });
    return choices();
  });
};
// add department(function create new department with inquiry questions)
const addDepartment = function () {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Add new department name:",
      },
    ])
    // Step2:express bit read from file?
    .then(function () {
      app.post("/api/add-department", ({ body }, res) => {
        const mysql = `INSERT INTO department (department_name)
    VALUES (?)`;
        const params = [body.department_name];

        db.query(sql, params, (err, result) => {
          if (err) {
            res.status(400).json({ error: err.message });
            return;
          }
          res.json({
            message: "New Department has now been added",
            data: body,
          });
        });
      });
      return choices();
    });
};

// quit(invoke exit in sql)
// WIP -->
quit();

choices();

// where routing is listening
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
