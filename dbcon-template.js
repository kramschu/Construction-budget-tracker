/*
	This is a template file

	Replace the fields with the required values, rename the file to 'dbcon.js'
	for proper database access
*/


var mysql = require('mysql');

var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'HOST URL',
    user            : 'DATABASE USERNAME',
    password        : 'DATABASE PASSWORD',
    database        : 'DATABASE NAME'
});

module.exports.pool = pool;