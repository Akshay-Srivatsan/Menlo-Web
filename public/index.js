var posts_count = 50;
var number_of_posts_loaded = 0;
var posts_load_amount = 50;

var suggestions_count = 50;
var number_of_suggestions_loaded = 0;
var suggestions_load_amount = 50;

var admins_list;
var authorization;

var topics_list;
var authorized_topics;

var users_list;

var can_compose_posts;
var is_admin;

var subscriptions;

var current_user = {
    id: null,
    displayName: null,
    credentials: null,
    email: null
}


function reload() {
    window.location.reload();
}


function contains(superstring, substring) {
    if (superstring == null) {
        return false;
    }
    if (substring == null) {
        return true;
    }
    return (superstring.toLowerCase().indexOf(substring.toLowerCase()) !=
        -1);
}

function search_posts(e) {
    if (e) e.preventDefault();
    var searchText = $("#posts-search-input").val();
    $(".post-card").each(function(index) {
        var post = $(this).data().post;
        if (contains(post.title, searchText) || contains(
                post.text, searchText) || contains(post.topic,
                searchText)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function search_suggestions(e) {
    if (e) e.preventDefault();
    var searchText = $("#suggestions-search-input").val();
    $(".suggestion-card").each(function(index) {
        var suggestion = $(this).data().suggestion;
        if (contains(suggestion.title, searchText) || contains(
                suggestion.text, searchText) || contains(users_list[
                    suggestion.author].displayName,
                searchText) || contains(users_list[suggestion.author].email,
                searchText)) {
            $(this).show();
        } else {
            $(this).hide();
        }
    });
}

function manage_button_visibility() {
    if (can_compose_posts) {
        $('#new-post-fab').show();
        $('#new-post-fab').click(show_new_post_dialog);
        $('#admin-link').show();
        $('#admin-link').click(begin_admin);
    }
    $('#new-suggestion-fab').show();
    $('#new-suggestion-fab').click(show_new_suggestion_dialog);
}

function infinite_scroll_handler() {
    distanceToBottom = $(this).get(
        0).scrollHeight - ($(this).scrollTop() + $(this).innerHeight());
    if (distanceToBottom < 200) {
        if ($("section.is-active").is($("#posts-tab"))) {
            load_more_posts();
        } else if ($("section.is-active").is($("#suggestions-tab"))) {
            load_more_suggestions();
        }
    }
}


$(document).ready(function() {

    if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        window.location = "ios.html";
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user == null) {
            console.log("Not signed in.");
            show_login_dialog();
        } else if (!firebase.auth().currentUser.email.endsWith(
                '@menloschool.org')) {
            show_wrong_account_dialog();
        } else {
            close_login_dialog();
            when_logged_in();
        }
    });

    $("#admin-link").hide();
    $("#sign-out-link").click(sign_out);

    $("#posts-search-input").keyup(search_posts);
    $("#suggestions-search-input").keyup(search_suggestions);

    $('#new-post-fab').hide();
    $('#new-suggestion-fab').hide();

    $('#show-more-posts').hide().click(load_more_posts);
    $('#show-more-suggestions').hide().click(load_more_suggestions);

    $('main').scroll(infinite_scroll_handler);

});

window.onpopstate = function(state) {
    if (state.dialog) {
        var dialog = state.dialog;
        if (!dialog.showModal(dialog)) {
            dialogPolyfill.registerDialog(dialog);
        }
        state.dialog.showModal();
    }
}
