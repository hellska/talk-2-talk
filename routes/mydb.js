var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/mydb', function(req, res){
  var db = req.db;
  var collection = db.get('users');
  collection.find({}, {}, function(e, docs){
    res.render('mydb', {
      "mydb" : docs
    });
  });
});

module.exports = router;