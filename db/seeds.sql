INSERT INTO department(name)
VALUES
('Sales'),
('Engineering'),
('Finance'),
('Legal');

INSERT INTO role(title, salary, department_id)
VALUES
('Sales Lead', 50000, 1),
('Salesperson', 40000, 1),
('Lead Engineer', 100000, 2),
('Software Engineer', 90000, 2),
('Account Manager', 110000, 3),
('Accountant', 100000, 3),
('Legal Team Lead', 150000, 4),
('Lawyer', 125000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
('Leon', 'Black', 1, NULL),
('Ceres', 'Fauna', 2, 1),
('Susie', 'Greene', 3, NULL),
('Richard', 'Lewis', 4, 3),
('Christopher', 'Moltisanti', 5, NULL),
('Elizabeth', 'Rose', 6, 5),
('Gigi', 'Murin', 7, NULL),
('Anthony', 'Blundetto', 8, 7);