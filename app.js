const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
let roles;
let departments;
let managers;

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "P@ssw0rd",
    database: "employees_db"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    start();
    getDepartments();
    getRoles();
    getManagers();
  });

  start = () => {
    inquirer
      .prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["ADD", "VIEW", "UPDATE", "DELETE"]
      })
      .then(function(answer) {
        if (answer.choices === "ADD") {
          addSomething()
          // afterConnection();
          console.log(answer.choices);
        }
        else if (answer.choices === "VIEW") {

        } 
        //else{
        //   connection.end();
        // }
      });
  }

getRoles = () => {
  connection.query("SELECT id, title FROM role", function(err, res) {
    if (err) throw err;
    roles = res;
    // console.table(roles);
  })
};

getDepartments = () => {
  connection.query("SELECT id, name FROM department", function(err, res) {
    if (err) throw err;
    departments = res;
    // console.log(departments);
  })
};

getManagers = () => {
  connection.query("SELECT id, first_name, last_name, CONCAT_WS(' ', first_name, last_name) AS managers FROM employee", function(err, res) {
    if (err) throw err;
    managers = res;
    // console.table(managers);
  })
};

addSomething = () => {
  inquirer.prompt([
    {
      name: "add",
      type: "list",
      message: "What would you like to add?",
      choices: ["DEPARTMENT", "ROLE", "EMPLOYEE"]
    }
  ]).then(function(answer) {
    if (answer.add === "DEPARTMENT") {
      console.log("Add a new: " + answer.add);
      addDepartment();
    }
    else if (answer.add === "ROLE") {
      console.log("Add a new: " + answer.add);
      addRole();
    }
    else if (answer.add === "EMPLOYEE") {
      console.log("Add a new: " + answer.add);
      addEmployee();
    } else {
      connection.end();
    }
  })
};

addDepartment = () => {
  inquirer.prompt([
    {
      name: "department",
      type: "input",
      message: "What department would you like to add?"
    }
  ]).then(function(answer) {
    connection.query(`INSERT INTO department (name) VALUES ('${answer.department}')`, function(err, res) {
      if (err) throw err;
      console.log("1 new department added: " + answer.department);
    }) 
  })
};

addRole = () => {
  let departmentOptions = [];
  for (i = 0; i < departments.length; i++) {
    departmentOptions.push(Object(departments[i]));
  };
  // console.log(departmentOptions[1].name);
  // console.log(departmentOptions[1].id);

  inquirer.prompt([
    {
      name: "title",
      type: "input",
      message: "What role would you like to add?"
    },
    {
      name: "salary",
      type: "input",
      message: "What is the salary for this possition?"
    },
    {
      name: "department_id",
      type: "list",
      message: "What is the department for this possition?",
      choices: departmentOptions
    },
  ]).then(function(answer) {
    // console.log(departmentOptions);
    // console.log(answer.department_id);
    for (i = 0; i < departmentOptions.length; i++) {
      // console.log(departmentOptions[i].id);
      if (departmentOptions[i].name === answer.department_id) {
        // console.log(departmentOptions[i].id)
        department_id = departmentOptions[i].id
      }
    }


    connection.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.title}', '${answer.salary}', ${department_id})`, function(err, res) {
      if (err) throw err;

      console.log("1 new role added: " + answer.title);
    }) 
  })
};


addEmployee = () => {
  let roleOptions = [];
  for (i = 0; i < roles.length; i++) {
    roleOptions.push(Object(roles[i]));
    // console.log(roleOptions[i].title);
  };
  let managerOptions = [];
  for (i = 0; i < managers.length; i++) {
    managerOptions.push(Object(managers[i]));
    console.log(managerOptions[i].managers);
  }
  // console.log(departmentOptions[1].name);
  // console.log(departmentOptions[1].id);
  // console.log(roleOptions)
  inquirer.prompt([
    {
      name: "first_name",
      type: "input",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      type: "input",
      message: "What is the employee's last name?"
    },
    {
      name: "role_id",
      type: "list",
      message: "What is the department for this possition?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < roleOptions.length; i++) {
          choiceArray.push(roleOptions[i].title)
        }
        return choiceArray;
      }
    },
    {
      name: "manager_id",
      type: "list",
      message: "Who is the employee's manager?",
      choices: function() {
        var choiceArray = [];
        for (var i = 0; i < managerOptions.length; i++) {
          choiceArray.push(managerOptions[i].managers)
        }
        return choiceArray;
      }
    }
  ]).then(function(answer) {
    // console.log(answer.role_id);
    // console.log(roleOptions);
    for (i = 0; i < roleOptions.length; i++) {
      // console.log(departmentOptions[i].id);
      if (roleOptions[i].title === answer.role_id) {
        console.log(roleOptions[i].id)
        role_id = roleOptions[i].id
        console.log(role_id);
      }
    }

    for (i = 0; i < managerOptions.length; i++) {
      if (managerOptions[i].managers === answer.manager_id) {
        manager_id = managerOptions[i].id
      }
    }


    connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', ${role_id}, ${manager_id})`, function(err, res) {
      if (err) throw err;

      console.log("1 new employee added: " + answer.first_name + " " + answer.last_name);
    }) 
  })
};

// function addEmployee() {
//   // console.log(roleOptions[1].title);
//   // console.log(roleOptions[1].id);
//   inquirer.prompt([
//     {
//       name: "firstName",
//       type: "input",
//       message: "What is the employee first name?"
//     },
//     {
//       name: "lastName",
//       type: "input",
//       message: "What is the employee last name?"
//     },
//     {
//       name: "role_id",
//       type: "list",
//       message: "What is the role of the employee?",
//       choices: function() {
//         var roleOptions = [];
//         for (i = 0; i < roles.length; i++) {
//           roleOptions.push(roles[i]);
//           // console.log(roles[i]);
//         }
        
//         return roleOptions;
//       }
//     },
//     {
//       name: "manager_id",
//       type: "input",
//       message: "Who is the manager of the employee?"
//     }

//   ]).then(function(answer) {
//     // for (i = 0; i < roleOptions.length; i++) {
//     //   // console.log(departmentOptions[i].id);
//     //   if (roleOptions[i].name === answer.role_id) {
//     //     // console.log(departmentOptions[i].id)
//     //     role_id = roleOptions[i].id
//     //   }
//     // }

//     connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.title}', '${answer.salary}', '${answer.department_id}')`, function(err, res) {
//       if (err) throw err;
//       console.log("1 new role added: " + answer.title);
//     }) 
//   })
// };

// function afterConnection() {
//   connection.query("SELECT * FROM role", function(err, res) {
//     if (err) throw err;
//     console.table(res);
//     connection.end();
//   });
// }
  