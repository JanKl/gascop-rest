import { MessagePage } from "../../../methods/MessagePage";
import { SchedulePeriod } from "./SchedulePeriod";
import { MessageObj } from "../interfaces/MessageObj";

/**
 * For implementation details see the documentation of the MessagePage class.
 */
export class Message {
    private _flag: boolean = false;
    get flag(): boolean {
        return this._flag;
    }
    set flag(value: boolean) {
        this._flag = value;
    }

    private _sendTime: Date = new Date();
    get sendTime(): Date {
        return this._sendTime;
    }
    set sendTime(value: Date) {
        this._sendTime = value;
    }

    private _schedulePeriod: SchedulePeriod = SchedulePeriod.Days;
    get schedulePeriod(): SchedulePeriod {
        return this._schedulePeriod;
    }
    set schedulePeriod(value: SchedulePeriod) {
        this._schedulePeriod = value;
    }

    private _schedulePeriodQuantity: number = 0;
    get schedulePeriodQuantity(): number {
        return this._schedulePeriodQuantity;
    }
    set schedulePeriodQuantity(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > 15) {
            value = 15;
        }

        this._schedulePeriodQuantity = value;
    }

    private _howMany: number = -1;
    get howMany(): number {
        return this._howMany;
    }
    set howMany(value: number) {
        if (value < -1) {
            value = -1;
        }

        if (value > 99) {
            value = 99;
        }

        this._howMany = value;
    }

    private _tx: number = 1;
    get tx(): number {
        return this._tx;
    }
    set tx(value: number) {
        if (value < 1) {
            value = 1;
        }

        if (value > 8) {
            value = 8;
        }

        this._tx = value;
    }

    private _baud: number = 512;
    get baud(): number {
        return this._baud;
    }
    set baud(value: number) {
        var toStore = 512;

        if (value == 1200) {
            toStore = 1200;
        }

        if (value == 2400) {
            toStore = 2400;
        }

        this._baud = toStore;
    }

    private _numeric: boolean = false;
    get numeric(): boolean {
        return this._numeric;
    }
    set numeric(value: boolean) {
        this._numeric = value;
    }

    private _functionBits: number = 3;
    get functionBits(): number {
        return this._functionBits;
    }
    set functionBits(value: number) {
        if (value < 0) {
            value = 0;
        }

        if (value > 3) {
            value = 3;
        }

        this._functionBits = value;
    }

    private _ric: number = 1;
    get ric(): number {
        return this._ric;
    }
    set ric(value: number) {
        if (value < 1) {
            value = 1;
        }

        if (value > 2097152) {
            value = 2097152;
        }

        this._ric = value;
    }

    private _msg: string = "";
    get msg(): string {
        return this._msg;
    }
    set msg(value: string) {
        this._msg = value;
    }

    public static FromObject(source: MessageObj): Message {
        var messageObject = new Message();

        messageObject.flag = source["flag"] == true || source["flag"] == "true";

        if (source["sendTime"] == "") {
            messageObject.sendTime = new Date(0);
        } else {
            messageObject.sendTime = new Date(source["sendTime"]);
        }

        try {
           messageObject.schedulePeriod = source["schedulePeriod"];
        } catch (e) {} // Prevent date parsing errors from stopping the script

        messageObject.schedulePeriodQuantity = source["schedulePeriodQuantity"];
        messageObject.howMany = source["howMany"];
        messageObject.tx = source["tx"];
        messageObject.baud = source["baud"];
        messageObject.numeric = source["numeric"] == true || source["numeric"] == "true";
        messageObject.functionBits = source["functionBits"];
        messageObject.ric = source["ric"];
        messageObject.msg = source["msg"];

        return messageObject;
    }

    public toMessagePage(): MessagePage {
        var messagePageObject = new MessagePage();

        messagePageObject.flag = this.flag ? 1 : 0;
        messagePageObject.sendTime = Math.round(this.sendTime.getTime() / 1000);
        messagePageObject.schedulePeriod = this.schedulePeriod;
        messagePageObject.schedulePeriodQuantity = this.schedulePeriodQuantity;
        messagePageObject.howMany = this.howMany;
        messagePageObject.tx = this.tx;
        messagePageObject.baud = this.baud;
        messagePageObject.numeric = this.numeric ? 1 : 0;
        messagePageObject.funcBits = this.functionBits;
        messagePageObject.ric = this.ric;
        messagePageObject.msg = this.msg;

        return messagePageObject;
    }
}