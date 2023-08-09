const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySQL password
    password: 'MySQL1_Chris!',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the books_db database.`)
);


//first question leads to subsets of questions
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name:'trackerOptions',
      choices:[{name:'view all departments',value: 1},
      {name: 'view all roles', value:2},
      {name: 'view all employees',value:3},
      {name: 'add a department',value:4},
      {name: 'add a role',value:5},
      {name: 'add an employee',value:6},
      {name:"update an employee's role",value:7}]
    }
    // choices arrays can contain objects with name, value, short  
    //https://www.npmjs.com/package/inquirer
  ])
  .then((response)=>{
    console.log(response)
    if (response.trackerOptions == 1){
      //sql query to show depts 
      db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
      });
    }
    else if(response.trackerOptions ==2){
      //sql query to show roles
      db.query("SELECT r.title as jobTitle, r.id as roleID, d.departmentName, r.salary as salary from roles r, departments d where r.departmentID = d.id;", (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      });
    }
    else if(response.trackerOptions == 3){
      //sql query to show employees
      db.query("SELECT e.id as employeeID, e.firstName, e.lastName, r.title as jobTitle, d.departmentName, r.salary as salary, concat(m.firstName,' ',m.lastName) as manager from employees m, employees e,  roles r, departments d where e.roleID = r.id and r.departmentID = d.id and m.id = e.managerID order by e.id;", (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
      });
    }
    else if(response.trackerOptions == 4){
      //ask dept name then sql query to add dept
      addDept()
    }
    else if (response.trackerOptions == 5){
      //function to ask three qs to add role
      //add a query to populate an object to help select department (by name, return deptID)
      // addRole()
      createDeptList()
    }
    else if (response.trackerOptions == 6){
      //function to as 4 qs to add employee
      //add a query to populate an object to help select role (by name, return roleID) and manager (by name, return managerID)
      // addEmployee()
      createRoleList()
      createManagerList()
    }
    else if (response.trackerOptions ==7){
      //function to update employee
      //add question for which employee ID to update
      //add a query to populate an object that can be passed in as 'objection' to populate the defaults during the update questions
      let selectedEmpID = 4;
      defaultUpdateEmployee(selectedEmpID);
    }
    else {console.log('something is out of sorts')}
    
  })
//could create an object to loop through instead of this ifffffff statement?  or could use switch case break

///////////////////function to add a department
function addDept(){
  inquirer
  .prompt([
    {
      type: 'input',
      message: 'What is the Department Name?',
      name: 'deptName'
    }
  ])
  .then((response)=>{
    console.log(response)
    //write to dept table
    db.query(`INSERT INTO departments(departmentName) VALUES ("${response.deptName}");`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Department ${response.deptName} added to the database`)

    })
  })
};


/////////////////two functions to add role
function createDeptList(){
  db.query(`select departmentName as name, id as value from departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('this is the result from createdeptlist')
    console.log(result)
    addRole(result)
  })
};

function addRole(roleDeptList){
    createDeptList()
    inquirer
    .prompt([
      {
        type: 'input',
        message: 'What is the role title?',
        name: 'roleTitle'
      },
      {
        type: 'input',
        message: 'What is the role salary?',
        name: 'roleSalary'
      },
      {
        type: 'list',
        message: 'Which department does the role belong to?',
        name: 'roleDept',
        choices: roleDeptList
      }
    ])
    .then((response)=>{
      // console.log(response)
      // console.log(response.roleDept.value)
      //write to role table
      db.query(`INSERT INTO roles(title, salary, departmentID) VALUES ("${response.roleTitle}",${response.roleSalary},${response.roleDept});`, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(`Role ${response.roleTitle} with salary ${response.roleSalary} and deptID ${response.roleDept} added to the database`)
  
      })
    })
  };

////////////////////// three functions to add Employees
  function createRoleList(){
    db.query(`select title as name, id as value from roles;`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log('this is the result from createRoleList')
      console.log(result)
      // createManagerList(result)  //this doesn't work here
    })
  };

  function createManagerList(onion){
    db.query(`select  as name, id as value from employees where departmentID = ${onion.departmentID};`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log('this is the result from createManagerList')
      console.log(result)
      addEmployee(result)
    })
  };

function addEmployee(pickle){
  inquirer
  .prompt([
    {
      type: 'input',
      message: "What is the employee's first name?",
      name: 'firstName'
    },
    {
      type: 'input',
      message: "What is the employee's last name?",
      name: 'lastName'
    },
    {
      type: 'list',
      message: "What is the employee's role?",
      name: 'empRoll',
      choices:[] //get list of roles from db to keep updated (object with name=title and value = id)
    },
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empMgr',
      choices:[] //get list of managers from db based on dept to keep updated (object with name = concat names, id = managerID)
    }
  ])
  .then((response)=>{
    console.log(response)
    //write to employee table
    db.query(`INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ("${response.roleTitle}",${response.roleSalary},${response.roleDept});`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Role ${response.roleTitle} with salary ${response.roleSalary} and deptID ${response.roleDept} added to the database`)

    })
  })
};

////////////////////two functions to update employee (also should use the prep functions from addEmployee)
// select employee ID number for employee update
function defaultUpdateEmployee(empID){
  inquirer
  .prompt([
    {
      type: 'input',
      message: "What is the employee's ID number?",
      name: 'selectEmpID'
    },
  ])
  .then((response)=>{
    // console.log(response)
    // console.log(`employeeID is ${response.selectEmpID}`);
    db.query(`select * from employees where id = ${response.selectEmpID};`, (err, result) => {
      if (err) {
        console.log(err);
      }
      resultObject = result[0]
      updateEmployee(resultObject)
    })
  })
};
//function to update employee info based on selected employee ID, default info for the selected employee supplied
  function updateEmployee(objection){
    console.log(`info passed into the updateEmployee function is ${objection}`);
    inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstNamey',
        default: objection.firstName
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastNamey',
        default: objection.lastName
      },
      {
        type: 'list',
        message: "What is the employee's role?",
        name: 'empRole',
        choices:['HR Representative',
          'Purchasing Analyst',
          'Product Planner',
          'Production Scientist',
          'Development Scientist',
          'IT Analyst',
          'Shipping Clerk',
          'Marketing Analyst',
          'Supervisor',
          'Manager',
          'Manager',
          'Manager',
          'Manager',
          'Senior Manager',
          'Senior Manager',
          'Senior Manager', 
          'Director'], //get list of roles from db to keep updated (object with name=title and value = id)
        default: objection.roleID
      },
      {
        type: 'list',
        message: "Who is the employee's manager?",
        name: 'empMgr',
        choices:['Don Key',
        'Ella Fant',
        'Felix Cited',
        'Jack Pott',
        'Izzy Goudinov',
        'Kerri Oki',
        'Marv Ellis', 
        'Lee Thargic',
        'Holly Day'], //get list of managers from db based on dept to keep updated (object with name = concat names, id = managerID)
        default: objection.managerID
      }
    ])
    .then((response)=>{
      console.log(response)
      //write to employee table
    })
  }
