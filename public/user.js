function google_login() {
    var provider = new firebase.auth.GoogleAuthProvider();
    // firebase.auth().signInWithRedirect(provider);
    firebase.auth().signInWithPopup(provider).then(login_successful).catch(
        login_error);
}

function login_successful(result) {
    if (result.user == null) {
        return;
    }
    $('dialog#login-dialog').get(0).close();
    console.log("Signed in.");
    console.log(result);
    reload();
}

function login_error(error) {
    console.log(error);
    // reload();
}

function sign_out() {
    firebase.auth().signOut();
}
