-- this was used as the starting block for the queries used in the final code. Additional updates were needed to fit the flow of the functions, etc.

-- view all departments: formatted table showing department names and department ids
SELECT * from departments;

-- view all roles:  job title, role id, the department that role belongs to, and the salary for that role
SELECT r.title as jobTitle, r.id as roleID, d.departmentName, r.salary as salary from roles r, departments d where r.departmentID = d.id;

select * from employees;

-- view all employees: formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
SELECT e.id as employeeID, e.firstName, e.lastName, r.title as jobTitle, d.departmentName, r.salary as salary, concat(m.firstName,' ',m.lastName) as manager from employees m, employees e,  roles r, departments d where e.roleID = r.id and r.departmentID = d.id and m.id = e.managerID order by e.id;

-- view all employees: formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
-- another way to write the same query above 
SELECT e.id as employeeID, e.firstName, e.lastName, r.title as jobTitle, d.departmentName, r.salary as salary, concat(m.firstName,' ',m.lastName) as manager
FROM employees e
INNER JOIN employees m, roles r, departments d
WHERE e.roleID = r.id and
r.departmentID = d.id and 
m.id = e.managerID
order by e.id;

-- add department 
INSERT INTO departments(departmentName)
VALUES ();

-- add role
INSERT INTO roles(title, salary, departmentID)
VALUES ('Hot Dog vendor', 150000, 8);

-- add employee Sam Pull as an IT analyst reporting to Lee Thargic
INSERT INTO employees(firstName, lastName, roleID, managerID)
VALUES ('Sam', 'Pull', 6, 6);

-- update employee Dee Zaster from roleID 2 = purchasing analyst to  roleID 11 = purchasing manager 
UPDATE employees
SET roleID = 11, managerID = 17
WHERE id = 2;







-- additional query work saved below
use employee_tracker_db;

select * from employees;

-- create list of manager e.ids
Select distinct managerID from employees
order by managerID;



SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from employees e where 


SELECT r.id, r.departmentID
FROM roles r
WHERE r.id = 12;

select * from departments where id = 4;

select id from departments where id = (SELECT r.departmentID
FROM roles r
WHERE r.id = 12);

select id from roles where departmentID = (select id from departments where id = (SELECT r.departmentID
FROM roles r
WHERE r.id in (12)));

select * from employees where managerID = (select id from roles where departmentID = (select id from departments where id = (SELECT r.departmentID
FROM roles r
WHERE r.id in (12))));

concat(e.firstName,' ',e.lastName) as manager, e.id as value

-- this just might work   replace 4 with a variable passed in from role
SELECT e.firstName, e.lastName, r.title, d.departmentName, d.id
from roles r
	left join employees e on e.roleID = r.id
    inner join departments d on d.id = r.departmentID
where
	e.roleID in (Select distinct managerID from employees)
	and d.id = 4; 
    
   --  remove all the line breaks
SELECT e.firstName, e.lastName, r.title, d.departmentName, d.id from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = 6; 

-- create manager choices list by role selected
SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees) and d.id = (Select r.departmentID from roles r where r.ID = 12); 

get department id by role
Select r.departmentID from roles r where r.ID = 12;

SELECT concat(e.firstName,' ',e.lastName) as manager, e.id as value from roles r left join employees e on e.roleID = r.id inner join departments d on d.id = r.departmentID where e.roleID in (Select distinct managerID from employees);


UPDATE employees SET firstName = 'Leigh', lastName = 'Downey', roleID = 11, managerID = 17 WHERE id = 1; 
 
 
 
