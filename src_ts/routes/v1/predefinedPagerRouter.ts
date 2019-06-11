import express from 'express';
import { ConfigObj } from '../../interfaces/ConfigObj';

var config: ConfigObj = require('../../../config.json');
var router = express.Router();

/* GET the predefined pagers. */
router.get('/',
  function (_req: any, res: any, _next: any) {
    res.status(200).json(config.predefinedPagers);
  });

module.exports = router;