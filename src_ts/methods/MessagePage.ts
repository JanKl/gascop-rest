import { DbLineInterface } from "./DbLineInterface";

/**
 * Holds the data of a POCSAG message (called page in gascop).
 */
export class MessagePage implements DbLineInterface {
    /**
     * 0 for new entries, gascop will set this to 1 as soon as it is processing the entry
     * Allowed values: 0 and 1
     */
    public flag: number;

    /**
     * Seconds since epoch when to send the message. This timestamp is local time.
     */
    public sendTime: number;

    /**
     * Specifies the schedule period
     * Allowed values:
     * 0(dez) = minutes
     * 1(dez) = hours
     * 2(dez) = days
     * 3(dez) = weeks
     * 4(dez) = months
     * 5(dez) = years
     */
    public schedulePeriod: number;

    /**
     * Specifies the schedule period's quanitity
     * Allowed values: 0 - 15
     */
    public schedulePeriodQuantity: number;

    /**
     * The number of repetitions depending on schedule
     * -1 is to be used if schedule is 0 (no scheduling).
     * A message will be deleted as soon as it reaches 0. Therefore howMany must be a positive number if it should be repeated.
     * Allowed values: -1 - 99
     */
    public howMany: number;

    /**
     * The channel to use for transmission
     * Allowed values: 1 - 8
     */
    public tx: number;

    /**
     * Baud rate
     * Allowed values: 512, 1200, 2400
     */
    public baud: number;

    /**
     * Whether this message is to be sent as alpha (0) or numeric (1)
     * Allowed values: 0 and 1
     */
    public numeric: number;

    /**
     * The POCSAG function bit
     * 0 = numeric
     * 1 = T1
     * 2 = T2
     * 3 = alpha
     * Allowed values: 0 - 3
     */
    public funcBits: number;

    /**
     * The pocsag RIC
     * Allowed values: 1 - 2097152 (2^21, from POCSAG specification)
     */
    public ric: number;

    /**
     * The (alpha-)numeric message content
     * Allowed values:
     *  If numeric is 0 (alpha msg): All unicode characters
     *  If numeric is 1 (numeric msg): Only numbers [0-9*]
     */
    public msg: string;

    constructor() {
        this.flag = 0;
        this.sendTime = 0;
        this.schedulePeriod = 0;
        this.schedulePeriodQuantity = 0;
        this.howMany = -1;
        this.tx = 0;
        this.baud = 512;
        this.numeric = 0;
        this.funcBits = 3;
        this.ric = 1;
        this.msg = "";
    }

    /**
     * Getter only, use schedulePeriod and schedulePeriodQuantity to set!
     * Defines in what interval the message should be repeated. This value is a composite
     * of a period and a period quantification. Periods can be specified in minutes, hours,
     * days, weeks, months, and years. The value is stored decimal, but must be interpreted
     * as binary:
     * Bits 2^0 to 2^3 specify the period:
     *  0(dez) = minutes
     *  1(dez) = hours
     *  2(dez) = days
     *  3(dez) = weeks
     *  4(dez) = months
     *  5(dez) = years
     *  6(dez), 7(dez) = undefined
     * Bits 2^4 to 2^7 specify the period quantity from 0(dez) to 15(dez)
     * Example:
     *  020(dez) is the example given with the basic gascop configuration
     *  020(dez) = 0001 0100(bin)
     *  0001(bin) = 1(dez) = 1
     *  0100(bin) = 4(dez) = months
     *  So the message is repeated every month as long as howMany is a positive number.
     */
    public schedule(): number {
        // We have to combine the schedulePeriod and the schedulePeriodQuantity
        // to that schedulePeriod takes the less significant bits and schedulePeriodQuantity
        // takes the more significant bits.
        var combinedSchedule: number = 0;

        // Add schedulePeriod. This can be done directly as it takes the least significant bits.
        combinedSchedule = this.schedulePeriod;

        // To add schedulePeriodQuantity to the combinedSchedule, we will have to shift schedulePeriodQuantity
        // 4 bits to the left so that the already inserted schedulePeriod stays untouched.
        combinedSchedule = combinedSchedule | (this.schedulePeriodQuantity << 4);

        return combinedSchedule;
    }

    /**
     * Stores all values of the message page in a string suitable to be stored
     * in the database.
     * 
     * Database scheme for page entries:
     * 1 digit "flag"
     * 10 digits "sendTime", left-padded with zeros
     * 4 digits "spare": 0000
     * 3 digits "schedule", left-padded with zeros
     * 2 digits "howMany", left-padded with zeros
     * 1 digit "tx"
     * 4 digits "baud", left-padded with zeros
     * 1 digit "numeric"
     * 1 digit "funcBits"
     * 7 digits "ric", left-padded with zeros
     * n characters "msg"
     * 
     * The database is stored UTF-8 encoded
     */
    public toDbString(): string {
        var flagDatabase = this.flag.toString().substr(0, 1);
        var sendTimeDatabase = this.padLeft(this.sendTime.toString().substr(0, 10), 10, '0');
        var spareDatabase = "0000";
        var scheduleDatabase = this.padLeft(this.schedule().toString().substr(0, 3), 3, '0');
        var howManyDatabase = this.padLeft(this.howMany.toString().substr(0, 2), 2, '0');
        var txDatabase = this.tx.toString().substr(0, 1);
        var baudDatabase = this.padLeft(this.baud.toString().substr(0, 4), 4, '0');
        var numericDatabase = this.numeric.toString().substr(0, 1);
        var funcBitsDatabase = this.funcBits.toString().substr(0, 1);
        var ricDatabase = this.padLeft(this.ric.toString().substr(0, 7), 7, '0');
        var msgDatabase = this.msg;

        return flagDatabase + sendTimeDatabase + spareDatabase + scheduleDatabase
        + howManyDatabase + txDatabase + baudDatabase + numericDatabase
        + funcBitsDatabase + ricDatabase + msgDatabase;
    }

    /**
     * Padding with a character on the left hand side of the given string.
     * @copyright https://codepen.io/daniellmb/pen/JKGamY
     * @param str input string
     * @param len pad length
     * @param ch character to pad with
     */
    private padLeft(str: string, len: number, ch = '.'): string {
        len = len - str.length + 1;
        return len > 0 ? new Array(len).join(ch) + str : str;
    }
}