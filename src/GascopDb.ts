import { DbInterface } from "./DbInterface";

export class GascopDb extends DbInterface {
    constructor(pathToDbFile: string) {
        super();
        this.pathToDbFile = pathToDbFile;
    }
}