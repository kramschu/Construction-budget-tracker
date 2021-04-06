//This page is just used to redirect calls to the root to the dashboard
//Require express, express-session, and instantiate the router
var express = require('express');
var router = express.Router();
const session = require('express-session');

//Responds to GETs to the root route
router.get('/', function (req, res, next) {
    //Get the session attribute of the request
    sess = req.session;
    //The below was used when we were requiring login
// 	// IF ENV.LOGGEDIN == TRUE
// 	// 	res.render('pages/dashboard');
// 	// ELSE
// 	//     res.render('pages/index');		

    //Redirect to the dashboard
    res.redirect('/Dashboard');
});

//Export the router
module.exports = router;