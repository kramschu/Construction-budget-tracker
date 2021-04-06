//requirements, router instantiation
var express = require('express');
var app = express();
var CORS = require('cors');
var router = express.Router();
const mysql = require('../dbcon.js');
var bodyParser = require('body-parser');

//POST processing middleware requirements and settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: "text/plain" }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(CORS());

//SQL queries for selecting and inserting data
const insertQuery = "INSERT INTO `Crews` (`crew_name`) VALUES(?);";
const getAllQuery = 'SELECT `crew_id`, `crew_name` from `Crews`';

//Selects and returns all data from the crews table
function getAllData(res) {
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			//Pass up the error
			next(err);
			return;
		}
		else {
			//res.json({ rows: rows });
			let context = {};
			context = JSON.stringify(rows);

			//Render the page with the returned rows
			res.render('pages/Crews', {
				results: rows
			});

			//console.log("reloaded");
		}
	});
};

//Responds to GETs to the Crews page
router.get('/crews', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/
	//Pass the select query to the database
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			next(err);
			return;
		}
		//Select all data from the Crews table
		getAllData(res);
	});

});

//Receives data from the add form on Crews
router.post('/crews', function (req, res, next) {

	//Decompose the request
	var cname = req.body["name"];

	//console.log("posted");
	//Pass the insert query with the data from the request to the db
	mysql.query(insertQuery, [cname], (err, result) => {
		if (err) {
			next(err);
			return;
		}

		//console.log("no errors");
		//Reload the page with the new rows
		getAllData(res);
		
	});
});

//Export the router
module.exports = router;
