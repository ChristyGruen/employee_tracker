const fs = require('fs');
const inquirer = require('inquirer');

//first question leads to subsets of questions
inquirer
  .prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name:'trackerOptions',
      choices:['view all departments','view all roles','view all employees','add a role','add an employee',"update an employee's role"]
    }
  ])
  .then((response)=>{
    console.log(response)
  })