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

const choices = function () {
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
};

// view all employees(invokes SELECT * employee_name which presents?) -->done
function showAllEmployees() {
  const sql = `SELECT employee.first_name,employee.last_name,roles.title, department.department_name,roles.salary,employee.manager_id FROM department INNER JOIN roles ON department.id=roles.department_id INNER JOIN employee ON roles.id=employee.role_id ORDER BY department.id;`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log("error");
    }
    console.table(rows);
    console.log("Employees viewed!");
  });
  return choices();
}
// }
// add employee(function with more inquiry)WIP-->
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
        name: "role_id",
        type: "list",
        message: "role id?",
        choices: [1, 2, 3, 4, 5, 6],
      },
      // {
      //   name: "manager_id",
      //   type: "list",
      //   message: "Manager id?",
      //   choices: [1, 3, 5, 7],
      // },
    ])
    .then(function (ans) {
      const first_name = ans.first_name;
      const last_name = ans.last_name;
      const role_id = ans.role_id;
      // const manager_id = ans.manager_id;

      const sql = `INSERT INTO employee (first_name,last_name,role_id) 
      VALUES (?)`;
      const params = [first_name, last_name, role_id];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Employee has not been added\n");
        }
        console.log("Employee has now been added\n");
        sql;
      });
      return choices();
    });
};
// We join the table which connect the name and role_id to the role.

const updateRole = function () {
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
        } else {
          console.log("Role has now been updated\n");
          result;
        }
      });
      return choices();
    });
};

// view all roles(invokes SELECT * employee_name which presents?)--->done
const allRoles = function () {
  const sql = `SELECT id, title, salary, department_id FROM roles`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log("Cannot view roles");
    }
    //ref-https://developer.mozilla.org/en-US/docs/Web/API/console/table
    console.log("View roles\n");
    console.table(rows);
  });
  return choices();
};

// add role()(function add new role with more inquiry) --->done
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
        //         //check department_id no. which is which. It has not been created yet in seed.
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
        }
        console.log("New Role has now been added\n");
        sql;
      });
      return choices();
    });
};
// view all department(invokes SELECT * employee_name which presents?)-->done
const viewAllDepartments = function () {
  const sql = `SELECT department_name title FROM department`;

  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    }
    console.table(rows);
  });
  return choices();
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
    // Step2:express bit read from choice made?
    .then(function (ans) {
      const department_name = ans.department_name;

      const sql = `INSERT INTO department (department_name)
    VALUES (?)`;
      const params = [department_name];

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log("Department has not been added\n");
        }
        console.log("New Department has now been added\n");
        sql;
      });
      return choices();
    });
};

const quit = function () {
  process.exit();
};
choices();
// where routing is listening
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
