firebase.auth().onAuthStateChanged(user => {
    if (!user) window.location = "../login.html";
});

$(function () {
	$("#example1").DataTable({
		"responsive": true, "lengthChange": false, "autoWidth": false,
		"buttons": [""]
	}).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
});
