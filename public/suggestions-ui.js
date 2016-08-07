function display_suggestions() {

    $('#show-more-suggestions').hide();
    $('#suggestions-loading-spinner').show();

    database_get_limited_to_last('suggestions', suggestions_count, function(
        suggestions) {
        if (!suggestions) {
            suggestions = [{
                title: 'There are no suggestions.',
                text: 'Click the add button on the bottom right to get started.',
                author: 0,
                votes: []
            }]
        }
        Object.keys(suggestions).forEach(function(key) {
            add_suggestion(key, suggestions[key])
        });
        $('#suggestions-loading-spinner').hide();
        search_suggestions();

        number_of_suggestions_loaded = Object.keys(suggestions).length;
        if (number_of_suggestions_loaded < suggestions_count) {
            $('#show-more-posts').show();
            $('#show-more-suggestions').prop("disabled", true);
            $('#show-more-suggestions').text(
                "No More Suggestions");
        } else {
            $('#show-more-suggestions').show();
            $('#show-more-suggestions').text("Load More (" +
                number_of_suggestions_loaded + " Loaded)");
        }
    });
}


function add_suggestion(id, suggestion) {
    var target = $('#suggestions-main');

    var card = construct_suggestion_card(id, suggestion);
    if (!card) {
        return;
    }
    var idString = 'suggestion-' + id;

    var suggestions = target.find(".suggestion-card");
    if (suggestions.length == 0) {
        console.log(card, "is the only card.");
        target.prepend(suggestions);
    } else {
        for (var i = 0; i < suggestions.length; i++) {
            var currentCard = $(suggestions[i]);

            if (idString > currentCard.attr('id')) {
                console.log(card, "goes before", currentCard);
                card.insertBefore(currentCard);
                return;
            }
            console.log(card, "goes after", currentCard);
        }
    }
    target.append(card);
}


function construct_suggestion_card(id, suggestion) {
    var title = suggestion.title;
    var text = suggestion.text;
    var author = suggestion.author;

    // Escape any HTML in the string.
    var text = $('<div/>').text(text).text();

    // Check to see if a suggestion with the same id already exists.
    var preexistingCard = $("#suggestion-" + id);
    if (preexistingCard.length > 0) {
        var preexistingSuggestion = preexistingCard.data().suggestion;
        if (preexistingSuggestion == suggestion) {
            // The content hasn't changed.
            console.log("Duplicate Suggestion", id);
            return;
        } else {
            // The content has changed, so let's delete the old card and insert an updated card.
            preexistingCard.remove();
        }
    }

    var card = $("<div/>")
        .addClass(
            "suggestion-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col"
        )
        .attr('id', 'suggestion-' + id);

    card.data({
        suggestion: suggestion,
        id: id
    });

    var titleDiv = $("<div/>")
        .addClass("mdl-card__title");
    titleDiv.append(
        $("<h2/>")
        .addClass("suggestion-title mdl-card__title-text")
        .text(title)
    );

    card.append(titleDiv);

    var textDiv = $("<div/>")
        .addClass(
            "suggestion-text mdl-card__supporting-text mdl-card--expand")
        .html(text.replace(new RegExp('\n', 'g'), "<br/>"));

    card.append(textDiv);

    var actions = $("<div/>")
        .addClass("mdl-card__actions mdl-card--border post-actions");

    var authorSpan = $("<span/>")
        .addClass("suggestion-span")
        .text(users_list[author].displayName);

    actions.append(authorSpan);

    var menuDiv = $("<div/>")
        .addClass("mdl-card__menu");


    if (author != current_user.id || is_admin) {

        var upvoteButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--icon")
            .append(
                $("<i/>")
                .addClass("material-icons")
                .text("thumb_up")
            );

        var upvoteButtonWrapper = $("<span/>").append(upvoteButton);

        var downvoteButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--icon")
            .append(
                $("<i/>")
                .addClass("material-icons")
                .text("thumb_down")
            );

        var downvoteButtonWrapper = $("<span/>").append(downvoteButton);

        if (!suggestion.votes) {
            suggestion.votes = {};
        }
        if (suggestion.votes[current_user.id] == 1) {
            upvoteButton.addClass('mdl-color-text--green-500');
            upvoteButton.click(function() {
                novote_suggestion(id);
            });
        } else {
            upvoteButton.click(function() {
                upvote_suggestion(id);
            });
        }

        var upvotes = 0;
        var downvotes = 0;

        Object.keys(suggestion.votes).forEach(function(key) {
            var vote = suggestion.votes[key];
            if (vote == 1) {
                upvotes++;
            } else if (vote == -1) {
                downvotes++;
            }
        });

        if (upvotes > 0) {
            actions.append(
                $("<div/>").text("Upvotes: " + upvotes)
            );
        }

        if (downvotes > 0) {
            actions.append(
                $("<div/>").text("Downvotes: " + downvotes)
            );
        }

        if (suggestion.votes[current_user.id] == -1) {
            downvoteButton.addClass('mdl-color-text--red-500');
            downvoteButton.click(function() {
                novote_suggestion(id);
            });
        } else {
            downvoteButton.click(function() {
                downvote_suggestion(id);
            });
        }

        menuDiv.append(upvoteButton);
        menuDiv.append(downvoteButton);

        card.addClass('suggestion-votable');
    }

    if (author == current_user.id || is_admin) {

        var deleteButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--icon")
            .append(
                $("<i/>")
                .addClass("material-icons")
                .text("delete")
            );

        var editButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--icon")
            .append(
                $("<i/>")
                .addClass("material-icons")
                .text("edit")
            );

        menuDiv.append(editButton);
        menuDiv.append(deleteButton);
        card.append(menuDiv);

        card.addClass('suggestion-editable')

        editButton.click(function() {
            show_edit_suggestion_dialog(id);
        });

        deleteButton.click(function() {
            show_delete_suggestion_dialog(id);
        });
    }

    card.append(menuDiv);

    card.append(actions);

    componentHandler.upgradeElement(card.get(0));
    return card;
}
