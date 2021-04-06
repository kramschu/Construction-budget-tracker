//Require express, db, and instantiate the router
var express = require('express');
var router = express.Router();
const mysql = require('../dbcon.js');

//Parameterized queries for building the dashboard
//Build the lists in the dropdown menus for equip/job/crew/phase ID
const getEquipQuery = 'SELECT `equip_id`, `equip_name`, `equip_type`, `equip_weight`, `equip_fuel_type`, `equip_purchase_date` FROM `Equipment`';
const getJobsQuery = 'SELECT `job_id`, `job_name` FROM `Jobs`';
const getCrewsQuery = 'SELECT `crew_id`, `crew_name` FROM `Crews`;';
const getPhasesQuery = 'SELECT `phase_id`, `phase_name` FROM `Phases`;';
const getAllQuery = 'SELECT * FROM `Job_cost`';

//Select all rows but fix the date
const getJCQuery = 'SELECT `job_cost_id`,  CAST(CONVERT(`date_time`, DATE) AS VARCHAR(10)) AS `caldate`, CONVERT(`date_time`, time) AS `time`, `equip_id`, `job_id`, `crew_id`, `phase_id`, `cost_type`, `hours`, `rate` FROM `Job_cost`;';

//Queries for the delete/add/update functionality on dashboard
const deleteQuery = 'DELETE FROM `Job_cost` WHERE `job_cost_id` = ?;';
const insertQuery = "INSERT INTO `Phase_crew` (`phase_id`, `crew_id`) VALUES(?,?);";
const insertJobCostQuery = 'INSERT INTO `Job_cost` (`date_time`, `equip_id`, `job_id`, crew_id, phase_id, cost_type, hours, rate) VALUES (?,?,?,?,?,?,?,?)'
const updateQuery = 'UPDATE `Job_cost` SET `date_time` = ?, `equip_id` = ?, `job_id` = ?, `crew_id` = ?, `phase_id` = ?, `cost_type` = ?, `hours` = ?, `rate` = ? WHERE `job_cost_id` = ?;';

//This function builds the main dashboard table using a series of nested
//queries for building the dropdown menus for equip/job/crew/phase FKs
function getAllData(res) {

	//Variables for row return and query control flow
	let context = {};
	let eRows;
	let jRows;
	let cRows;
	let pRows;
	let initQueryWorked = false;
	let secondQueryWorked = false;
	let thirdQueryWorked = false;
	let fourthQueryWorked = false;
	let errorEncountered = false;

	//SELECT all rows from Job_cost
	mysql.query(getJCQuery, (err, rows, fields) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		else {

			//Query worked, store rows and move up the chain
			//res.json({ rows: rows });
			let context = {};
			context = JSON.stringify(rows);
			initQueryWorked = true;
			jc = rows;

			//SELECT all rows from Equipment, doublechecking query success
			if (initQueryWorked) {
				mysql.query(getEquipQuery, (err, erows, fields) => {
					if (err) {
						//Errors, returning
						next(err);
						return;
					}
					else {

						//Query worked, store rows and move up the chain
						secondQueryWorked = true;
						eRows = erows;

						//Doublecheck query success, then SELECT all rows from Jobs
						if (secondQueryWorked) {
							mysql.query(getJobsQuery, (err, jrows, fields) => {
								if (err) {
									//errors, returning
									return;
								}
								else {

									//Query worked, store rows and move up the chain
									thirdQueryWorked = true;
									jRows = jrows;

									//Doublecheck query success, then SELECT all rows from Crews
									if (thirdQueryWorked) {
										mysql.query(getCrewsQuery, (err, crows, fields) => {
											if (err) {
												//Errors, returning
												console.log(err)
												return;
											}
											else {
												//Query worked, store rows and move up the chain
												fourthQueryWorked = true;
												cRows = crows;
												console.log(cRows);

												//Doublecheck query success, then SELECT all rows from Phases
												if (fourthQueryWorked) {
													mysql.query(getPhasesQuery, (err, prows, fields) => {
														if (err) {
															//Errors, returning
															next(err);
															return;
														}
														else {
															//Query worked, store rows and render the page
															pRows = prows;

															//Pass the rows to the templating engine
															res.render('pages/dashboard', {
																results: jc,
																eidSelections: eRows,
																jidSelections: jRows,
																cidSelections: cRows,
																pidSelections: pRows,
															});
														}
													});
												}
											}
										});
									}
								}
							});
						}
					}
				});
			}
		}
	});
}

//Receives data from the filter form above the main rows
router.post('/filterDashboardForm', function (req, res, next) {

	//Start stub of the query, decompose the request body
	var filterQuery = 'SELECT `job_cost_id`,  CAST(CONVERT(`date_time`, DATE) AS VARCHAR(10)) AS `caldate`, CONVERT(`date_time`, time) AS `time`, `equip_id`, `job_id`, `crew_id`, `phase_id`, `cost_type`, `hours`, `rate` FROM `Job_cost` WHERE date_time != 0';
	var { dtime2, eid2, jid2, cid2, pid2, ct2, hours2, rate2 } = req.body;

	//Each of these ifs will add to the query if the relevant fields are nonblank and nonnull
	if (dtime2 !== '') {
		filterQuery = filterQuery + ' AND date_time >= ' + '"' + dtime2[0] + dtime2[1] + dtime2[2] + dtime2[3] + '-' + dtime2[5] + dtime2[6] + '-' + dtime2[8] + dtime2[9] + ' ' + dtime2[11] + dtime2[12] + ':' + dtime2[14] + dtime2[15] + ':00' + '"';
	}
	if (eid2 !== '' && eid2 !== 'NULL') {
		filterQuery = filterQuery + ' AND equip_id = ' + eid2;
	}
	if (jid2 !== '' && jid2 !== 'NULL') {
		filterQuery = filterQuery + ' AND job_id = ' + jid2;
	}
	if (cid2 !== '' && cid2 !== 'NULL') {
		filterQuery = filterQuery + ' AND crew_id = ' + cid2;
	}
	if (pid2 !== '' && pid2 !== 'NULL') {
		filterQuery = filterQuery + ' AND phase_id = ' + pid2;
	}
	if (ct2 !== '') {
		filterQuery = filterQuery + ' AND `cost_type` = "' + ct2 + '"';
	}
	if (hours2 !== '') {
		filterQuery = filterQuery + ' AND hours = ' + hours2;
	}
	if (rate2 !== '') {
		filterQuery = filterQuery + ' AND rate = ' + rate2;
	}

	//Check for the nullable FKs
	if (eid2 == 'NULL') {
		eid2 = null;
		filterQuery = filterQuery + ' AND equip_id IS NULL';
	}
	if (jid2 == 'NULL') {
		jid2 = null;
		filterQuery = filterQuery + ' AND job_id IS NULL';
	}
	if (cid2 == 'NULL') {
		cid2 = null;
		filterQuery = filterQuery + ' AND crew_id IS NULL';
	}
	if (pid2 == 'NULL') {
		pid2 = null;
		filterQuery = filterQuery + ' AND phase_id IS NULL';
	}

	//Terminal semicolon
	filterQuery = filterQuery + ';';

	//Query is built, pass to the DB
	query = mysql.query(filterQuery, (err, frows, fields) => {
		if (err) {
			//Errors, returning
            next(err);
            return;
		}

		//Query worked, store filtered rows and move up the chain to build the dashboard table again
		let context = {};
		context = JSON.stringify(frows);

		//SELECT from Equipment
		mysql.query(getEquipQuery, (err, erows, fields) => {
				if (err) {
					//Errors, returning
					next(err);
					return;
				}
				else {
					//Query worked, store rows and move up the chain
					secondQueryWorked = true;
					eRows = erows;

					//Doublecheck query success, then SELECT from Jobs
					if (secondQueryWorked) {
						mysql.query(getJobsQuery, (err, jrows, fields) => {
							if (err) {
								//Errors, returning
								next(err);
								return;
							}
							else {
								//Query worked, store rows and move up the chain
								thirdQueryWorked = true;
								jRows = jrows;

								//Doublecheck query success, then SELECT from Crews
								if (thirdQueryWorked) {
									mysql.query(getCrewsQuery, (err, crows, fields) => {
										if (err) {
											//Errors, returning
											next(err);
											return;
										}
										else {
											//Query worked, store rows and move up the chain
											fourthQueryWorked = true;
											cRows = crows;

											//Doublecheck query success, then SELECT from Phases
											if (fourthQueryWorked) {
												mysql.query(getPhasesQuery, (err, prows, fields) => {
													if (err) {
														//Errors, returning
														next(err);
														return;
													}
													else {
														//Query worked, store rows and render the page
														pRows = prows;

														//Pass the stored rows to the templating engine
														res.render('pages/dashboard', {
															results: frows,
															eidSelections: eRows,
															jidSelections: jRows,
															cidSelections: cRows,
															pidSelections: pRows,
														});
													}
												});
											}
										}
									});
								}
							}
						});
					}
				}
			});
		});
});

//Responds to the Reset Filters button to reset the dashboard
router.post('/resetDashboardForm', function (req, res, next) {
	res.redirect('/dashboard');
});

//Responds to GETs to the dashboard
router.get('/dashboard', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/

	//Query the database with the dashboard-building query
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {

			//Errors, returning
			next(err);
			return;
		}

		//Call the dashboard-building function
		getAllData(res);
	});

});

//Responds to the delete button on each row
router.post('/deleteJC', function (req, res, next) {

	//Decompose the request body
	var { jcid } = req.body;
	//console.log("deleting jcid:", jcid);

	//Query the DB and pass in the job_cost_id from the row
	mysql.query(deleteQuery, [jcid], (err, result) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		//console.log("nope errors on delete");

		//Call the dashboard-building function
		getAllData(res);
	});
});

//Responds to the Update button on an enabled row
router.post('/jcUpdate', function (req, res, next) {

	//Decompose the request body
	var { time, eid, jid, cid, pid, ct, hours, rt, jcid } = req.body;
	//console.log("updating jcid:", jcid);

	//These ifs collectively check for the nullable FKS
	if (eid == 'NULL') {
		eid = null;
	}
	if (jid == 'NULL') {
		jid = null;
	}
	if (cid == 'NULL') {
		cid = null;
	}
	if (pid == 'NULL') {
		pid = null;
	}

	//Query the DB with the data from the form
	mysql.query(updateQuery, [time, eid, jid, cid, pid, ct, hours, rt, jcid], (err, result) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}

		//Query worked, build the page again
		console.log("nope errors on update");
		getAllData(res);
	});
});

//Responds to the add form at the bottom of the page
router.post('/AddJobCost', function (req, res, next) {
	//adds jobCost to database
	//Decompose the request body
	var { dtime, eid4, jid4, cid4, pid4, ct, hours, rate } = req.body;

	//These ifs collectively check for the nullable FKS
	if (eid4 == 'NULL') {
		eid4 = null;
	}
	if (jid4 == 'NULL') {
		jid4 = null;
	}
	if (cid4 == 'NULL') {
		cid4 = null;
	}
	if (pid4 == 'NULL') {
		pid4 = null;
	}

	//Query the DB with the data from the form
    mysql.query(insertJobCostQuery, [dtime, eid4, jid4, cid4, pid4, ct, hours, rate], (err, rows, fields) => {
		if (err) {
			//Errors, returning
            next(err);
            return;
		}
		//Query worked, build the page again
		res.redirect('/dashboard');
    });
});

//Export the router
module.exports = router;
