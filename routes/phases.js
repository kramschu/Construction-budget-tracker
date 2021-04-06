//Require express, db, and instantiate the router
var express = require('express');
var router = express.Router();
const mysql = require('../dbcon.js');

//Queries for SELECTing from Phases and building the Job_id FK dropdown
const getAllQuery = 'SELECT * FROM `Phases`';
const getJobsQuery = 'SELECT `job_id`, `job_name`, `company_id`, `location` FROM `Jobs`;';
//const getPhasesQuery = 'SELECT `Phases`.`phase_id`, `Phases`.`phase_name` FROM `Phases`;';

//Adds Job_name to the table columns
const getNamesQuery = 'SELECT `Phases`.`phase_id`, `Phases`.`phase_name`, `Phases`.`job_id`, `Jobs`.`job_name` FROM `Phases` LEFT OUTER JOIN `Jobs` ON `Phases`.`job_id` = `Jobs`.`job_id`;';
//const deleteQuery = 'DELETE FROM `Phase_crew` WHERE `relation_id` = ?;';

//Used by the add form
const insertQuery = "INSERT INTO `Phases` (`phase_name`, `job_id`) VALUES(?,?);";

//This function builds the Phases page table using a series of nested
//queries for assembling the dropdown menus for FK on the add form
function getAllData(res) {

	//Variables for row return and query control flow
	let context = {};
	let jobRows;
	let phaseRows;
	let initQueryWorked = false;
	let secondQueryWorked = false;
	let errorEncountered = false;

	//SELECT all rows from Phases
	mysql.query(getNamesQuery, (err, rows, fields) => {
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
			initQueryWorked = true;
			phaseRows = rows;

			//Doublecheck query success, then SELECT all rows from Jobs
			if (initQueryWorked) {
				mysql.query(getJobsQuery, (err, jobRows, fields) => {
					if (err) {
						//Errors, returning
						next(err);
						return;
					}
					else {
						//Query worked, render the page with the returned rows
						res.render('pages/Phases', {
							results: phaseRows,
							jidSelections: jobRows
						});

					}
				});
			}
		}
	});
};

//Responds to GETs to the Phases page
router.get('/Phases', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/
	//Query the DB with the getAllQuery
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}

		//Query worked, call the function to build the page again
		getAllData(res);
	});

});

//Responds to the add form on Phases page
router.post('/Phases', function (req, res, next) {
	//Decompose the request body
	var pname = req.body["pName"];
	var jid = Number(req.body["jidVal"]);

	//Check for nullable FK
	if (req.body["jidVal"] == "") {
		jid = null;
		console.log("job id was null");
	}

	//console.log("added new phase");

	//Pass the data from the add form in an insert query to the db
	mysql.query(insertQuery, [pname, jid], (err, result) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}

		//Query worked, call the function to build the page
		//console.log("no errors");
		getAllData(res);
	});
});

//Export the router
module.exports = router;
