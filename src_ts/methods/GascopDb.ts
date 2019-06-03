import { DbInterface } from "./DbInterface";
import { ConfigObj } from "../interfaces/ConfigObj";
import path from "path";

var config: ConfigObj = require('../../config.json');

/**
 * This class is a singleton! Access via GascopDB.getInstance()
 */
export class GascopDb extends DbInterface {
    private static _instance: GascopDb;

    private constructor() {
        super();

        if (!GascopDb._instance) {
            GascopDb._instance = this;
            GascopDb._instance.initialize();
        }
    }

    public static getInstance(): GascopDb {
        if (!GascopDb._instance) {
            new GascopDb();
        }

        return GascopDb._instance;
    }

    public initialize() {
        // Read the path to the Gascop DB from the config file and add
        // the file name if it is not present.
        let pathToGascopDb = config.absolutePathToGascopDb;

        if (pathToGascopDb.slice(-9) != "gascop.db") {
            pathToGascopDb = path.join(pathToGascopDb, "gascop.db");
        }

        this.pathToDbFile = pathToGascopDb;
    }
}