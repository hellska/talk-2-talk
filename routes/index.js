var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');

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

/* GET loginRetry page when login info are incorrect */
router.get('/loginRetry', function(req, res) {
  res.render('loginRetry', { title: 'Login Page' });
});

/* Render registration form on button pressure */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Registration Form' });
});

// list of newer posts
router.get('/posts', function(req, res) {
  console.log('From Index Render');
  var db = req.db;
  var postscollection = db.get('posts');
  postscollection.find({}, {}, function(e, docs){
    console.log(docs);
    res.render('posts', { data: docs, title: 'Posts view' });    
  });
});

// newpost form
router.get('/newpost', function(req, res) {
  res.render('newpost', { title: 'New Post Window' });
});

// adding new users
router.post('/register', function(req, res){
  var db = req.db;
  
  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
//  var passwd = req.body.pass;
  var passwd = bcrypt.hashSync(req.body.pass);
  
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

/* controllo username and pwd to login */
router.post('/login', function(req, res){
  var db = req.db;
  
  var user = req.body.user;
  var passwd = req.body.passwd;
  
  console.log("username: " + user + " pwd: " + passwd)
  
  var collection = db.get('users');
  
  var query = {};
  query['username'] = user;
  
  collection.findOne( {'username' : user }, function(err, doc) {
    console.log(err);
    if (doc === null ) {
      console.log("No such a user")
      res.location("loginRetry");
      res.redirect("loginRetry");
    } else {
      console.log(doc);
      pwdIsCorrect = bcrypt.compareSync(passwd, doc.passwd)
//      res.location("welcome");
      res.render('welcome', { welcome: doc });
    }
  });
});

/* insert a new post in db */
router.post('/newpost', function(req, res){
  console.log('write in db ' + req.body.posttitle + ", " + req.body.postcontent);

  var db = req.db;
  var postscollection = db.get('posts');
  var now = new Date();
  var pdate = now.toJSON();
  console.log(pdate);

  postscollection.insert({
    "title" : req.body.posttitle,
    "content" : req.body.postcontent,
    "date" : pdate
    }, function(err, doc){
      if(err){
        res.send;
      } else {
        res.location("posts");
        res.redirect("posts");
      }
  });
});

module.exports = router;
