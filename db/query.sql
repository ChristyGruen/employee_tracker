
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


 
 
 
