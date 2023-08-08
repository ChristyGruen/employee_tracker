USE employee_tracker_db;

INSERT INTO departments (departmentName)
VALUES ('Human Resources'),
--    -- PJ's typing qwa1111111111111111111111111111 --
  ('Purchasing'),
  ('Planning'),
  ('Production'),
  ('Development'),
  ('IT'),
  ('Shipping'),
  ('Marketing'),
  ('Executive');

INSERT INTO roles(title, salary, departmentID)
VALUES ('HR Representative', 48500, 1),
('Purchasing Analyst', 60000, 2),
('Product Planner', 80000, 3),
('Production Scientist', 60000, 4),
('Development Scientist', 85000, 5),
('IT Analyst', 80000, 6),
('Shipping Clerk', 38000, 7),
('Marketing Analyst', 60000, 8),
('Supervisor', 50000, 7),
('Manager', 65000, 1),
('Manager', 70000, 2),
('Manager', 70000, 4),
('Manager', 70000, 8),
('Senior Manager', 95000, 3),
('Senior Manager', 100000, 5),
('Senior Manager', 110000, 6),
('Director', 200000, 9);

INSERT INTO employees(firstName, lastName, roleID, managerID)
VALUES ('Leigh', 'Down', 1, 10),
  ('Dee', 'Zaster', 2, 11),
  ('Al', 'Dente', 3, 14),
  ('Barbie', 'Dahl', 4, 12),
  ('Justin', 'Case', 5, 15),
  ('Allie', 'Gater', 6, 16),
  ('Clara', 'Nett', 7, 9),
  ('Dewey', 'Needham', 8, 13),
  ('Don', 'Key', 9, 14),
  ('Ella', 'Fant', 10, 17),
  ('Felix', 'Cited', 11, 17),
  ('Jack', 'Pott', 12, 17),
  ('Izzy', 'Goudinov', 13, 17),
  ('Kerri', 'Oki', 14, 17),
  ('Marv', 'Ellis', 15, 17),
  ('Lee', 'Thargic', 16, 17),
  ('Holly', 'Day', 17, 17),
  ('Ella', 'Vader', 1, 10),
  ('Joe', 'King', 2, 11),
  ('Otto', 'Graff', 3, 14),
  ('Mike', 'Rafone', 4, 12),
  ('Rita', 'Book', 5, 15),
  ('Paige', 'Turner', 6, 16),
  ('Mack', 'Aroney', 7, 9),
  ('Lois', 'Price', 8, 13);
--   --https://humorliving.com/name-puns/--
