//Require express, db, and instantiate the router
var express = require('express');
var router = express.Router();
const mysql = require('../dbcon.js');

//Queries for building the page and inserting into Equipment
const getAllQuery = 'SELECT * FROM `Equipment`';
const insertQuery = 'INSERT INTO `Equipment` (`equip_name`, `equip_type`, `equip_weight`, `equip_fuel_type`, `equip_purchase_date`) VALUES  (?,?,?,?,?)'

//This function selects all rows from Equipment, and renders the page with the returned data
function getAllData(res) {
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//Errors, returning
			next(err);
			return;
		}
		else {
			//Query worked, render the page
			//res.json({ rows: rows });
			let context = {};
			context = JSON.stringify(rows);

			//Pass the returned rows to the templating engine
			res.render('pages/Equipment', {
				results: rows
			});
		}
	});
};

//Responds to the add form on Equipment page
router.post('/AddEquipment', function (req, res, next) {
    //adds equipment to database
	//Decompose the request body
	var { ename, etype, eweight, ftype, edate } = req.body;

	//Check for the nullable date
	if (edate == '') {
		edate = null;
	}

	//Pass the data from the form in an insert query to the db
    mysql.query(insertQuery, [ename, etype, eweight, ftype, edate], (err, rows, fields) => {
		if (err) {
			//errors, returning
            next(err);
            return;
		}

		//Query worked, reload the page
		res.redirect('/equipment');
    });
});

//Responds to GETs to the Equipment page
router.get('/equipment', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/
	//Query the page with the getAllQuery
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//errors, returning
			next(err);
			return;
		}
		//Query worked, build the page
		getAllData(res);
	});

});

//Export the router
module.exports = router;
