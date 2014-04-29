var express = require('express');
var router = express.Router();

/* GET loginRetry page when login info are incorrect */
router.get('/posts', function(req, res) {
  res.render('posts', { title: 'Posts view' });
  console.log('From posts Render');
});

module.exports = router;