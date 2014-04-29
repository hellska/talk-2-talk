var express = require('express');
var router = express.Router();

/* GET loginRetry page when login info are incorrect */
router.get('/loginRetry', function(req, res) {
  res.render('loginRetry', { title: 'Login Page' });
});

module.exports = router;