/**
 * This interface defines members that are implemented by all classes
 * that represent database entries.
 */
export abstract class DbLineInterface {
    /**
     * Stores all values of the message page in a string suitable to be stored
     * in the database.
     */
    public abstract toDbString(): string;
}