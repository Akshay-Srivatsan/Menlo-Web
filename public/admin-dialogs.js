function show_topic_select_dialog() {
    var dialog = $('dialog#select-topic-dialog').get(0);
    var main = $(dialog).find('#select-topic-main').get(0);
    var addTopicButton = $(dialog).find('#select-topic-add-button').get(0);
    var adminButton = $(dialog).find('#select-topic-admin-button').get(0);
    var cancelButton = $(dialog).find('#select-topic-cancel-button').get(0);

    if (!open_dialog(dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }

    $(main).html("");

    authorized_topics.forEach(function(topic) {

        var button = $("<button/>")
            .addClass(
                "mdl-button mdl-js-button mdl-button--colored mdl-button--raised"
            )
            .addClass("mdl-cell mdl-cell--12-col")
            .text(topic)
            .click(function() {
                topic_admin(topic);
                close_dialog(dialog);
            });

        $(main).append(button);
    });

    $(adminButton).off();
    $(adminButton).click(function() {
        close_dialog(dialog);
        show_add_admin_dialog();
    });

    $(cancelButton).off();
    $(cancelButton).click(function() {
        close_dialog(dialog);
    });

    $(addTopicButton).off();
    $(addTopicButton).click(function() {
        close_dialog(dialog);
        show_add_topic_dialog();
    })

    open_dialog(dialog);
}


function show_add_topic_dialog() {
    var dialog = $('dialog#add-topic-dialog').get(0);
    var input = $(dialog).find('#add-topic-input').get(0);
    var input2 = $(dialog).find('#add-topic-input-2').get(0);
    var addButton = $(dialog).find('#add-topic-button').get(0);
    var closeButton = $(dialog).find('#add-topic-close-button').get(0);

    if (!open_dialog(dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }

    $(input).val("");
    $(input2).val("");
    $(addButton).prop("disabled", true);

    $([input, input2]).off();
    $([input, input2]).keyup(function() {
        $(addButton).prop("disabled", $(input).val() != $(input2).val());
    });

    $(addButton).off();
    $(addButton).click(function() {
        close_dialog(dialog);
        add_topic($(input).val());
    });

    $(addButton).off();
    $(closeButton).click(function() {
        close_dialog(dialog);
    });
    open_dialog(dialog);
}


function show_topic_admin_dialog(topic) {
    var dialog = $('dialog#admin-topic-dialog').get(0);
    var title = $(dialog).find('#admin-topic-title').get(0);
    var main = $(dialog).find('#admin-topic-main').get(0);
    var search = $(dialog).find('#admin-topic-search-input').get(0);
    var cancelButton = $(dialog).find('#admin-topic-cancel-button').get(0);

    if (!open_dialog(dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }
    $(title).text("Settings for \"" + topic + "\"");
    $(main).html("");

    Object.keys(users_list).forEach(function(id) {

        var user = users_list[id];

        var userButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--raised")
            .addClass("mdl-cell mdl-cell--12-col");

        userButton.data("user", user);

        var authorized_users_for_topic;


        if (!authorization[topic]) {
            authorized_users_for_topic = []
        } else {
            authorized_users_for_topic = Object.keys(authorization[
                topic]);
        }

        if (list_contains(admins_list, id)) {
            userButton.attr('disabled', true);
            userButton.text("(Admin) " + user.displayName);
        } else if (list_contains(authorized_users_for_topic, id) &&
            authorization[topic][id]) {
            userButton.text("Remove " + user.displayName);
            userButton.addClass("mdl-button--accent");

            userButton.click(function() {
                deauthorize_user_for_topic(id, topic);
            });
        } else {
            userButton.text("Add " + user.displayName);
            userButton.addClass("mdl-button--colored");

            userButton.click(function() {
                authorize_user_for_topic(id, topic);
            });
        }

        $(main).append(userButton)
    });

    $(search).off();
    $(search).keyup(function() {
        var string = $(search).val();
        // console.log($(main).find("button"));
        $(main).find("button").each(function(index, button) {
            var user = $(button).data("user");
            if (contains(user.displayName, string)) {
                $(button).show();
            } else {
                $(button).hide();
            }
        });
    });

    $(cancelButton).off();
    $(cancelButton).click(function() {
        close_dialog(dialog);
    });

    open_dialog(dialog);
}


function show_add_admin_dialog() {
    var dialog = $('dialog#add-admin-dialog').get(0);
    var title = $(dialog).find('#add-admin-title').get(0);
    var main = $(dialog).find('#add-admin-main').get(0);
    var search = $(dialog).find('#add-admin-search-input').get(0);
    var cancelButton = $(dialog).find('#add-admin-cancel-button').get(0);

    if (!open_dialog(dialog)) {
        dialogPolyfill.registerDialog(dialog);
    }
    $(main).html("");

    Object.keys(users_list).forEach(function(id) {

        var user = users_list[id];

        var userButton = $("<button/>")
            .addClass("mdl-button mdl-js-button mdl-button--raised")
            .addClass("mdl-cell mdl-cell--12-col");

        userButton.data("user", user);

        if (id == firebase.auth().currentUser.uid) {
            userButton.attr('disabled', true);
            userButton.text(user.displayName + " (You)");
        } else if (list_contains(admins_list, id)) {
            userButton.text("Remove " + user.displayName);
            userButton.addClass("mdl-button--accent");

            userButton.click(function() {
                deauthorize_admin(id);
            });
        } else {
            userButton.text("Add " + user.displayName);
            userButton.addClass("mdl-button--colored");

            userButton.click(function() {
                authorize_admin(id);
            });
        }

        $(main).append(userButton)
    });


    $(search).keyup(function() {
        var string = $(search).val();
        $(main).find("button").each(function(index, button) {
            var user = $(button).data("user");
            if (contains(user.displayName, string)) {
                $(button).show();
            } else {
                $(button).hide();
            }
        });
    });

    $(cancelButton).click(function() {
        close_dialog(dialog);
    });

    open_dialog(dialog);
}
