var chooseRecipients = (function () {
    var exports = {};

    exports.initialize = function () {
        $('#chooseRecipients').submit(onFormSubmit);
        $('#ric').keyup(updateSubmitButtonActivity);
        $("#predefinedRecipientsContainer").hide();

        loadPredefinedPagers();

        updateSubmitButtonActivity();
    }

    function loadPredefinedPagers() {
        $.get("v1/predefinedPager/")
        .done(showPredefinedPagerGroups)
        .fail(function (error) {
            console.error("Could not retrieve predefined pagers", error);
        });
    }

    function showPredefinedPagerGroups(data) {
        if (data.length == 0) {
            return;
        }

        for (let i = 0; i < data.length; ++i) {
            addPredefinedPagerGroup(data[i]);
        }

        $("#predefinedRecipientsContainer").show();
    }

    function addPredefinedPagerGroup(groupData) {
        let $column = $("<div></div>");
        $column.addClass("col recipientGroup");

        $heading = $("<h6></h6>");
        $heading.text(groupData['groupName']);
        $column.append($heading);

        $listGroupDiv = $("<div></div>");
        $listGroupDiv.addClass("list-group");
        $column.append($listGroupDiv);

        $("#predefinedRecipients").append($column);

        for (let i = 0; i < groupData['pagers'].length; ++i) {
            appendPagerToGroup($listGroupDiv, groupData['pagers'][i]);
        }
    }

    function appendPagerToGroup($jqueryListGroup, pagerData) {
        let $pagerItem = $("<a></a>");
        $pagerItem.addClass("list-group-item list-group-item-action list-group-item-secondary list-group-item-sm")
        $pagerItem.prop("href", "#");
        $pagerItem.text(pagerData['guiName']);
        $pagerItem.click(onPredefinedPagerClick);

        let $hiddenTx = $("<input></input>");
        $hiddenTx.attr("type", "hidden");
        $hiddenTx.attr("name", "tx");
        $hiddenTx.val(pagerData['txChannel']);
        $pagerItem.append($hiddenTx);

        let $hiddenBaud = $("<input></input>");
        $hiddenBaud.attr("type", "hidden");
        $hiddenBaud.attr("name", "baud");
        $hiddenBaud.val(pagerData['baudRate']);
        $pagerItem.append($hiddenBaud);

        let $hiddenRic = $("<input></input>");
        $hiddenRic.attr("type", "hidden");
        $hiddenRic.attr("name", "ric");
        $hiddenRic.val(pagerData['ric']);
        $pagerItem.append($hiddenRic);

        let $hiddenFunctionBits = $("<input></input>");
        $hiddenFunctionBits.attr("type", "hidden");
        $hiddenFunctionBits.attr("name", "functionBits");
        $hiddenFunctionBits.val(pagerData['functionBits']);
        $pagerItem.append($hiddenFunctionBits);

        $jqueryListGroup.append($pagerItem);
    }

    function onPredefinedPagerClick(event) {
        event.preventDefault();

        let $predefinedPager = $(this);
        let guiName = $predefinedPager.text();
        let tx = parseInt($predefinedPager.find("input[name='tx']").val());
        let baud = parseInt($predefinedPager.find("input[name='baud']").val());
        let ric = parseInt($predefinedPager.find("input[name='ric']").val());
        let functionBits = parseInt($predefinedPager.find("input[name='functionBits']").val());

        sendMessageSummary.addRecipient(guiName, tx, baud, ric, functionBits);

        afterSubmitFocusNextInputField();
    }

    function onFormSubmit(event) {
        event.preventDefault();

        if (!isSubmitPossible()) {
            alert("Please enter a valid RIC.");
            return;
        }

        let tx = $('#tx').val();
        let baud = $('#baud').val();
        let ric = $('#ric').val();
        let functionBits = $('#functionBits').val();

        let displayName = "" + ric + "/" + functionBits + " – CH" + tx + "@" + baud + "Bd.";

        sendMessageSummary.addRecipient(displayName, tx, baud, ric, functionBits);

        afterSubmitFocusNextInputField();
    }

    function afterSubmitFocusNextInputField() {
        $("#msg").focus();
    }

    function isSubmitPossible() {
        let ric = parseInt($("#ric").val());
        return !isNaN(ric) && ric >= 1 && ric <= 2097152;
    }

    function updateSubmitButtonActivity() {
        $("#chooseRecipients button[type='submit']").prop("disabled", !isSubmitPossible());
    }

    return exports;
})();

var chooseMessages = (function () {
    var exports = {};

    exports.initialize = function () {
        $('#chooseMessages').submit(onFormSubmit);
        $('#chooseMessages button[type="reset"]').click(onFormReset);
        $("#predefinedMessagesContainer").hide();

        loadPredefinedMessages();
    }

    function loadPredefinedMessages() {
        $.get("v1/predefinedMessage/")
        .done(showPredefinedMessages)
        .fail(function (error) {
            console.error("Could not retrieve predefined messages", error);
        });
    }

    function showPredefinedMessages(data) {
        if (data.length == 0) {
            return;
        }

        for (let i = 0; i < data.length; ++i) {
            addPredefinedMessage(data[i]);
        }

        $("#predefinedMessagesContainer").show();
    }

    function addPredefinedMessage(messageText) {
        let $predefinedMessagesDiv = $("#predefinedMessages");

        // Find out how many columns are already existing. Create the first
        // column if no column is present.
        let columnCount = $predefinedMessagesDiv.find(".col").length;

        if (columnCount == 0) {
            createNewColumn();
        }

        // There is a maximum entries count per column. Find out if the maximum
        // is reached and create a new column in that case.
        let maximumEntriesPerColumn = 5;
        let lastListGroup = $("#predefinedMessages > .col").last().find(".list-group");
        let lastColumnEntriesCount = lastListGroup.children().length;

        if (lastColumnEntriesCount >= maximumEntriesPerColumn) {
            createNewColumn();
            lastListGroup = $("#predefinedMessages > .col").last().find(".list-group");
        }

        let $message = $("<a></a>");
        $message.addClass("list-group-item list-group-item-action list-group-item-secondary list-group-item-sm");
        $message.prop("href", "#");
        $message.text(messageText);
        $message.click(onPredefinedMessageClick);
        lastListGroup.append($message);
    }

    function createNewColumn() {
        let $column = $("<div></div>");
        $column.addClass("col");

        $listGroupDiv = $("<div></div>");
        $listGroupDiv.addClass("list-group");
        $column.append($listGroupDiv);

        $("#predefinedMessages").append($column);
    }

    function onPredefinedMessageClick(event) {
        event.preventDefault();

        let msg = $(this).text();
        sendMessageSummary.setMessage(msg);
        $("#msg").val(msg);

        afterSubmitFocusNextInputField();
    }

    function onFormSubmit(event) {
        event.preventDefault();

        let msg = $("#msg").val();

        sendMessageSummary.setMessage(msg);

        afterSubmitFocusNextInputField();
    }

    function onFormReset(event) {
        event.preventDefault();

        resetForm();
    }

    function resetForm() {
        sendMessageSummary.setMessage("");
        $("#msg").val("");
    }

    function afterSubmitFocusNextInputField() {
        if (sendMessageSummary.isSendPossible()) {
            $("#sendMessageSummary button[type='submit']").focus();
        } else {
            $("#ric").focus();
        }
    }

    return exports;
})();

var sendMessageSummary = (function () {
    var exports = {};

    exports.initialize = function () {
        $('#sendMessageSummary').submit(onFormSubmit);
        $('#sendMessageSummaryReset').click(onFormReset);

        updateSubmitButtonActivity();
    }

    exports.addRecipient = function (guiName, tx, baud, ric, functionBits) {
        let $recipient = $("<li></li>");
        $recipient.addClass("list-inline-item");
        $("#pagersToNotify").append($recipient);

        let $recipientButton = $("<button></button>");
        $recipientButton.addClass("btn btn-outline-secondary btn-sm");
        $recipientButton.click(onRecipientClicked);
        $recipientButton.text(guiName);
        $recipient.append($recipientButton);

        $deleteIcon = $("<span></span>");
        $deleteIcon.addClass("deleteIcon");
        $deleteIcon.html("&nbsp;&nbsp;X");
        $recipientButton.append($deleteIcon);

        let $hiddenTx = $("<input></input>");
        $hiddenTx.attr("type", "hidden");
        $hiddenTx.attr("name", "tx");
        $hiddenTx.val(tx);
        $recipientButton.append($hiddenTx);

        let $hiddenBaud = $("<input></input>");
        $hiddenBaud.attr("type", "hidden");
        $hiddenBaud.attr("name", "baud");
        $hiddenBaud.val(baud);
        $recipientButton.append($hiddenBaud);

        let $hiddenRic = $("<input></input>");
        $hiddenRic.attr("type", "hidden");
        $hiddenRic.attr("name", "ric");
        $hiddenRic.val(ric);
        $recipientButton.append($hiddenRic);

        let $hiddenFunctionBits = $("<input></input>");
        $hiddenFunctionBits.attr("type", "hidden");
        $hiddenFunctionBits.attr("name", "functionBits");
        $hiddenFunctionBits.val(functionBits);
        $recipientButton.append($hiddenFunctionBits);

        updateSubmitButtonActivity();
    }

    exports.setMessage = function (messageToSet) {
        $("#textToSend").text(messageToSet);
    }

    function onFormSubmit(event) {
        event.preventDefault();

        if (!isSendPossible()) {
            alert("Cannot send without recipients being present!");
            return;
        }

        let messageToSend = $("#textToSend").text();
        let recipients = $("#pagersToNotify").children();
        let postPromises = [];

        for (let i = 0; i < recipients.length; ++i) {
            let $recipientLi = $(recipients[i]);

            let tx = parseInt($recipientLi.find("input[name='tx']").val());
            let baud = parseInt($recipientLi.find("input[name='baud']").val());
            let ric = parseInt($recipientLi.find("input[name='ric']").val());
            let functionBits = parseInt($recipientLi.find("input[name='functionBits']").val());

            let messageObject = {
                flag: false,
                sendTime: "",
                schedulePeriod: 0,
                schedulePeriodQuantity: 0,
                howMany: -1,
                tx: tx,
                baud: baud,
                numeric: false,
                functionBits: functionBits,
                ric: ric,
                msg: messageToSend
            }

            postPromises.push($.post("v1/message/", messageObject));
        }

        $.when.apply($, postPromises)
        .done(function() {
            alert("The message has been enqueued.");
            resetForm();
            afterSubmitFocusNextInputField();
        })
        .fail(function() {
            alert("At least one recipient failed.");
        });
    };

    function onFormReset(event) {
        event.preventDefault();

        resetForm();
    }

    function resetForm() {
        $("#pagersToNotify").empty();
        $("#textToSend").val("");

        updateSubmitButtonActivity();
    }

    function onRecipientClicked(event) {
        event.preventDefault();

        $(this).parent().remove();
        updateSubmitButtonActivity();
    }

    function isSendPossible() {
        return $("#pagersToNotify li").length > 0;
    }

    function updateSubmitButtonActivity() {
        $('#sendMessageSummarySubmit').prop("disabled", !isSendPossible());
    }

    function afterSubmitFocusNextInputField() {
        $("#ric").focus();
    }

    exports.isSendPossible = isSendPossible;

    return exports;
})();

$(function () {
    chooseRecipients.initialize();
    chooseMessages.initialize();
    sendMessageSummary.initialize();
});