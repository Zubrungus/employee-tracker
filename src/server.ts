import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connections.js';

await connectToDb();

function mainMenu(){
    //Prompt for main menu with list of functions
    inquirer.prompt([{
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Exit program'],
    },])
        //Does appropriate function depending on choice made
        .then((answer) => {
            if (answer.choice === 'View all departments') {
                pool.query('SELECT name AS Department_name, department.id AS Department_ID FROM department;', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (result) {
                        console.table(result.rows);
                        mainMenu();
                    }
                });
            } else if (answer.choice === 'View all roles') {
                pool.query('SELECT title AS Job_title, role.id AS Role_ID, name AS Department, salary FROM role JOIN department ON department_id = department.id;', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (result) {
                        console.table(result.rows);
                        mainMenu();
                    }
                });
            } else if (answer.choice === 'View all employees') {
                pool.query('SELECT employee.id AS Employee_ID, first_name, last_name, title AS Job_title, name AS Department, salary, manager_id FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id;', (err: Error, result: QueryResult) => {
                    if (err) {
                        console.error(err);
                    } else if (result) {
                        console.table(result.rows);
                        mainMenu();
                    }
                });
            } else if (answer.choice === 'Add a department') {
                addDepartment();
            } else if (answer.choice === 'Add a role') {
                addRole();
            } else if (answer.choice === 'Add an employee') {
                addEmployee();
            } else if (answer.choice === 'Update an employee role') {
                listIDs();
            } else if (answer.choice === 'Exit program') {
                pool.end();
                process.exit(0);
            }
            
        });
}

function addDepartment() {
    //Prompts for name of new department then adds new department to department table
    inquirer.prompt([{
        type: 'input',
        message: 'Input name of new department',
        name: 'department',
    },])
    .then((answer) => {
        pool.query(`INSERT INTO department(name) VALUES ('${answer.department}');`, (err: Error, result: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log(`New department "${answer.department}" added`);
                mainMenu();
            }
        });
    })

}

function addRole() {
    //Prompts for details of new role then adds new role to role table
    inquirer.prompt([{
        type: 'input',
        message: 'Input title of new role',
        name: 'title',
    },
    {
        type: 'input',
        message: 'Input salary of new role',
        name: 'salary',
    },
    {
        type: 'input',
        message: 'Input department ID of new role',
        name: 'departmentID',
    },])
    .then((answer) => {
        pool.query(`INSERT INTO role(title, salary, department_id) VALUES ('${answer.title}', ${answer.salary}, ${answer.departmentID});`, (err: Error, result: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log(`New role "${answer.title}" added`);
                mainMenu();
            }
        });
    })
}

function addEmployee() {
    //Prompts for details of new employee then adds new employee to employee table
    inquirer.prompt([{
        type: 'input',
        message: 'Input first name of new employee',
        name: 'firstName',
    },
    {
        type: 'input',
        message: 'Input last name of new employee',
        name: 'lastName',
    },
    {
        type: 'input',
        message: 'Input role ID of new employee',
        name: 'roleID',
    },
    {
        type: 'input',
        message: 'Input manager ID of new employee',
        name: 'managerID',
    },])
    .then((answer) => {
        pool.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ('${answer.firstName}', '${answer.lastName}', ${answer.roleID}, ${answer.managerID});`, (err: Error, result: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log(`New employee "${answer.firstName} ${answer.lastName}" added`);
                mainMenu();
            }
        });
    })
}

function listIDs(){
    //List tables of employees and roles
    pool.query('SELECT employee.id AS Employee_ID, first_name, last_name, title AS Job_title, name AS Department, salary, manager_id FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id;', (err: Error, result: QueryResult) => {
        if (err) {
            console.error(err);
        } else if (result) {
            console.table(result.rows);
        }
    });
    pool.query('SELECT title AS Job_title, role.id AS Role_ID, name AS Department, salary FROM role JOIN department ON department_id = department.id;', (err: Error, result: QueryResult) => {
        if (err) {
            console.error(err);
        } else if (result) {
            console.table(result.rows);
            updateEmployeeRole();
        }
    });
}

function updateEmployeeRole() {
    //After listing needed IDs, prompts for wanted IDs
    inquirer.prompt([{
        type: 'input',
        message: 'Input employee ID',
        name: 'employeeID',
    },
    {
        type: 'input',
        message: 'Input ID of new role',
        name: 'roleID',
    },])
    .then((answer) => {
        pool.query(`UPDATE employee SET role_id = ${answer.roleID} WHERE id = ${answer.employeeID};`, (err: Error, result: QueryResult) => {
            if (err) {
                console.error(err);
            } else if (result) {
                console.log(`Role updated`);
                mainMenu();
            }
        });
    })
}

//Initiates main loop
mainMenu();