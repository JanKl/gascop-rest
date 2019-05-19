/*
 * This test has to be executed manually as the timing has to be observed.
 * It was no "easy going" implementing a Jasmine test for the database class
 * because the database interface is meant to be running continuously in the
 * background. Therefore we cannot predict, when exactly the entry will be
 * written into the database.
 */
var MessagePage = require("../../build/MessagePage").MessagePage;
var GascopDb = require("../../build/GascopDb").GascopDb;
var gascopDbFilePath = "./gascop.mock.db";

var mp1 = new MessagePage();
mp1.sendTime = Math.abs((new Date()).getTime());
mp1.baud = 1200;
mp1.ric = 170530;
mp1.msg = "First test message";

var mp2 = new MessagePage();
mp2.sendTime = Math.abs((new Date()).getTime());
mp2.baud = 512;
mp2.ric = 12321;
mp2.msg = "Second test message";

var gascopDb = new GascopDb(gascopDbFilePath);
gascopDb.storeLine(mp1);
gascopDb.storeLine(mp2);