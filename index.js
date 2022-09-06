// first thing I would do is install npm packages npm i, npm i inquirer, npm i mysql2, npm i express
//check which ones requires input list and choices and choices needs to be migrated from database.

//node index.js to invoke.

const express = require("express");
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
    password: "",
    database: "employeetracker_db",
  },
  console.log(`Connected to the employeetracker_db.`)
);

function choices() {
  inquirer
    .prompt([
      {
        //add Bonus questions once this starts working
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
}
// view all employees(invokes SELECT * employee_name which presents?) -->done
function showAllEmployees() {
  const sql = `SELECT employee.first_name,employee.last_name,roles.title, department.department_name,roles.salary,employee.manager_id FROM department INNER JOIN roles ON department.id=roles.department_id INNER JOIN employee ON roles.id=employee.role_id ORDER BY department.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error");
    }
    console.log("Employees viewed!");
    console.table(rows);
  });
  choices();
}

// add employee(function with more inquiry)WIP-->
function addEmployee() {
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
        name: "role_id",
        type: "input",
        message: "role id?",
      },
      {
        name: "manager_id",
        type: "input",
        message: "Manager id?",
      },
    ])
    .then(function (ans) {
      const first_name = ans.first_name;
      const last_name = ans.last_name;
      const role_id = ans.role_id;
      const manager_id = ans.manager_id;

      const sql = `INSERT INTO employee (first_name) 
      VALUES (?)`;
      const params = [first_name, last_name, role_id, manager_id];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Employee has not been added\n");
          console.log(err);
        }
        console.log("Employee has now been added\n");
        sql;
      });
      choices();
    });
}

function updateRole() {
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is your id number?",
      },
      {
        name: "title",
        type: "list",
        message: "What is your new title?",
        choices: [
          "Sales-Lead",
          "Sales-Person",
          "LeadEngineer",
          "Software-Engineer",
          "AccountManager",
          "Accountant",
          "LegalTeamLead",
          "Lawyer",
        ],
      },
    ])
    //updates title.
    .then(function (ans) {
      const title = ans.title;
      const id = ans.id;
      const sql = `UPDATE roles SET title = ? WHERE id = ?`;
      const params = [title, id];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Role has not updated\n");
          console.log(err);
        } else {
          console.log("Role has now been updated\n");
          result;
        }
      });
      choices();
    });
}

// view all roles(invokes SELECT * employee_name which presents?)--->done
function allRoles() {
  const sql = `SELECT id, title, salary, department_id FROM roles`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Cannot view roles");
      console.log(err);
    }
    //ref-https://developer.mozilla.org/en-US/docs/Web/API/console/table
    console.log("View roles\n");
    console.table(rows);
  });
  choices();
}

// add role()(function add new role with more inquiry) --->done
function addRole() {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "Add new Role title:",
      },
      {
        name: "salary",
        type: "input",
        message: "How much is the salary for this role?",
      },
      {
        name: "department_id",
        type: "list",
        message: "Which department does the role belong to?",
        choices: ["Engineering", "Finance", "Legal", "Sales", "Services"],
      },
    ])

    .then(function (ans) {
      const title = ans.title;
      const salary = ans.salary;
      const department_id = ans.department_id;

      const sql = `INSERT INTO roles (title)
    VALUES (?)`;
      const params = [title, salary, department_id];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("No role added");
          console.log(err);
        }
        console.log("New Role has now been added\n");
        sql;
      });
      choices();
    });
}
// view all department(invokes SELECT * employee_name which presents?)-->done
function viewAllDepartments() {
  const sql = `SELECT department_name title FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
    }
    console.table(rows);
    console.log("\n");
  });
  choices();
}

// add department(function create new department with inquiry questions)
function addDepartment() {
  inquirer
    .prompt([
      {
        name: "department_name",
        type: "input",
        message: "Add new department name:",
      },
    ])
    // Step2:express bit read from choice made?
    .then(function (ans) {
      const department_name = ans.department_name;

      const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
      const params = [department_name];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Department has not been added\n");
          console.log(err);
        }
        console.log("New Department has now been added\n");
        result;
      });
      choices();
    });
}

function quit() {
  process.exit();
}

choices();

// where routing is listening
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`\n Server running on port ${PORT}`);
});
