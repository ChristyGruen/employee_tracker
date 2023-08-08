const fs = require('fs');
const inquirer = require('inquirer');

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
    }
    else if(response.trackerOptions ==2){
      //sql query to show roles
    }
    else if(response.trackerOptions == 3){
      //sql query to show employees
    }
    else if(response.trackerOptions == 4){
      //ask dept name then sql query to add dept
      addDept()
    }
    else if (response.trackerOptions == 5){
      //function to ask three qs to add role
      addRole()
    }
    else if (response.trackerOptions == 6){
      //function to as 4 qs to add employee
      addEmployee()
    }
    else if (response.trackerOptions ==7){
      //function to update employee
      updateEmployee(objection)
    }
    else {console.log('something is out of sorts')}

  })
//could create an object to loop through instead of this ifffffff statement?
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
  })
};


  function addRole(){
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
        choices:['Human Resources',
        'Purchasing',
        'Planning',
        'Production',
        'Development',
        'IT',
        'Shipping',
        'Marketing',
        'Executive'] //get list of departments from db to keep updated
        //would be awesome to have it returned as an object with name and value populated from departmentName and id, then it would be super easy to get the deptID for input into the table.
      }
    ])
    .then((response)=>{
      console.log(response)
      //write to role table
    })
  };

  function addEmployee(){
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
    })
  };

let objection = {
  id:7,
  fName: 'Clara',
  lName: 'Nett',
  eRole: 'Shipping Clerk',
  eMgr: 9
}
console.log(objection.fName)
  //need to use employeeID or something to select one employee to update
  //could you pull the employee info into an object and use that for the defaults for the questions?  That way, all entries can be updated if you want and it's still easy, default is no update.
  function updateEmployee(objection){
    inquirer
    .prompt([
      {
        type: 'input',
        message: "What is the employee's first name?",
        name: 'firstName',
        default: objection.fName
      },
      {
        type: 'input',
        message: "What is the employee's last name?",
        name: 'lastName',
        default: objection.lName
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
        default: objection.eRole
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
        default: objection.eMgr
      }
    ])
    .then((response)=>{
      console.log(response)
      //write to employee table
    })
  }
