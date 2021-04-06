//Require express, db, and instantiate the router
var express = require('express');
var router = express.Router();
const mysql = require('../dbcon.js');

//Queries for building the table and the FKs dropdowns
const getAllQuery = 'SELECT * FROM `Phase_crew`';
const getCrewsQuery = 'SELECT `crew_id`, `crew_name` FROM `Crews`;';
const getPhasesQuery = 'SELECT `phase_id`, `phase_name` FROM `Phases`;';

//Adds name field to each FK
const getNamesQuery = 'SELECT `Phase_crew`.`relation_id`, `Phase_crew`.`phase_id`, `Phases`.`phase_name`, `Phase_crew`.`crew_id`, `Crews`.`crew_name`  FROM `Phase_crew` INNER JOIN `Phases` ON `Phases`.`phase_id` = `Phase_crew`.`phase_id` INNER JOIN Crews ON `Phase_crew`.`crew_id` = `Crews`.`crew_id` ORDER BY `Phase_crew`.`relation_id`;';

//Queries for the delete button and add form
const deleteQuery = 'DELETE FROM `Phase_crew` WHERE `relation_id` = ?;';
const insertQuery = "INSERT INTO `Phase_crew` (`phase_id`, `crew_id`) VALUES(?,?);";

//This function builds the Phase_crew page table using a series of nested
//queries for assembling the dropdown menus for FKs on the add form
function getAllData(res) {

	//Variables for row return and query control flow
	let context = {};
	let pcRows;
	let crewRows;
	let phaseRows;
	let initQueryWorked = false;
	let secondQueryWorked = false;
	let errorEncountered = false;

	//SELECT all rows from Phase_crew
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
			pcRows = rows;

			//Doublecheck query success, then SELECT all rows from Crews
			if (initQueryWorked) {
				mysql.query(getCrewsQuery, (err, srows, fields) => {
					if (err) {
						//Errors, returning
						next(err);
						return;
					}
					else {
						//Query worked, store the rows and move up the chain
						secondQueryWorked = true;
						crewRows = srows;

						//Doublecheck query success, then SELECT all rows from Phases
						if (secondQueryWorked) {
							mysql.query(getPhasesQuery, (err, trows, fields) => {
								if (err) {
									//Errors, returning
									next(err);
									return;
								}
								else {
									//Query worked, pass the stored rows to the templating engine
									//and render the page
									res.render('pages/phaseCrew', {
										results: pcRows,
										pidSelections: trows,
										cidSelections: crewRows
									});

								}
							});
						}
					}
				});
			}
		}
	});
};

//Responds to GETs to Phase_crew page
router.get('/phaseCrew', function (req, res, next) {

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

		//Query worked, call the function to build the page
		getAllData(res);
	});

});

//Responds to the add form on Phase_crew page
router.post('/addPC', function (req, res, next) {

	//Decompose the request body
	var pid = Number(req.body["pid"]);
	var cid = Number(req.body["cid"]);

	//console.log("added new pc relation");
	//Pass the data from the form in an insert query to the db
	mysql.query(insertQuery, [pid, cid], (err, result) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		//console.log("no errors");
		//Query worked, call the function to build the page again
		getAllData(res);
	});
});

//Responds to the delete button on each row
router.post('/deletePC', function (req, res, next) {
	//Decompose the request body
	var rid = req.body["rid"];
	//console.log("deleting");

	//Pass the data from the form in a delete query to the database
	mysql.query(deleteQuery, [rid], (err, result) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		//console.log("no errors on delete");

		//Query worked, call the function to build the page again
		getAllData(res);
	});
});

//Export the router
module.exports = router;

