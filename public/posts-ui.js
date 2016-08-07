function display_posts() {
    // Get the 100 newest posts.

    $('#show-more-posts').hide();
    $('#posts-loading-spinner').show();

    database_get_limited_to_last('posts', posts_count, function(posts) {
        if (!posts) {
            posts = [{
                title: 'There are no posts.',
                text: 'Check again later.',
                topic: 'N/A'
            }]
        }

        Object.keys(posts).forEach(function(key) {
            add_post(key, posts[key])
        });
        $('#posts-loading-spinner').hide();
        search_posts();

        number_of_posts_loaded = Object.keys(posts).length;
        if (number_of_posts_loaded < posts_count) {
            $('#show-more-posts').show();
            $('#show-more-posts').prop("disabled", true);
            $('#show-more-posts').text(
                "No More Posts");
        } else {
            $('#show-more-posts').show();
            $('#show-more-posts').text("Load More (" +
                number_of_posts_loaded + " Loaded)");
        }
    });

}

function add_post(id, post) {
    var target = $('#posts-main');

    var card = construct_post_card(id, post);
    if (!card) {
        return;
    }
    var idString = 'post-' + id;

    var posts = target.find(".post-card");
    if (posts.length == 0) {
        target.prepend(card);
    } else {
        for (var i = 0; i < posts.length; i++) {
            var currentCard = $(posts[i]);

            if (idString > currentCard.attr('id')) {
                card.insertBefore(currentCard);
                return;
            }
        }
    }
    target.append(card);
}


function construct_post_card(id, post) {
    var title = post.title;
    var text = post.text;
    var topic = post.topic || "General";
    var image = post.image;
    var link_title = post.link_title;
    var url = post.url;

    // Escape any HTML in the string.
    var text = $('<div/>').text(text).text();

    // Check to see if a post with the same id already exists.
    var preexistingCard = $("#post-" + id);
    if (preexistingCard.length > 0) {
        var preexistingPost = preexistingCard.data().post;
        if (preexistingPost == post) {
            // The content hasn't changed.
            console.log("Duplicate Post", id);
            return;
        } else {
            // The content has changed, so let's delete the old card and insert an updated card.
            preexistingCard.remove();
        }
    }

    var card = $("<div/>")
        .addClass(
            "post-card mdl-card mdl-shadow--2dp mdl-cell mdl-cell--4-col card-" +
            topic)
        .attr('id', 'post-' + id);

    card.data({
        post: post,
        id: id
    });

    var titleDiv = $("<div/>")
        .addClass("mdl-card__title");
    titleDiv.append(
        $("<h2/>")
        .addClass("post-title mdl-card__title-text")
        .text(title)
    );

    if (image != null) {
        titleDiv.css({
            height: "176px",
            background: "url('" + image +
                "') center / cover"
        });
    }


    card.append(titleDiv);

    var textDiv = $("<div/>")
        .addClass(
            "post-text mdl-card__supporting-text mdl-card--expand")
        .html(text.replace(new RegExp('\n', 'g'), "<br/>"));

    card.append(textDiv);


    var actions = $("<div/>")
        .addClass("mdl-card__actions mdl-card--border post-actions");


    if (url) {
        var linkWrapper = $("<div/>")
            .text("Link: ");

        var link = $("<a/>")
            .attr('href', url)
            // .addClass("mdl-card__title-text");
            // .addClass("mdl-button mdl-js-button mdl-button--colored")
            .text(link_title);

        if (!contains(url, ':')) {
            link.attr('href', 'https://' + url);
        }

        if (link.prop('protocol') == 'javascript:') {
            link.attr('href', '#');
        }

        linkWrapper.append(link);

        textDiv.prepend([linkWrapper]);
    }

    var topicSpan = $("<span/>")
        .addClass("post-span")
        .text("Category: " + topic);

    actions.append(topicSpan);

    if (list_contains(authorized_topics, topic)) {
        var menuDiv = $("<div/>")
            .addClass("mdl-card__menu");

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

        card.addClass('post-editable')

        editButton.click(function() {
            show_edit_post_dialog(id);
        });

        deleteButton.click(function() {
            show_delete_post_dialog(id);
        });
    }

    card.append(actions);

    componentHandler.upgradeElement(card.get(0));
    return card;
}
