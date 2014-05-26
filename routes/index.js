var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var myfunk = require('../bin/utils.js');

/* GET home page. */
router.get('/', function(req, res) {
  if (!req.session.login) {
    res.render('index', { title: 'talk 2 Talk' });
  } else {
    res.render('welcome', { title: 'talk 2 Talk', username: req.session.user });
  }
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

router.get('/newdiscussion', function(req, res) {
  res.render('newdiscussion', { title: 'New Discussion Form' });
});

// list of newer posts
router.get('/posts', function(req, res) {
  console.log('From Index Render');
  var db = req.db;
  var postscollection = db.get('posts');
  postscollection.find({ $query: {}, $orderby: { date : -1 }}, {}, function(e, docs){
    console.log(docs);
    res.render('posts', { data: docs, title: 'Posts view' });    
  });
});

// newpost form
router.get('/newpost', function(req, res) {
  if (!req.session.login) {
    console.log("login non effettuato!")
    res.location("/");
    res.redirect("/");
  } else {
    var db = req.db;
    var categories = db.get('categories');
    
    // get the pointer to the mongo db query result
    // var test = categories.find();
    // console.log(test);
    
    categories.find( {}, {}, function(e, docs){
      res.render('newpost', {
        cats: docs,
        title: 'New Post Window',
        fs: {
          newDiscussion:function newDiscussion(selopt){
            if (selopt=='new') {
              //code
              // window.alert('Create New Discussion!');
              var newdisc = window.prompt('Create New Discussion!','defaultText');
              if (newdisc!=null) {
                window.alert(newdisc);
              }
            }
          }
        }
      });
    });
  }
});

// show single post
router.get('/post/:poid', function(req, res) {
  var poid = req.params.poid;
  console.log(poid);
  var db = req.db;
  var collection = db.get('posts');
  
  collection.findOne({'_id' : poid }, function(e, docs){
    console.log(docs);
    res.render('post', { post: docs, title: 'Single Post View'})
  })
});

// adding new users
router.post('/register', function(req, res){
  var db = req.db;
  
  var name = req.body.name;
  var lastname = req.body.lastname;
  var email = req.body.email;
  var username = req.body.username;
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
      req.session.user = user;
      req.session.login = true;
      res.location('welcome');
      res.render('welcome', { username: user });
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
  console.log(req.session.user);

  postscollection.insert({
    "title" : req.body.posttitle,
    "content" : req.body.postcontent,
    "date" : pdate,
    "author" : req.session.user,
    "category" : req.body.category
    }, function(err, doc){
      if(err){
        res.send;
      } else {
        res.location("posts");
        res.redirect("posts");
      }
  });
});

console.log('Show this text trough a function: ' + myfunk.logger('ciao'))

module.exports = router;
