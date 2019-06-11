import { ConfigObj } from "../interfaces/ConfigObj";
import fs from "fs";
import path from "path";
import { ConfigPredefinedPagerGroup } from "../interfaces/ConfigPredefinedPagerGroup";
import { ConfigPredefinedPager } from "../interfaces/ConfigPredefinedPager";

var config: ConfigObj = require('../../config.json');

export class ConfigValidator {
    public static IsConfigValid(): boolean {
        if (!this.IsPathToGascopDbValid()) {
            return false;
        }

        if (!this.ArePredefinedMessagesValid()) {
            return false;
        }

        if (!this.ArePredefinedPagerGroupsValid()) {
            return false;
        }

        return true;
    }

    private static IsPathToGascopDbValid(): boolean {
        if (typeof config.absolutePathToGascopDb !== "string") {
            console.error("The path to the Gascop database is not set.");
            return false;
        }

        if (!fs.existsSync(path.dirname(config.absolutePathToGascopDb))) {
            console.error("The folder of the Gascop database is not existent. Given was '" + path.dirname(config.absolutePathToGascopDb) + "'");
            return false;
        }

        // Try to write lock file just to know if it would be possible
        try {
            let dummyFileName = config.absolutePathToGascopDb + ".dummy.lck";

            fs.writeFileSync(dummyFileName, "", { flag: 'wx' });
            fs.unlinkSync(dummyFileName);
        } catch (error) {
            console.debug("Dummy lock file write and delete failed", error);
            console.error("The folder of the Gascop database is not writable.");
            return false;
        }

        return true;
    }

    private static ArePredefinedMessagesValid(): boolean {
        if (typeof config.predefinedMessages !== "object") {
            console.error("The predefined messages are not set. Please use at least an empty array.");
            return false;
        }

        if (config.predefinedMessages.length == 0) {
            return true;
        }

        for (let i = 0; i < config.predefinedMessages.length; ++i) {
            if (typeof config.predefinedMessages[i] !== "string") {
                console.error("The predefined message at index " + i + " is not a valid string.");
                return false;
            }
        }

        return true;
    }

    private static ArePredefinedPagerGroupsValid(): boolean {
        if (typeof config.predefinedPagers !== "object") {
            console.error("The predefined pagers groups are not set. Please use at least an empty array.");
            return false;
        }

        if (config.predefinedPagers.length == 0) {
            return true;
        }

        for (let groupLineId = 0; groupLineId < config.predefinedPagers.length; ++groupLineId) {
            if (typeof config.predefinedPagers[groupLineId] !== "object") {
                console.error("The predefined pager group at index " + groupLineId + " is not a valid object.");
                return false;
            }

            if (!this.IsPredefinedPagersGroupValid(config.predefinedPagers[groupLineId], groupLineId)) {
                return false;
            }
        }

        return true;
    }

    private static IsPredefinedPagersGroupValid(predefinedPagerGroup: ConfigPredefinedPagerGroup, groupLineId: number): boolean {
        if (typeof predefinedPagerGroup.groupName !== "string") {
            console.error("The name of the predefined pager group at index " + groupLineId + " is not a valid string.");
            return false;
        }

        if (typeof predefinedPagerGroup.pagers !== "object") {
            console.error("The predefined pager group at index " + groupLineId + " has no pagers set. Please use at least an empty array.");
            return false;
        }

        if (predefinedPagerGroup.pagers.length == 0) {
            return true;
        }

        for (let pagerLineId = 0; pagerLineId < predefinedPagerGroup.pagers.length; ++pagerLineId) {
            if (typeof predefinedPagerGroup.pagers[pagerLineId] !== "object") {
                console.error("The predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid object.");
                return false;
            }

            if (!this.IsPredefinedPagerValid(predefinedPagerGroup.pagers[pagerLineId], pagerLineId, groupLineId)) {
                return false;
            }
        }

        return true;
    }

    private static IsPredefinedPagerValid(predefinedPager: ConfigPredefinedPager, pagerLineId: number, groupLineId: number): boolean {
        if (typeof predefinedPager.baudRate !== "number") {
            console.error("The information 'baudRate' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid number.");
            return false;
        }

        if (predefinedPager.baudRate != 512 && predefinedPager.baudRate != 1200 && predefinedPager.baudRate != 2400) {
            console.error("The information 'baudRate' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " must be one of 512, 1200, 2400.");
            return false;
        }


        if (typeof predefinedPager.functionBits !== "number") {
            console.error("The information 'functionBits' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid number.");
            return false;
        }

        if (predefinedPager.functionBits < 0 || predefinedPager.functionBits > 3) {
            console.error("The information 'functionBits' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " must be between 0 and 3.");
            return false;
        }


        if (typeof predefinedPager.guiName !== "string") {
            console.error("The information 'guiName' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid string.");
            return false;
        }

        if (predefinedPager.guiName == "") {
            console.error("The information 'guiName' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " must be non-empty.");
            return false;
        }


        if (typeof predefinedPager.ric !== "number") {
            console.error("The information 'ric' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid number.");
            return false;
        }

        if (predefinedPager.ric < 1 || predefinedPager.ric > 2097152) {
            console.error("The information 'ric' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " must be between 1 and 2097152.");
            return false;
        }


        if (typeof predefinedPager.txChannel !== "number") {
            console.error("The information 'txChannel' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " is not a valid number.");
            return false;
        }

        if (predefinedPager.txChannel < 1 || predefinedPager.txChannel > 8) {
            console.error("The information 'txChannel' of predefined pager at index " + pagerLineId + " of group index " + groupLineId + " must be between 1 and 8.");
            return false;
        }


        return true;
    }
}