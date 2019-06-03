$(function () {
    $('#sendMessage').submit(function (event) {
        event.preventDefault();

        let messageObject = {
            flag: false,
            sendTime: "",
            schedulePeriod: 0,
            schedulePeriodQuantity: 0,
            howMany: -1,
            tx: parseInt($('#tx').val()),
            baud: parseInt($('#baud').val()),
            numeric: false,
            functionBits: parseInt($('#functionBits').val()),
            ric: parseInt($('#ric').val()),
            msg: $('#msg').val()
        }

        $.post("v1/message/", messageObject)
            .done(function success() {
                alert("The message has been enqueued.");
            })
            .fail(function fail(data) {
                alert("An error occured enqueuing the message.");
            });
    })
});