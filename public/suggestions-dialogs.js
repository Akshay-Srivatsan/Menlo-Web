function show_new_suggestion_dialog() {

    var dialog = $('dialog#new-suggestion-dialog').get(0);
    var title = $(dialog).find('#new-suggestion-title').get(0);
    var message = $(dialog).find('#new-suggestion-text').get(0);
    var submitButton = $(dialog).find('#new-suggestion-submit-button').get(
        0);
    var cancelButton = $(dialog).find('#new-suggestion-cancel-button').get(
        0);

    $(title).val("");
    $(message).val("");

    $(submitButton).prop("disabled", true);

    function check_validity() {
        var valid = true;
        valid = valid && $(title).val() != "";
        valid = valid && $(message).val() != "";
        $(submitButton).prop("disabled", !valid);
    }
    $([title, message]).off().keyup(check_validity);

    $(submitButton).off().click(function() {
        submit_suggestion($(title).val(),
            $(message).val());
    });

    $(cancelButton).off().click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}


function show_edit_suggestion_dialog(id) {
    var card = $('#suggestion-' + id);
    var suggestion = card.data().suggestion;

    var dialog = $('dialog#edit-suggestion-dialog').get(0);
    var title = $(dialog).find('#edit-suggestion-title').get(0);
    var message = $(dialog).find('#edit-suggestion-text').get(0);
    var submitButton = $(dialog).find('#edit-suggestion-submit-button').get(
        0);
    var cancelButton = $(dialog).find('#edit-suggestion-cancel-button').get(
        0);

    $(title).val(suggestion.title).parent().addClass('is-dirty');
    $(message).val(suggestion.text).parent().addClass('is-dirty');

    $(submitButton).prop("disabled", false);

    function check_validity() {
        var valid = true;
        valid = valid && $(title).val() != "";
        valid = valid && $(message).val() != "";
        $(submitButton).prop("disabled", !valid);
    }
    $([title, message]).off().keyup(check_validity);


    $(submitButton).off().click(function() {
        update_suggestion(id, $(title).val(),
            $(message).val());
    });

    $(cancelButton).off().click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}


function show_delete_suggestion_dialog(id) {
    var dialog = $('dialog#delete-suggestion-dialog').get(0);
    var input = $(dialog).find('#delete-suggestion-dialog-input').get(0);
    var deleteButton = $(dialog).find('#delete-suggestion-button').get(0);
    var closeButton = $(dialog).find('#delete-suggestion-close-button').get(0);

    $(input).val("");
    $(deleteButton).prop("disabled", true);

    $(input).off().keyup(function() {
        $(deleteButton).prop("disabled", $(input).val() !=
            "DELETE");
    });

    $(deleteButton).off().click(function() {
        delete_suggestion(id);
    });

    $(closeButton).off().click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}
