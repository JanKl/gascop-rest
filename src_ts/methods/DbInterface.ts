import fs from 'fs';
import { DbLineInterface } from './DbLineInterface';
import { EventEmitter } from 'events';

/**
 * This class provides file handling for gascop database files.
 * In particular this affects gascop.db and pagerid.db, for both files there will
 * be concrete implementations.
 */
export abstract class DbInterface extends EventEmitter {
    protected pathToDbFile: string = "";
    private writeQueue: Array<DbLineInterface> = [];

    private readonly noFailedWriteAttemptTimestamp: Date = new Date(0);
    private firstFailedWriteAttemptTimestamp: Date = this.noFailedWriteAttemptTimestamp; // Holds the first time a write failed in a series of failed write attempts.

    constructor() {
        super();

        // Decouple timeout listener to reduce memory footprint, see https://blog.x5ff.xyz/blog/typescript-interval-iot/
        this.addListener("write-queue-to-database-timeout", this.writeQueueToFile);
        this.writeQueueToFile();
    }

    /**
     * Stores a line in the database
     */
    public storeLine(toStore: DbLineInterface): void {
        this.writeQueue.push(toStore);
    }

    /**
     * Writes the current contents of the write queue into the database file.
     * Will reschedule the write if the queue is empty or the file lock cannot be retrieved.
     */
    private writeQueueToFile(): void {
        let elementsInQueueCount = this.writeQueue.length;

        // If there are no items in the queue, check again in one second.
        if (elementsInQueueCount == 0) {
            setTimeout(() => this.emit("write-queue-to-database-timeout"), 1000);
            return;
        }

        // There are elements present in the queue that have to be written. Try to aquire the
        // lock. 
        if (!this.aquireDatabaseLock()) {
            // Lock could not be aquired. Wait at most 2 seconds.
            // If we already waited for more than 2 seconds, assume the lock is stale and force the release of the lock.
            // If we waited for less than 2 seconds, retry in 100 ms.
            let firstTryTime: number = this.firstFailedWriteAttemptTimestamp.getTime();
            let currentTime: number = (new Date()).getTime();

            if (this.firstFailedWriteAttemptTimestamp.getTime() == this.noFailedWriteAttemptTimestamp.getTime() || (currentTime - firstTryTime) < 2000) {
                // Waited for less than 2 seconds
                if (this.firstFailedWriteAttemptTimestamp.getTime() == this.noFailedWriteAttemptTimestamp.getTime()) {
                    this.firstFailedWriteAttemptTimestamp = new Date();
                }

                setTimeout(() => this.emit("write-queue-to-database-timeout"), 100);
                return;
            }

            // Waited for more than 2 seconds
            this.releaseDatabaseLock();

            if (!this.aquireDatabaseLock()) {
                console.error("Could not force-release the database lock of " + this.pathToDbFile + ". Retrying in 100 ms.");
                setTimeout(() => this.emit("write-queue-to-database-timeout"), 100);
                return;
            }
        }

        // We have the lock. Write the contents to the file.
        let failedWrites: Array<DbLineInterface> = [];

        for (var dbLine; dbLine = this.writeQueue.shift();) {
            if (dbLine === undefined) {
                break;
            }

            if (!this.appendEntryToDatabaseFile(dbLine)) {
                failedWrites.push(dbLine);
            }
        }

        // Reinsert the failed lines in the queue to retry them on the next execution.
        for (var failedDbLine; failedDbLine = failedWrites.shift();) {
            if (failedDbLine === undefined) {
                break;
            }

            this.writeQueue.push(failedDbLine);
        }

        this.firstFailedWriteAttemptTimestamp = this.noFailedWriteAttemptTimestamp;
        this.releaseDatabaseLock();
        setTimeout(() => this.emit("write-queue-to-database-timeout"), 1000);
    }

    /**
     * Locking is performed by creating an empty .lck file next to the database.
     * So if the database's file name is gascop.db, the lock file is gascop.db.lck.
     * @returns true, if the lock has been aquired successfully, false otherwise.
     */
    private aquireDatabaseLock(): boolean {
        try {
            fs.writeFileSync(this.pathToDbFile + ".lck", "", { flag: 'wx' });
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * Releases a database lock by removing the lock file.
     */
    private releaseDatabaseLock(): void {
        fs.unlinkSync(this.pathToDbFile + ".lck");
    }

    private appendEntryToDatabaseFile(dbLine: DbLineInterface): boolean {
        try {
            fs.appendFileSync(this.pathToDbFile, dbLine.toDbString() + "\n");
            return true;
        } catch (e) {
            console.error("Could not append entry to database " + this.pathToDbFile, e);
            return false;
        }
    }
}