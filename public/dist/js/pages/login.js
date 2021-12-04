firebase.auth().onAuthStateChanged(user => {
	if (user) window.location = "client/appointment.html";
});

document.getElementById("signin").addEventListener("click", () => {
    var email = document.getElementById("inputEmail").value;
    var password = document.getElementById("inputPassword").value;

    firebase.auth().signInWithEmailAndPassword(email, password).then(userCredential => {
		window.location = "client/appointment.html";
    }).catch(error => {
		alert(error.message);
    });
});
