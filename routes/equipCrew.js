//Require express and instantiate the router
var express = require('express');
var router = express.Router();

//Require dbcon and SQL queries for building the table
const mysql = require('../dbcon.js');
const getAllQuery = 'SELECT `Equip_crew`.`relation_id`, `Equip_crew`.`equip_id`, `Equipment`.`equip_name`, `Equip_crew`.`crew_id`, `Crews`.`crew_name`  FROM `Equip_crew` INNER JOIN `Equipment` ON `Equipment`.`equip_id` = `Equip_crew`.`equip_id` INNER JOIN Crews ON `Equip_crew`.`crew_id` = `Crews`.`crew_id` ORDER BY `Equip_crew`.`relation_id`';
const getEquipmentQuery = 'SELECT * FROM `Equipment`';
const getCrewsQuery = 'SELECT * FROM `Crews`';

//Queries for the add form and the delete buttons
const insertQuery = 'INSERT INTO `Equip_crew` (`equip_id`, `crew_id`) VALUES (?,?)'
const deleteQuery = 'DELETE FROM Equip_crew WHERE relation_id = ?'

//This function builds the page with a series of nested queries that construct the data for the FK dropdowns
function getAllData(res) {

	//SELECT all rows from Equip_crew
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		else {
			//res.json({ rows: rows });
			//Query worked, store rows and move up the chain
			let context = {};
			context = JSON.stringify(rows);

			//SELECT from Equipment
			mysql.query(getEquipmentQuery, (err, equiprows, fields) => {
				if (err) {
					//Errors, returning
					next(err);
					return;
				}
				else {
					//Query worked, store rows and move up the chain
					let Equipment = {};
					Equipment = JSON.stringify(equiprows);

					//SELECT from Crews
					mysql.query(getCrewsQuery, (err, crewrows, fields) => {
						if (err) {
							//Errors, returning
							next(err);
							return;
						}
						else {
							//Query worked, store rows and render the page
							let Crews = {};
							Crews = JSON.stringify(crewrows);

							//Pass the stored rows to the templating engine
							res.render('pages/equipCrew', {
								results: rows,
								equipResults: equiprows,
								crewResults: crewrows
							});
						}
					});
				}
			});
		}
	});
};

//Responds to the Equip_crew add form
router.post('/AddEquipCrew', function (req, res, next) {
    //adds relationship to database
	//Decompose the request body
	var { eid, cid } = req.body;

	//Pass the data from the form into an insert query to the DB
    mysql.query(insertQuery, [eid, cid], (err, rows, fields) => {
		if (err) {
			//Errors, returning
            next(err);
            return;
		}

		//Query worked, reload the page
		res.redirect('/equipCrew');
    });
});

//responds to the delete button on each row
router.post('/deleteEquipCrew', function (req, res, next) {
    //deletes equipCrew from database
	//decompose the request body
	var { rid } = req.body;

	//Pass the data from the form into a delete query to the DB
    mysql.query(deleteQuery, [rid], (err, rows, fields) => {
		if (err) {
			//Errors, returning
            next(err);
            return;
		}
		//Query worked, reload the page
		res.redirect('/equipCrew');
    });
});

//Responds to GETs to Equip_crew page
router.get('/equipCrew', function (req, res, next) {

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

		//Query worked, build the page
		getAllData(res);
	});

});

//Export the router
module.exports = router;
