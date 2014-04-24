var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'talk 2 Talk' });
});

/* GET users list. */
router.get('/mydb', function(req, res){
  var db = req.db;
  var collection = db.get('users');
  collection.find({}, {}, function(e, docs){
    res.render('mydb', {
      "mydb" : docs
    });
  });
});

router.get('/register', function(req, res) {
  res.render('register', { title: 'Registration Form  ' });
});

// adding new users
router.post('/register', function(req, res){
  var db = req.db;
  
  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
  var passwd = req.body.pass;
  
  var collection = db.get('users');
  
  collection.insert({
    "name" : name,
    "lastname" : lastname,
    "email" : email,
    "username" : username,
    "passwd" : passwd
  }, function(err, doc) {
    if(err){
      res.send;
    } else {
      res.location("mydb");
      res.redirect("mydb");
    }
  });
});

router.post('/login', function(req, res){
  var db = req.db;
  
  var user = req.body.user;
  var passwd = req.body.passwd;
  
  console.log("username: " + user + " pwd: " + passwd)
  
  var collection = db.get('users');
  
  var query = {};
  query['username'] = user;
  
  collection.findOne( {'username' : user, 'passwd' : passwd }, function(err, doc) {
    console.log(err);
    console.log(doc);
    if (doc === null ) {
      console.log("No such a user")
      res.location("/");
      res.redirect("/");
    } else {
      res.location("mydb");
      res.redirect("mydb");
    }
  });
  
});

module.exports = router;