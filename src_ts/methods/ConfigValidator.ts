import { ConfigObj } from "../interfaces/ConfigObj";
import fs from "fs";
import path from "path";

var config: ConfigObj = require('../../config.json');

export class ConfigValidator {
    public static IsConfigValid(): boolean {
        if (!this.IsPathToGascopDbValid()) {
            return false;
        }

        return true;
    }

    private static IsPathToGascopDbValid(): boolean {
        if (typeof config.absolutePathToGascopDb === "undefined") {
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
}