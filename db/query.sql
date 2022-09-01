--link made from the id no.'s as all 3 tables have id no.'s.
SELECT employee.first_name, employee.last_name, roles.title, department.department_name, roles.salary, 
--will this give the manager's name rather than the manager_id?
employee.manager_id AS employee.first_name
--table 1
FROM department 
--table 2 first join 
INNER JOIN roles 
ON department.id = roles.department_id 
--table 3 2nd join
INNER JOIN employee 
ON roles.id = employee.role_id
ORDER BY department.id;