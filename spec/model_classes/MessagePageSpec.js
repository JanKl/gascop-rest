var Jasmine = require("jasmine");
var MessagePage = require("../../build/MessagePage").MessagePage;

describe("MessagePage", function () {
    var messagePage;

    beforeEach(function () {
        messagePage = new MessagePage();
    });

    it("should be initialized correctly", function () {
        expect(messagePage.toDbString()).toEqual("000000000000000000-100512030000001");
    });

    it("should transform the first example provided by gascop correctly", function () {
        messagePage.sendTime = 1386460991;
        messagePage.baud = 1200;
        messagePage.ric = 1336307;
        messagePage.msg = "Today is just another day in paradise.";

        expect(messagePage.toDbString()).toEqual("013864609910000000-101200031336307Today is just another day in paradise.");
    });

    
});
