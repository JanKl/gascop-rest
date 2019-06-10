import { ConfigPredefinedPagerGroup } from "./ConfigPredefinedPagerGroup";
import { ConfigCyclicAlarm } from "./ConfigCyclicAlarm";

export interface ConfigObj {
    absolutePathToGascopDb: string;
    predefinedMessages: Array<string>;
    predefinedPagers: Array<ConfigPredefinedPagerGroup>
    CyclicAlarms: Array<ConfigCyclicAlarm>
}