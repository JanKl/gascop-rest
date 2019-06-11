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
            console.log("Skipping check (lastChecked is " + this.lastCheckedMinute + " and now we have " + minutes + ")");
            // Already checked for this minute. Skipping
            return;
        }

        console.log("Checking (lastChecked is " + this.lastCheckedMinute + " and now we have " + minutes + ")");

        this.lastCheckedMinute = minutes;

        for (let i = 0; i < config.cyclicAlarms.length; ++i) {
            let cyclicAlarm = config.cyclicAlarms[i];

            if (minutes % cyclicAlarm.repeatEveryMinutes != 0) {
                console.log("Cyclic message " + cyclicAlarm.message + " " + cyclicAlarm.ric + "/" + cyclicAlarm.functionBits + " – CH" + cyclicAlarm.txChannel + "@" + cyclicAlarm.baudRate + "Bd. is not due (due every " + cyclicAlarm.repeatEveryMinutes + " minutes and now we have " + minutes + ")");
                continue;
            }

            console.log("Sending cyclic message " + cyclicAlarm.message + " " + cyclicAlarm.ric + "/" + cyclicAlarm.functionBits + " – CH" + cyclicAlarm.txChannel + "@" + cyclicAlarm.baudRate + "Bd. (due every " + cyclicAlarm.repeatEveryMinutes + " minutes and now we have " + minutes + ")");

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