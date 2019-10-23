var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
var ejs = require('ejs');
var app = express(); //Express useful in web development, such as sessions and handling HTTP requests
var port = 8080;
var {getHomePage} = require('./routes/product.js')


var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'root',
	database: 'shopping_cart'
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

global.db = connection;

// configure middleware
app.set('port', process.env.port || port)// set express to use this port
app.set('views', __dirname + '/views') // set express to look in this folder to render our view
app.set('view engine', 'ejs'); // configure template engine
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname+ '/login.html'));
});

app.post('/auth', function(req, res){
	var username = req.body.username;
	var password = req.body.password;
	if (username && password){
		db.query('select * from accounts where username = ? and password = ?', [username, password], function(error, results, fields){
			if(results.length > 0){
				req.session.loggedin = true;
				req.session.username = username;
				res.redirect('/product');
			}else{
				res.send('Incorrect username and/or password');
			}
			res.end();
		});
	}else{
		res.send('please enter username and password');
		res.end();
	}
});

app.get('/product', getHomePage); //list all avalibale products

app.post('/add_to_cart', function(req, res){ //generates the list of products in the cart
	console.log(req.uri);
});

app.get('add_to_cart', function(req, res){

});

// set the app to listen on the port
app.listen(port, () =>{
	console.log('Server is running on port:' + port);
});

module.exports = app