/*Code tutorial followed from ExpressJS Crash Course by Traversy Media on
Youtube*/

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path'); //built in
var expressValidator = require('express-validator'); //no longer requires Middleware
var mongojs = require('mongojs');
var db = mongojs('customerapp', ['users']);
var ObjectId = mongojs.ObjectId;
var app = express();

// View Engine Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')))
app.use(expressValidator());﻿ //instead of middleware just need this in v4

//Global Vars
app.use(function(req, res, next){
    res.locals.errors = null;
    next();
});

app.get('/', function(req, res){
    // find everything
    db.users.find(function (err, docs) {
	console.log(docs);
    res.render('index', {
        title: 'Customers',
        users: docs //now coming from database instead of the users array we deleted
    });
    })

});

app.post('/users/add', function(req,res){

    //set rules for fields with expressValidator
    req.checkBody('first_name', 'First Name is Required').notEmpty();
    req.checkBody('last_name', 'Last Name is Required').notEmpty();
    req.checkBody('email', 'Email is Required').notEmpty();

    var errors = req.validationErrors();

    if (errors){
        // find everything
        db.users.find(function (err, docs) {
    	//console.log(docs);
        res.render('index', {
            title: 'Customers',
            users: docs, //now coming from database instead of the users array we deleted
            errors: errors
        });
        })

    }
    else {
        var newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
    }
    db.users.insert(newUser, function(err, result){
        if(err){
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
    }
});

app.delete('/users/delete/:id', function(req, res){
    db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
        if(err){
            console.log(err);
        }
        else {
            res.redirect('/');
        }
    });
});

app.listen(3000,function(){
    console.log('Server started on Port 3000...');
})
