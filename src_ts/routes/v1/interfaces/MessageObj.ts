export interface MessageObj {
    flag: boolean | string;
    sendTime: string;
    schedulePeriod: number;
    schedulePeriodQuantity: number;
    howMany: number;
    tx: number;
    baud: number;
    numeric: boolean | string;
    functionBits: number;
    ric: number;
    msg: string;
}