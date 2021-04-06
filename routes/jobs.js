//Require express, db, and instantiate the router
var express = require('express');
var router = express.Router();
const mysql = require('../dbcon.js');

//Queries for building the table and the FKs dropdown
const getAllQuery = 'SELECT `Jobs`.`job_name`, `Jobs`.`job_id`, `Jobs`.`company_id`, `Jobs`.`location`, `Companies`.`company_name` FROM `Jobs` LEFT OUTER JOIN `Companies` ON `Jobs`.`company_id` = `Companies`.`company_id`';
const getCompaniesQuery = 'SELECT * FROM `Companies`';

//Query for the add form
const insertQuery = 'INSERT INTO `Jobs` (`job_name`, `company_id`, `location`) VALUES (?,?,?)'

//This function builds the page with a SELECT call to Jobs and a call to Companies for the FK dropdown
function getAllData(res) {
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		else {
			//Query worked, store the rows and move up the chain
			//res.json({ rows: rows });
			let context = {};
			context = JSON.stringify(rows);

			//SELECT all rows from Companies
			mysql.query(getCompaniesQuery, (err, comprows, fields) => {
				if (err) {
					//Errors, returning
					next(err);
					return;
				}
				else {
					//Query worked, store the rows and render the page
					let companies = {};
					companies = JSON.stringify(comprows);

					//Pass the returned rows to the templating engine
					res.render('pages/Jobs', {
						results: rows,
						compResults: comprows
					});
				}
			});
		}
	});
};


//Responds to the Add form on Jobs
router.post('/AddJob', function (req, res, next) {
	//adds job to database
	//Decompose the request body
	var { jname, cname, jlocation } = req.body;

	//Check for nullable field
	if (cname == "") {
		cname = null;
	}

	//Pass the data from the form in an insert query to the db
    mysql.query(insertQuery, [jname, cname, jlocation], (err, rows, fields) => {
		if (err) {
			//Errors, returning
            next(err);
            return;
		}

		//Query worked, reload the page
		res.redirect('/jobs');
    });
});

//Responds to GET requests to the Jobs page
router.get('/jobs', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/
	//Query the DB, selecting all rows from Jobs
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//errors, returning
			next(err);
			return;
		}
		//Query worked, call the function to build the page
		getAllData(res);
	});

});

//Export the router
module.exports = router;
