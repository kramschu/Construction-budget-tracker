//Require express and instantiate the router
var express = require('express');
var router = express.Router();

//Require dbcon and SQL queries
const getAllQuery = 'SELECT * FROM `Companies`';
const insertQuery = 'INSERT INTO `Companies` (`company_name`, `budget`,`total_expenses`,`total_revenue`,`hq_location`) VALUES (?,?,?,?,?)'
const mysql = require('../dbcon.js');

//Selects and returns all data from the companies table
function getAllData(res) {
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			next(err);
			return;
		}
		else {
			//res.json({ rows: rows });
			let context = {};
			context = JSON.stringify(rows);

			//Pass the returned rows to EJS
			res.render('pages/Companies', {
				results: rows
			});
		}
	});
};

//Receives data from the add form on Companies
router.post('/AddCompany', function (req, res, next) {
    //adds company to database
	//decompose data from the request
	var { cname, cbudget, texpenses, trevenue, hqlocation } = req.body;

	//Handle the nullable form inputs
	//These ifs collectively check for the nullable fields
	if (cbudget == '') {
		cbudget = null;
	}
	if (texpenses == '') {
		texpenses = null;
	}
	if (trevenue == '') {
		trevenue = null;
	}

    mysql.query(insertQuery, [cname, cbudget, texpenses, trevenue, hqlocation], (err, rows, fields) => {
        if (err) {
            next(err);
            return;
		}

		//reload with the new data
		res.redirect('/companies');
    });
});

//Responds to GETs to the Companies page
router.get('/companies', function (req, res, next) {

	/*
		Server processing code, e.g. DB calls, goes here
	*/
	mysql.query(getAllQuery, (err, rows, fields) => {
		if (err) {
			next(err);
			return;
		}

		//Select all data from the Companies table
		getAllData(res);
	});

});

//Export the router
module.exports = router;
