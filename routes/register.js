var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/register', function(req, res) {
  res.render('register', { title: 'Registration Form' });
});


module.exports = router;