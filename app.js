/******************
 * Load required packages, mostly boilerplate
 ******************/

/* Express for route handling */
var express = require('express');
var app = express();
const session = require('express-session');
//const redis = require('redis');
//const redisStore = require('connect-redis')(session);
//const client  = redis.createClient();
/* Load EJS view engine */
app.set('view engine', 'ejs');

/* load database info, instantiate connection*/
var mysql = require('./dbcon.js');
app.set('mysql', mysql);

//Parameters for using express-session
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    //store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

/* body-parser used for parsing post requests as JSON */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Need CORS for dashboard
var CORS = require('cors');

//Options for instantiating CORS
var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "allowedHeaders": "Content-Type,Authorization"// some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Pass the specified options to CORS
app.use(CORS());
app.options('/deleteJC', CORS());

/* This allows accessing resources using '/resource' instead of '/public/resource' (CSS, Images, etc...) */
app.use(express.static(__dirname + '/public'));
app.use('/public',  express.static(__dirname + '/public'));

/******************
 * Route handling
 ******************/

/* Load in the code which processes the routing  */
var route_index = require("./routes/index.js");
var route_dashboard = require("./routes/dashboard.js");
var route_phases = require("./routes/phases.js");
var route_crews = require("./routes/crews.js");
var route_phase_crew = require("./routes/phaseCrew.js");
var route_jobs = require("./routes/jobs.js");
var route_equipment = require("./routes/equipment.js");
var route_equip_crew = require("./routes/equipCrew.js");
var route_companies = require("./routes/companies.js");

/* tell our app (express) to use the above loaded functions */
app.use(route_index);
app.use(route_dashboard);
app.use(route_phases);
app.use(route_crews);
app.use(route_phase_crew);
app.use(route_jobs);
app.use(route_equipment);
app.use(route_equip_crew);
app.use(route_companies);


/******************
 * Error pages
 ******************/

//Page not found
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//Server error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});



/******************
 * Launch communication
 ******************/
//Listen on the specified port
const port = 8080;
app.listen(port);
console.log('Server is running, CMD-C to quit.');

module.exports = app;