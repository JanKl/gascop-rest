import { EventEmitter } from 'events';
import { ConfigObj } from "../interfaces/ConfigObj";
import { GascopDb } from './GascopDb';
import { Message } from '../routes/v1/models/Message';

var config: ConfigObj = require('../../config.json');

/**
 * This class reads the cyclic alarms from the config file and
 * triggers a message every time a cyclic alarm is due.
 */
export class CyclicAlarmWatchdog extends EventEmitter {
    private lastCheckedMinute: number = NaN;

    constructor() {
        super();

        // Decouple timeout listener to reduce memory footprint, see https://blog.x5ff.xyz/blog/typescript-interval-iot/
        this.addListener("cyclic-alarm-timeout", this.onCyclicAlarmTimeout);
        this.onCyclicAlarmTimeout();
    }

    private onCyclicAlarmTimeout(): void {
        this.executeDueAlarms();

        // Reschedule and check every 30 seconds to not miss a minute
        setTimeout(() => this.emit("cyclic-alarm-timeout"), 30 * 1000);
    }

    private executeDueAlarms(): void {
        let now = new Date();
        let minutes = Math.floor(now.getTime() / 1000 / 60);

        if (!isNaN(this.lastCheckedMinute) && this.lastCheckedMinute == minutes) {
            // Already checked for this minute. Skipping
            return;
        }

        this.lastCheckedMinute = minutes;

        for (let i = 0; i < config.cyclicAlarms.length; ++i) {
            let cyclicAlarm = config.cyclicAlarms[i];

            if (minutes % cyclicAlarm.repeatEveryMinutes != 0) {
                continue;
            }

            let messageToSend = new Message();
            messageToSend.baud = cyclicAlarm.baudRate;
            messageToSend.functionBits = cyclicAlarm.functionBits;
            messageToSend.msg = cyclicAlarm.message;
            messageToSend.ric = cyclicAlarm.ric;
            messageToSend.tx = cyclicAlarm.txChannel;

            GascopDb.getInstance().storeLine(messageToSend.toMessagePage());
        }
        
    }
}