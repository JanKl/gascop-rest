import express from 'express';
import { check, validationResult } from 'express-validator/check';
import { Message } from './models/Message';
import { GascopDb } from '../../methods/GascopDb';

var router = express.Router();

/* POST a message. */
router.post('/',
  [
    check('flag').isBoolean(),
    check('sendTime').isString(),
    check('schedulePeriod').isNumeric(),
    check('schedulePeriodQuantity').isNumeric(),
    check('howMany').isNumeric(),
    check('tx').isNumeric(),
    check('baud').isNumeric(),
    check('numeric').isBoolean(),
    check('functionBits').isNumeric(),
    check('ric').isNumeric(),
    check('msg').isString()
  ],
  function (req: any, res: any, _next: any) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let messageToSend = Message.FromObject(req.body);

    // Write the message into the database
    GascopDb.getInstance().storeLine(messageToSend.toMessagePage());

    res.status(201).json({ successText: "The message has been enqueued.", message: messageToSend });
  });

module.exports = router;