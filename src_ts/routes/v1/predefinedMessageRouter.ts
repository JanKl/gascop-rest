import express from 'express';
import { ConfigObj } from '../../interfaces/ConfigObj';

var config: ConfigObj = require('../../../config.json');
var router = express.Router();

/* GET the predefined messages. */
router.get('/',
  function (_req: any, res: any, _next: any) {
    res.status(200).json(config.predefinedMessages);
  });

module.exports = router;