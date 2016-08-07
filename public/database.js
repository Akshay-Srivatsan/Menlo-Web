function goOnline() {}

function goOffline() {}

function when_logged_in() {
    $("#sign-out-link").show();

    var user = firebase.auth().currentUser;
    current_user = {
        id: user.uid,
        displayName: user.displayName,
        email: user.email,
        credentials: user.cd
    }

    firebase.database().goOffline();
    sync_user_data();
}

function sync_user_data() {
    var location = 'users/' + current_user.id;
    database_get(location, function(userData) {
        if (!userData) {
            database_set(location, {
                email: current_user.email,
                displayName: current_user.displayName
            }, get_admins_list);
        } else {
            subscriptions = userData.subscriptions;
            get_admins_list();
        }
    })
}

function get_admins_list() {
    database_get('admin', function(dbAdmins) {
        admins_list = [];
        Object.keys(dbAdmins).forEach(function(key) {
            if (dbAdmins[key]) {
                admins_list.push(key);
            }
        });
        get_users_list();
    })
}

function get_users_list() {
    database_get('users', function(dbUsers) {
        users_list = dbUsers;
        users_list[0] = {
            displayName: 'Menlo School',
            email: ''
        }
        get_authorization();
    })
}

function get_authorization() {
    database_get('authorization', function(dbAuth) {
        authorization = dbAuth;
        if (authorization == null) {
            authorization = [];
        }
        get_topics();
    })
}

function get_topics() {
    database_get('topics', function(dbTopics) {
        topics_list = Object.keys(dbTopics);
        verify_permissions();
        manage_button_visibility();
        display_posts();
        display_suggestions();
    })
}

function list_contains(list, value) {
    return list.indexOf(value) != -1;
}

function verify_permissions() {
    if (list_contains(admins_list, current_user.id)) {
        console.log("Administrator Privileges Active");
        is_admin = true;
        can_compose_posts = true;
        authorized_topics = topics_list;
        return;
    }

    authorized_topics = [];
    topics_list.forEach(function(topic) {
        var authorized_users_for_topic = authorization[
            topic];
        if (!authorized_users_for_topic) {
            return;
        }
        if (authorized_users_for_topic[user.uid]) {
            console.log("Authorized for Topic: ", topic);
            authorized_topics.push(topic);
            can_compose_posts = true;
        }
    });
}


function load_more_posts() {
    if (number_of_posts_loaded < posts_count) {
        // There are no more posts to load - the last request didn't return the full amount.
        return;
    } else {
        // We can load more posts.
        posts_count += posts_load_amount;
        display_posts();
    }
}

function load_more_suggestions() {
    if (number_of_suggestions_loaded < suggestions_count) {
        // There are no more suggestions to load - the last request didn't return the full amount.
        return;
    } else {
        // We can load more suggestions.
        suggestions_count += suggestions_load_amount;
        display_suggestions();
        search_suggestions();
    }
}
