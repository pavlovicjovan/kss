var express = require('express');
var router = express.Router();
const mysql = require('mysql');


router.get('/', function(req, res, next) { 
	res.render('index');
});
var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "ks-projekat"
	});

	con.connect(function(err) {
	  if (err) throw err;
	});
router.post('/login', function(req, res, next) {

    var studentName = req.body.studentName;
    

	  con.query("SELECT name FROM students WHERE name = '"+studentName+"'", function (error, result) {
	  if (error) throw error;

	  if(result.length < 1)
		{
			console.log('student po tom imenu ne postoji');
			res.redirect('/');
		}
		else
		{
			req.session.student = studentName;
			res.redirect('/dashboard');
		}
	  });
	
});

router.get('/dashboard', function(req, res, next) {
	if(!req.session.student)
	{
		console.log("nisi ulogovan zato nemas pristup ovoj strani");
		res.redirect('/');
	}
	else
	{
		console.log('logged in ');

	   		con.query("SELECT id, number, subject FROM exercises ORDER BY subject", function (error, result) 
	   		{
	    		if (error) throw error;
	    		res.render('dashboard', {exercises: result});
				console.log('logged in as student');

			});
	}
});
router.get('/exercises/:id', function (req, res) {
  var id = req.params.id;
  if(!req.session.student)
	{
		console.log("nisi ulogovan zato nemas pristup ovoj strani");
		res.redirect('/');
	}
	else
	{

	   		con.query("SELECT text FROM exercises WHERE id='"+id+"'", function (error, result) 
	   		{
	    		if (error) throw error;
	    		res.render('exercise', {text: result[0].text});

			});
	}
});
router.post('/prof-login', function(req, res, next) {
  
        var profName =  req.body.profName;
        var password =  req.body.password;
       

	  con.query("SELECT name, password FROM professors WHERE name = '"+profName+"' AND password = '"+password+"'", function (error, result) {
	  if (error) throw error;

	  if(result.length < 1)
		{
			console.log('professor po tom imenu ne postoji');
			res.redirect('/');
		}
		else
		{
			req.session.prof = profName;
			res.redirect('/prof-dashboard');
		}
	  });
	
});
router.get('/prof-dashboard', function(req, res, next) {
	if(!req.session.prof)
	{
		console.log("nisi ulogovan zato nemas pristup ovoj strani");
		res.redirect('/');
	}
	else
	{

	   		con.query("SELECT id, number, text, subject FROM exercises ORDER BY subject", function (error, result) 
	   		{
	    		if (error) throw error;
	    		res.render('prof-dashboard', {exercises: result});
				console.log('logged in as professor');

			});
	}
});
router.get('/update/:id', function(req, res, next) {
	var id = req.params.id;
	  if(!req.session.prof)
		{
			console.log("nisi ulogovan zato nemas pristup ovoj strani");
			res.redirect('/');
		}
		else
		{

		   	con.query("SELECT text FROM exercises WHERE id='"+id+"'", function (error, result) 
		   	{
		    	if (error) throw error;
		    	res.render('update', {text: result[0].text, id:id});

			});
		}
});
router.post('/update', function(req, res, next) {
	var text = req.body.exerciseText;
	var id = req.body.exerciseId;
	console.log(id);
	var sql = "UPDATE exercises SET text = '"+text+"' WHERE id = '"+id+"'";
	con.query(sql, function (err, result) {
	    if (err) throw err;
	    console.log("ok izmena");
	  });
	res.redirect('/prof-dashboard');
});
router.get('/prof-logout', function (req, res, next) {
		delete req.session.prof;
		res.redirect('/');
});
router.get('/logout', function (req, res, next) {
		delete req.session.student;
		res.redirect('/');
});
module.exports = router;
