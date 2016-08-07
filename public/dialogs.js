function show_new_post_dialog() {

    if (!authorized_topics || authorized_topics == []) {
        return;
    }

    var dialog = $('dialog#new-post-dialog').get(0);
    var title = $(dialog).find('#new-post-title').get(0);
    var topic = $(dialog).find('#new-post-topic').get(0);
    var linkTitle = $(dialog).find('#new-post-link-title').get(0);
    var url = $(dialog).find('#new-post-url').get(0);
    var showTopics = $(dialog).find('#new-post-show-topics').get(0);
    var topicsList = $(dialog).find('#new-post-topics-list').get(0);
    var message = $(dialog).find('#new-post-text').get(0);
    var submitButton = $(dialog).find('#new-post-submit-button').get(
        0);
    var cancelButton = $(dialog).find('#new-post-cancel-button').get(
        0);

    $(title).val("");
    $(topic).data("topic", "");
    $(message).val("");
    $(linkTitle).val("");
    $(url).val("");
    $(topicsList).html("");

    $(submitButton).prop("disabled", true);

    function check_validity() {
        var valid = true;
        valid = valid && $(title).val() != "";
        valid = valid && $(topic).data('topic') != "";
        valid = valid && ($(message).val() != "" || $(url).val() != "");
        $(submitButton).prop("disabled", !valid);
    }
    $([title, message, linkTitle, url]).keyup(check_validity);

    function set_topic(newTopic) {
        $(topic).data("topic", newTopic);
        $(topic).text("Category: " + newTopic);
    }

    authorized_topics.forEach(function(thisTopic) {
        var thisTopicOption = $("<li/>")
            .addClass("mdl-menu__item")
            .text(thisTopic)
            .click(function() {
                set_topic(thisTopic);
                check_validity();
            });
        $(topicsList).append(thisTopicOption);
    });

    set_topic(authorized_topics[0]);

    $(submitButton).off().click(function() {
        if ($(linkTitle).val() == "") {
            $(linkTitle).val($(url).val())
        }
        submit_post($(title).val(), $(topic).data("topic"),
            $(message).val(), $(linkTitle).val(), $(url).val());
    });

    $(cancelButton).off().click(function() {
        close_dialog(dialog);
    });

    open_dialog(dialog);
}


function show_edit_post_dialog(id) {
    var card = $('#post-' + id);
    var post = card.data().post;

    if (!authorized_topics || authorized_topics == []) {
        return;
    }

    var dialog = $('dialog#edit-post-dialog').get(0);
    var title = $(dialog).find('#edit-post-title').get(0);
    var topic = $(dialog).find('#edit-post-topic').get(0);
    var linkTitle = $(dialog).find('#edit-post-link-title').get(0)
    var url = $(dialog).find('#edit-post-url').get(0);
    var showTopics = $(dialog).find('#edit-post-show-topics').get(0);
    var topicsList = $(dialog).find('#edit-post-topics-list').get(0);
    var message = $(dialog).find('#edit-post-text').get(0);
    var submitButton = $(dialog).find('#edit-post-submit-button').get(
        0);
    var cancelButton = $(dialog).find('#edit-post-cancel-button').get(
        0);
    console.log(post);
    $(title).val(post.title).parent().addClass('is-dirty');
    $(topic).data("topic", post.topic);
    if (post.text) $(message).val(post.text).parent().addClass('is-dirty');
    if (post.link_title) {
        $(linkTitle).val(post.link_title).parent().addClass('is-dirty');
    }
    if (post.url) $(url).val(post.url).parent().addClass('is-dirty');
    $(topicsList).html("");

    $(submitButton).prop("disabled", false);

    function check_validity() {
        var valid = true;
        valid = valid && $(title).val() != "";
        valid = valid && $(topic).data('topic') != "";
        valid = valid && ($(message).val() != "" || ($(url).val() != "" && $(
            linkTitle).val() != ""));
        $(submitButton).prop("disabled", !valid);
    }
    $([title, message, linkTitle, url]).keyup(check_validity);

    function set_topic(newTopic) {
        $(topic).data("topic", newTopic);
        $(topic).text("Category: " + newTopic);
    }

    authorized_topics.forEach(function(thisTopic) {
        var thisTopicOption = $("<li/>")
            .addClass("mdl-menu__item")
            .text(thisTopic)
            .click(function() {
                set_topic(thisTopic);
                check_validity();
            });
        $(topicsList).append(thisTopicOption);
    });

    set_topic(post.topic);

    $(submitButton).off().click(function() {
        if ($(linkTitle).val() == "") {
            $(linkTitle).val($(url).val())
        }
        update_post(id, $(title).val(), $(topic).data(
                "topic"),
            $(message).val(), $(linkTitle).val(), $(url).val());
    });

    $(cancelButton).off().click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}


function show_delete_post_dialog(id) {
    var dialog = $('dialog#delete-post-dialog').get(0);
    var input = $(dialog).find('#delete-post-dialog-input').get(0);
    var deleteButton = $(dialog).find('#delete-post-button').get(0);
    var closeButton = $(dialog).find('#delete-post-close-button').get(0);

    $(input).val("");
    $(deleteButton).prop("disabled", true);

    $(input).off().keyup(function() {
        $(deleteButton).prop("disabled", $(input).val() !=
            "DELETE");
    });

    $(deleteButton).off().click(function() {
        delete_post(id);
    });

    $(closeButton).off().click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}


function show_login_dialog() {
    $("#sign-out-link").hide();
    var dialog = $('dialog#login-dialog').get(0);
    var google = $(dialog).find('#google-login').get(0);
    // var admin = $(dialog).find('#admin-login').get(0);
    $(google).off().click(google_login);
    // $(admin).click(admin_login);
    open_dialog(dialog);
    // $(google).trigger("click");
}

function close_login_dialog() {
    var dialog = $('dialog#login-dialog').get(0);
    try {
        close_dialog(dialog);
    } catch (e) {

    }
}


function show_wrong_account_dialog() {
    var dialog = $('dialog#wrong-account-dialog').get(0);
    var logout = $(dialog).find('#wrong-account-logout').get(0);

    $(logout).off().click(sign_out);
    open_dialog(dialog);
}
