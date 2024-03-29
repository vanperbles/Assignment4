var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json


mongoose.connect(database.url);

var Employee = require('./models/employee');
 
 
// //get all employee data from db
// app.get('/api/employees', function(req, res) {
// 	// use mongoose to get all todos in the database
// 	Employee.find(function(err, employees) {
// 		// if there is an error retrieving, send the error otherwise send data
// 		if (err)
// 			res.send(err)
// 		res.json(employees); // return all employees in JSON format
// 	});
// });

app.get('/api/employees', function(req, res) {
    // Use a promise to retrieve all employee data from the database
    Employee.find()
        .then(employees => {
            // Send the data as a JSON response
            res.json(employees);
        })
        .catch(err => {
            // If there's an error retrieving data, send the error response
            res.status(500).send(err.message);
        });
});

// get a employee with ID of 1
// app.get('/api/employees/:employee_id', function(req, res) {
// 	let id = req.params.employee_id;
// 	Employee.findById(id, function(err, employee) {
// 		if (err)
// 			res.send(err)
 
// 		res.json(employee);
// 	});
 
// });

app.get('/api/employees/:employee_id', function(req, res) {
    let id = req.params.employee_id;
    // Use a promise to find an employee by ID
    Employee.findById(id)
        .then(employee => {
            // If the employee is found, send it as a JSON response
            res.json(employee);
        })
        .catch(err => {
            // If there's an error or the employee is not found, send an error response
            res.status(404).send('Employee not found');
        });
});



// create employee and send back all employees after creation
// app.post('/api/employees', function(req, res) {

//     // create mongose method to create a new record into collection
//     console.log(req.body);

// 	Employee.create({
// 		name : req.body.name,
// 		salary : req.body.salary,
// 		age : req.body.age
// 	}, function(err, employee) {
// 		if (err)
// 			res.send(err);
 
// 		// get and return all the employees after newly created employe record
// 		Employee.find(function(err, employees) {
// 			if (err)
// 				res.send(err)
// 			res.json(employees);
// 		});
// 	});
 
// });


app.post('/api/employees', async function(req, res) {
    try {
        console.log(req.body);

        // Create a new employee record
        const employee = await Employee.create({
            name: req.body.name,
            salary: req.body.salary,
            age: req.body.age
        });

        // Get all employees after creating the new record
        const employees = await Employee.find();

        // Send the list of all employees as a response
        res.json(employees);
    } catch (err) {
        // Handle errors
        res.status(500).send(err.message);
    }
});



// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function(req, res) {
    // Extract data from request body
    const { name, salary, age } = req.body;
    // Extract employee ID from request parameters
    const employeeId = req.params.employee_id;

    // Prepare data to update
    const updateData = {
        name: name,
        salary: salary,
        age: age
    };

    // Update the employee using findByIdAndUpdate
    Employee.findByIdAndUpdate(employeeId, updateData).exec()
        .then(updatedEmployee => {
            if (!updatedEmployee) {
                // If no employee found with the provided ID, send a 404 response
                return res.status(404).send('Employee not found');
            }
            // If employee is successfully updated, send a success response
            res.send(`Successfully updated employee: ${updatedEmployee.name}`);
        })
        .catch(err => {
            // If an error occurs, send a 500 response with the error message
            res.status(500).send(err.message);
        });
});


// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});

app.listen(port);
console.log("App listening on port : " + port);
