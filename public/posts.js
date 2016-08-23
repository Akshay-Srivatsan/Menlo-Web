function submit_post(title, topic, text, linkTitle, url) {
    if (!title) {
        return "Error: Please specify a title.";
    }
    if (!topic) {
        return "Error: Please specify a topic.";
    }
    database_push('posts', {
        title: title,
        topic: topic,
        text: text || undefined,
        link_title: linkTitle || undefined,
        url: url || undefined,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    }, function() {
        display_posts();
        $('dialog#new-post-dialog').get(0).close();
        // reload();
    });
}

function update_post(id, title, topic, text, linkTitle, url) {
    if (!title) {
        return "Error: Please specify a title.";
    }
    if (!topic) {
        return "Error: Please specify a topic.";
    }
    database_update('posts/' + id, {
        title: title,
        topic: topic,
        text: text || undefined,
        link_title: linkTitle || undefined,
        url: url || undefined
    }, function() {
        display_posts();
        $('dialog#edit-post-dialog').get(0).close();
        // reload();
    });
}


function delete_post(id) {
    database_delete('posts/' + id, function() {
        $("#post-" + id).remove();
        $('dialog#delete-post-dialog').get(0).close();
        display_posts();
        // reload();
    });
}
