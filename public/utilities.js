function list_contains(list, value) {
    return list.indexOf(value) != -1;
}

var tmp = 0;

function run_sequentially(list) {
    var functionToRun = list[list.length - 1];
    var range = [];
    for (var i = list.length - 2; i >= 0; i--) {
        range.push(i);
    }
    // console.log(range);
    range.forEach(function(i) {
        // console.log(i, list[i]);
        var newFn = function() {
            list[i + 1](functionToRun);
        };
        functionToRun = newFn;
    });
    list[0](functionToRun);
}

function test_seq() {
    functions = [
        function(callback) {
            console.log("A")
            callback();
        },
        function() {
            console.log("B")
        }
    ]
    run_sequentially(functions);
}

function open_dialog(dialog) {
    if (!dialog.showModal(dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }
    if (dialog.getAttribute('open') == null) dialog.showModal();
}

function close_dialog(dialog) {
    if (dialog.getAttribute('open') != null) dialog.close();
}
