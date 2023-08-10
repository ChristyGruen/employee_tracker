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
      // createManagerList()
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
    // createDeptList()
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
      addEmployee(result)
    })
  };

let empData = {}
/////////////////addEmployee first function
function addEmployee(roleList){
  console.log(roleList);
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
      choices: roleList //get list of roles from db to keep updated (object with name=title and value = id)
    }
  ])
  .then((response)=>{
    console.log('line237')
    empData = response
    console.log(empData)
    createManagerList(empData)
  })
};
/////////////////////////// function to select manager list
function createManagerList(edata){
  console.log('line245')
  console.log(edata)
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = (Select r.departmentID from roles r where r.ID = ${edata.empRole}); `,(err,result)=>{
  if(err){
    console.log(err);
  }
  if(result.length >0){
  console.log('this is the result from createManagerList');
  console.log(result);
  addEmployee2(result,edata)
  } else {
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees);`, (err,result)=>{
    if(err){
      console.log(err);
    }
    console.log('line260')
    console.log(result)
    addEmployee2(result,edata)
  })
  }
})
}

///////////////////second function for add employees because I don't know how to do async
function addEmployee2(listee,datae){
  inquirer
  .prompt([
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empMgr',
      choices:listee //get list of managers from db based on dept to keep updated (object with name = concat names, id = managerID)
    }
  ])
  .then((response)=>{
  //write to employee table
  db.query(`INSERT INTO employees (firstName, lastName, roleID, managerID) VALUES ("${datae.firstName}","${datae.lastName}",${datae.empRole},${response.empMgr});`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log(`Employee ${datae.firstName} ${datae.lastName} with roleID ${datae.empRole} and managerID ${response.empMgr} added to the db `)
  })
})
}

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
      console.log('line271')
      console.log(resultObject)
      createRoleList(resultObject)
    })
  })
};

function createRoleList(defaults){
  db.query(`select title as name, id as value from roles;`, (err, result) => {
    if (err) {
      console.log(err);
    }
    console.log('this is the result from createRoleList')
    console.log(result)
    updateEmployee(result, defaults)
  })
};


//this will hold updateEmployee data to pass to the updateEmployee2 function
let updateEmpData = {}

//function to update employee info based on selected employee ID, default info for the selected employee supplied
  function updateEmployee(rList, defaults2){
    console.log(rList)
    console.log(defaults2)
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
        choices: rList,
        default: defaults2.roleID
      },
      // {
      //   type: 'list',
      //   message: "Who is the employee's manager?",
      //   name: 'empMgr',
      //   choices:['Don Key',
      //   'Ella Fant',
      //   'Felix Cited',
      //   'Jack Pott',
      //   'Izzy Goudinov',
      //   'Kerri Oki',
      //   'Marv Ellis', 
      //   'Lee Thargic',
      //   'Holly Day'], //get list of managers from db based on dept to keep updated (object with name = concat names, id = managerID)
      //   default: selectEmp.managerID
      // }
    ])
    .then((response)=>{
      console.log(response)
      updateEmpData = response
      createManagerList2(updateEmpData, defaults2)
      //go to next function in daisy chain


    })
  };

  function createManagerList2(updateEmpData2, defaults3){
////////////////////////////////////////////////////////////////////////////////
  console.log('line344')
  console.log(updateEmpData2)
  console.log(defaults3)
  db.query(`SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = (Select r.departmentID from roles r where r.id = ${updateEmpData2.empRoley}); `,(err,result)=>{
  if(err){
    console.log(err);
  }
  console.log('row351')
  console.log(result)
  if(result.length == 0){

  db.query(`SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees);`, (err,result)=>{
    if(err){
      console.log(err);
    }
    console.log('line360')
    console.log(result)
    mgrlist= result
    updateEmployee2(mgrlist,updateEmpData2, defaults3)
  })
  } else {
    console.log('this is the result from createManagerList');
    console.log(result);
    mgrlist = result
    updateEmployee2(mgrlist,updateEmpData2, defaults3)
  }
})
}
////////////////////////////////////////////////////////////////////////////////
  function updateEmployee2(mgrlist2, updateEmpData3, defaults4){
    //do stuff
    console.log(mgrlist2)
    console.log(updateEmpData3)
    console.log(defaults4)

    inquirer
    .prompt([
    {
      type: 'list',
      message: "Who is the employee's manager?",
      name: 'empMgr2',
      choices: mgrlist2,
      default: defaults4.managerID
    }
  ])
  .then((response)=>{
    console.log(response)
    //update employee table
    db.query(`UPDATE employees SET firstName ="${updateEmpData3.firstNamey}", lastName = "${updateEmpData3.lastNamey}", roleID = ${updateEmpData3.empRoley}, managerID = ${response.empMgr2} where id =${defaults4.id};`, (err, result) => {
      if (err) {
        console.log(err);
      }
      console.log(`Employee ${updateEmpData3.firstNamey} ${updateEmpData3.lastNamey} with roleID ${updateEmpData3.empRoley} and managerID ${response.empMgr2} updated in the db `)
    })

  })
  }
