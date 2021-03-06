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

/* GET - create a new discussion redirection */
router.get('/newDiscussion', function(req, res) {
  res.render('newDiscussion', { title: 'New Discussion Form' });
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
  postscollection.find({ $query: {}, $orderby: { date : -1 }}, {}, function(e, docs){
    console.log(docs);
    res.render('posts', { data: docs, title: 'Posts view' });    
  });
});

// funzione per leggere dati da piu' tabelle contemporaneamente richiamata da /newpost
function getDisc(req, res, docs){
  var db = req.db;
  var discussions = db.get('discussions');
  discussions.find( {}, {}, function(e, disc){
    res.render('newpost', {
        cats: docs,
        disc: disc,
        title: 'New Post Window',
        fs: {
        newDiscussion:function newDiscussion(selopt){
          if (selopt=='new') {
            var r = confirm('Press ok to create new discussion!\n Press cancel to select a value from the list!');
            if (r == true) {
              window.location = '/newDiscussion';
            } else {
              window.alert('Operation cancelled by user!');
            }
          }
        }
      }
    });
  });      
};

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
      // call the external function
      getDisc(req, res, docs);
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
//      console.log(doc);
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
    "discussion" : req.body.discussion,
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

/* Inserisco una nuova discussione nel DB */
router.post('/newDiscussion', function(req, res){
  // automatic insert of discussion creation date and author
  var now = new Date();
  var pdate = now.toJSON();
  var creator = req.session.user;
  // insert in db
  var db = req.db;
  var discussions = db.get('discussions')
  discussions.insert({
    "name" : req.body.discName,
    "author" : creator,
    "date" : pdate
  }, function(err, doc){
    if(err){
      res.send;
    } else {
      res.location("newpost");
      res.redirect("newpost");
    }
  })
  
  
});
console.log('Show this text trough a function: ' + myfunk.logger('ciao'))

module.exports = router;
