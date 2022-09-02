SELECT roles.id, roles.title, department.department_name, roles.salary, employee.first_name
FROM roles 
JOIN department 
ON department.id = roles.department_id 
ORDER BY department.id
LEFT JOIN employee
ON employee.role_id=roles.title;

-- SELECT employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, 
-- employee.manager_id
-- FROM employee AS E
-- INNER JOIN department  AS D
-- ON department.id = roles.department_id 
-- LEFT JOIN roles AS R 
-- ON E.id = employee.role_id;


SELECT department.id, roles.department_id, employee.role_id
FROM department
INNER JOIN roles
ON 