import { ConfigObj } from "../interfaces/ConfigObj";
import fs from "fs";
import path from "path";

var config: ConfigObj = require('../../config.json');

export class ConfigValidator {
    public static IsConfigValid(): boolean {
        if (!this.IsPathToGascopDbValid()) {
            return false;
        }

        if (!this.ArePredefinedMessagesValid()) {
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
}