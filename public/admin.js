function begin_admin(event) {
    event.preventDefault();
    console.log("admin");
    if (authorized_topics.length == 0) {
        return;
    } else if (authorized_topics.length == 1) {
        topic_admin(authorized_topics[0]);
    } else {
        general_admin();
    }
}

function general_admin() {
    show_topic_select_dialog();
}

function topic_admin(topic) {
    show_topic_admin_dialog(topic);
}

function add_topic(topic) {
    if (!is_admin) {
        return "Not Admin";
    }
    if (list_contains(topics_list, topic)) {
        return "Topic Already Exists";
    }
    database_set('topics/' + topic, true, function() {
        reload();
    });
}


function deauthorize_user_for_topic(id, topic) {
    database_delete('authorization/' + topic + '/' + id, function() {
        reload();
    })
}


function authorize_user_for_topic(id, topic) {
    database_set('authorization/' + topic + '/' + id, true, function() {
        reload();
    });
}

function authorize_admin(id) {
    if (!is_admin) {
        return "Not Admin";
    }
    database_set('admin/' + id, true, function() {
        reload();
    })
}

function deauthorize_admin(id) {
    if (!is_admin) {
        return "Not Admin";
    }
    if (id == firebase.auth().currentUser.uid) {
        return "Can't deauthorize yourself.";
    }
    database_delete('admin/' + id, function() {
        reload();
    });
}
