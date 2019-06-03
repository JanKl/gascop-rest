import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(_req: any, res: any, _next: any) {
  res.render('index', { title: 'GASCOP-REST' });
});

module.exports = router;
