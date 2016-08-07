function submit_suggestion(title, text) {
    if (!title) {
        return "Error: Please specify a title.";
    }
    database_push('suggestions', {
        title: title,
        text: text,
        author: current_user.id
    }, function() {
        display_suggestions();
        $('dialog#new-suggestion-dialog').get(0).close();
        // reload();
    });
}

function update_suggestion(id, title, text) {
    if (!title) {
        return "Error: Please specify a title.";
    }
    database_update('suggestions/' + id, {
        title: title,
        text: text
    }, function() {
        display_suggestions();
        $('dialog#edit-suggestion-dialog').get(0).close();
        // reload();
    });
}


function delete_suggestion(id) {
    database_delete('suggestions/' + id, function() {
        $("#suggestion-" + id).remove();
        $('dialog#delete-suggestion-dialog').get(0).close();
        display_suggestions();
        // reload();
    });
}

function upvote_suggestion(id) {
    var vote = {};
    vote[current_user.id + 'A'] = 1;
    database_set('suggestions/' + id + '/votes/' + current_user.id, 1, function() {
        display_suggestions();
    });
}

function downvote_suggestion(id) {
    database_set('suggestions/' + id + '/votes/' + current_user.id, -1, function() {
        display_suggestions();
    });
}

function novote_suggestion(id) {
    database_delete('suggestions/' + id + '/votes/' + current_user.id, function() {
        display_suggestions();
    });
}
