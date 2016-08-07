var dbURL = "https://menlo-ea5c9.firebaseio.com";

function database_get(location, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials,
        type: 'GET',
        success: callback
    });
}

function database_get_limited_to_last(location, amount, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials + '&limitToLast=' + encodeURIComponent(amount) + '&orderBy="$key"',
        type: 'GET',
        success: callback
    });
}


function database_set(location, value, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials,
        type: 'PUT',
        data: JSON.stringify(value),
        success: callback
    });
}

function database_push(location, value, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials,
        type: 'POST',
        data: JSON.stringify(value),
        success: callback
    });
}

function database_update(location, value, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials,
        type: 'PATCH',
        data: JSON.stringify(value),
        success: callback
    });
}

function database_delete(location, callback) {
    $.ajax({
        url: dbURL + '/' + location + '.json?auth=' + current_user.credentials,
        type: 'DELETE',
        success: callback
    });
}
