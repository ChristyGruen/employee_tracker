const fs = require('fs');
const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'MySQL1_Chris!',
    database: 'employee_tracker_db'
  },
  console.log(`Connected to the books_db database.`)
);

function start(){
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
      {name:"update an employee's information",value:7},
      {name:'exit program',value:8}
    ]
    }
    // choices arrays can contain objects with name, value, short  
    //https://www.npmjs.com/package/inquirer
  ])
  .then((response)=>{
    // console.log(response)
    if (response.trackerOptions == 1){
      //sql query to show depts 
      db.query('SELECT * FROM departments', function (err, results) {
        console.table(results);
        console.log("=========================================================")
        start()
      });
    }
    else if(response.trackerOptions ==2){
      //sql query to show roles
      db.query("SELECT r.title as jobTitle, r.id as roleID, d.departmentName, r.salary as salary from roles r, departments d where r.departmentID = d.id;", (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        console.log("=========================================================")
        start()
      });
    }
    else if(response.trackerOptions == 3){
      //sql query to show employees
      db.query("SELECT e.id as employeeID, e.firstName, e.lastName, r.title as jobTitle, d.departmentName, r.salary as salary, concat(m.firstName,' ',m.lastName) as manager from employees m, employees e,  roles r, departments d where e.roleID = r.id and r.departmentID = d.id and m.id = e.managerID order by e.id;", (err, result) => {
        if (err) {
          console.log(err);
        }
        console.table(result);
        console.log("=========================================================")
        start()
      });
    }
    else if(response.trackerOptions == 4){
      //function to add dept
      addDept()
    }
    else if (response.trackerOptions == 5){
      //functions to add role
      createDeptList()
    }
    else if (response.trackerOptions == 6){
      //functions to add employee
      createRoleList()
    }
    else if (response.trackerOptions ==7){
      //functions to update employee info
      defaultUpdateEmployee();
    }
    else if (response.trackerOptions ==8){
      //exit program
      process.exit();
    }
    else {console.log('something is out of sorts')}
    
  });
};
/////////////ADD DEPT function////////////////////////////////////////////
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
    // console.log(response)
    //write to dept table
    db.query(`INSERT INTO departments(departmentName) VALUES ("${response.deptName}");`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Department ${response.deptName} added to the database`)
      console.log("=========================================================")
      start();

    })
  })
};
/////////////////ADD ROLE Functions/////////////////////////////////////
//create department list
function createDeptList(){
  db.query(`select departmentName as name, id as value from departments;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log('this is the result from createdeptlist')
    // console.log(result)
    addRole(result)
  })
};
//add role function
function addRole(roleDeptList){
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
        console.log("=========================================================")
        start()
  
      })
    })
  };
//////////////////////ADD EMPLOYEES////////////////////////////////////////////
  function createRoleList(){
    db.query(`select title as name, id as value from roles;`, (err, result) => {
      if (err) {
        console.log(err);
      }
      // console.log('this is the result from createRoleList')
      // console.log(result)
      addEmployee(result)
    })
  };
 //hold data from first function to pass into 2nd add employee function 
let empData = {}
//add employee 1st function
function addEmployee(roleList){
  // console.log('row170')
  // console.log(roleList);
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
      name: 'empRole',
      choices: roleList 
    }
  ])
  .then((response)=>{
    // console.log('line237')
    empData = response
    // console.log(empData)
    createManagerList(empData)
  })
};
//create mgr list
function createManagerList(edata){
  // console.log('line245')
  // console.log(edata)
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as name, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = (Select r.departmentID from roles r where r.ID = ${edata.empRole}); `,(err,result)=>{
  if(err){
    console.log(err);
  }
  if(result.length >0){
  // console.log('this is the result from createManagerList');
  // console.log(result);
  addEmployee2(result,edata)
  } else {
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as name, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees);`, (err,result)=>{
    if(err){
      console.log(err);
    }
    // console.log('line260')
    // console.log(result)
    addEmployee2(result,edata)
  })
  }
})
}
//second add employee function
function addEmployee2(listee,datae){
  inquirer
  .prompt([
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empMgr',
      choices:listee 
    }
  ])
  .then((response)=>{
  //write to employee table
  db.query(`INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ("${datae.firstName}","${datae.lastName}",${datae.empRole},${response.empMgr});`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Employee ${datae.firstName} ${datae.lastName} with roleID ${datae.empRole} and managerID ${response.empMgr} added to the db `)
    console.log("=========================================================")
    start()
  })
})
}
////////////////////UPDATE EMPLOYEE/////////////////////////////////////////
// select employee ID number for employee update
function defaultUpdateEmployee(){
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
      console.log('Update Employee Starting Info')
      console.log(resultObject)
      createRoleList2(resultObject)
    })
  })
};

function createRoleList2(defaults){
  db.query(`select title as name, id as value from roles;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    // console.log('this is the result from createRoleList')
    // console.log(result)
    // console.log(defaults)
    updateEmployee(result, defaults)
  })
};

//this will hold updateEmployee data to pass to the updateEmployee2 function
let updateEmpData = {}

//function to update employee info based on selected employee ID, default info for the selected employee supplied
  function updateEmployee(rList, defaults2){
    // console.log(rList)
    // console.log(defaults2)
    inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstNamey',
        default: defaults2.firstName
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastNamey',
        default: defaults2.lastName
      },
      {
        type: 'list',
        message: "What is the employee's role?",
        name: 'empRoley',
        default: defaults2.roleID,
        choices: rList
        
      },
    ])
    .then((response)=>{
      // console.log(response)
      updateEmpData = response
      createManagerList2(updateEmpData, defaults2)
    })
  };

  function createManagerList2(updateEmpData2, defaults3){
  // console.log('line318')
  // console.log(updateEmpData2)
  // console.log(defaults3)
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as name, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = (Select r.departmentID from roles r where r.id = ${updateEmpData2.empRoley}); `,(err,result)=>{
  if(err){
    console.log(err);
  }
  // console.log('row325')
  // console.log(result)
  if(result.length == 0){

  db.query(`SELECT concat(e.firstName,' ',e.lastName) as name, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) order by e.id;`, (err,result)=>{
    if(err){
      console.log(err);
    }
    // console.log('line333')
    // console.log(result)
    mgrlist= result
    updateEmployee2(mgrlist,updateEmpData2, defaults3)
  })
  } else {
    // console.log('this is the result from createManagerList');
    // console.log(result);
    mgrlist = result
    updateEmployee2(mgrlist,updateEmpData2, defaults3)
  }
})
}
  function updateEmployee2(mgrlist2, updateEmpData3, defaults4){
    //do stuff
    // console.log(mgrlist2)
    // console.log(updateEmpData3)
    // console.log(defaults4)

    inquirer
    .prompt([
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empMgr2',
      default: defaults4.managerID,
      choices: mgrlist2
    }
  ])
  .then((response)=>{
    // console.log(response)
    //update employee table
    db.query(`UPDATE employees SET firstName ="${updateEmpData3.firstNamey}", lastName = "${updateEmpData3.lastNamey}", roleID = ${updateEmpData3.empRoley}, managerID = ${response.empMgr2} where id =${defaults4.id};`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Employee ${updateEmpData3.firstNamey} ${updateEmpData3.lastNamey} with roleID ${updateEmpData3.empRoley} and managerID ${response.empMgr2} updated in the db `)
      console.log("=========================================================")
      start()
    })

  })
  }
  start()
