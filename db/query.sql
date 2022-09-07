SELECT employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, employee.manager_id
FROM department
INNER JOIN roles
ON department.id=roles.department_id
INNER JOIN employee
ON roles.id=employee.role_id
ORDER BY department.id;

