const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

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
  });

  function start() {
    inquirer
      .prompt({
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: ["ADD", "VIEW", "UPDATE", "DELETE"]
      })
      .then(function(answer) {
        if (answer.choices === "ADD") {
          // addSomething()
          afterConnection();
          console.log(answer.choices);
        }
        else if (answer.choices === "VIEW") {

        }
        // else if(answer.postOrBid === "BID") {
        //   bidAuction();
        // } else{
        //   connection.end();
        // }
      });
  }

function addSomething () {
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
    }
    else if (answer.add === "ROLE") {
      console.log("Add a new: " + answer.add);
    }
    else if (answer.add === "EMPLOYEE") {
      console.log("Add a new: " + answer.add);
    } else {
      connection.end();
    }
  })
}
  function afterConnection() {
    connection.query("SELECT * FROM role", function(err, res) {
      if (err) throw err;
      console.table(res);
      connection.end();
    });
  }
  