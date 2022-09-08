// first thing I would do is install npm packages npm i, npm i inquirer, npm i mysql2, npm i express
//check which ones requires input list and choices and choices needs to be migrated from database.

//node index.js to invoke.

const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");

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
    .prompt({
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
    })
    .then(function (select) {
      console.log(select);
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
  const sql = `SELECT employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, employee.manager_id,
  CONCAT(manager.first_name,' ',manager.last_name) AS manager
  FROM employee
  LEFT JOIN roles
  ON employee.role_id=roles.id
  LEFT JOIN department
  ON roles.department_id=department.id
  LEFT JOIN employee manager 
  ON manager.id =employee.manager_id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
    }
    console.log("Employees viewed!");
    console.table(rows);
    choices();
  });
}

// add employee(function with more inquiry)WIP-->
function addEmployee() {
  db.query("SELECT * FROM roles", (err, result) => {
    if (err) console.log(err);
    result = result.map((role) => {
      return {
        name: role.title,
        value: role.id,
      };
    });
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
          choices: result,
        },
        {
          name: "manager_id",
          type: "list",
          message: "select a manager id...",
          choices: [1, 3, 5, 7],
        },
      ])
      .then((data) => {
        db.query(
          "INSERT INTO employee SET ?",
          {
            first_name: data.first_name,
            last_name: data.last_name,
            role_id: data.role_id,
            manager_id: data.manager_id,
          },
          (err) => {
            if (err) throw err;
            console.log("Employee has not been added\n");
            choices();
          }
        );
      });
  });
}

function updateRole() {
  let choicesTobemade = [];
  const options = `SELECT id,title FROM roles`;
  db.query(options, (err, list) => {
    if (err) {
      console.log(err);
    }
    for (let i = 0; i < list.length; i++) {
      choicesTobemade.push(list[i].title);
    }
  });

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
        choices: choicesTobemade,
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
    choices();
  });
}

// add role()(function add new role with more inquiry) --->done
function addRole() {
  //WIP for all choices check how to update choices linking with db.
  let choicesTobemade = [];
  const options = `SELECT department_name FROM department`;
  db.query(options, (err, list) => {
    if (err) {
      console.log(err);
    }

    for (let i = 0; i < list.length; i++) {
      choicesTobemade.push(list[i].department_name);
    }
  });

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
        choices: choicesTobemade,
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
    choices();
  });
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
