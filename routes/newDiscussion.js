var express = require('express');
var router = express.Router();

/* GET loginRetry page when login info are incorrect */
router.get('/newDiscussion', function(req, res) {
  res.render('../views/newDiscussion', { title: 'New Discussion Form' });
});

module.exports = router;