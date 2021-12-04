const customers = firebase.database().ref("Customer Information");

firebase.auth().onAuthStateChanged(user => {
    if (!user) window.location = "../login.html";
});

function initDatatable() {
	if ($.fn.DataTable.isDataTable("#example1")) {
		$("#example1").DataTable().destroy();
	}

	$("#example1").DataTable({
		"responsive": true,
		"lengthChange": false,
		"autoWidth": false
	});
}

function openClientModal(action, clientId) {
	if (action === "add") {
		$("#customerModal .modal-title").html("Add Client");
		$("#customerModal input").val("");
		$("#customerModal form").on("submit", () => { saveClient(); });
	} else if (action === "update") {
		$("#customerModal .modal-title").html("Update Client");

		customers.once("value", snapshot => {
			const clientInfo = snapshot.val()[clientId];
			$("#txtFirstName").val(clientInfo.firstName);
			$("#txtMiddleName").val(clientInfo.middleName);
			$("#txtLastName").val(clientInfo.lastName);
			$("#txtAddress").val(clientInfo.address);
			$("#txtMobile").val(clientInfo.mobile);
			$("#txtEmail").val(clientInfo.email);
			$("#txtPassword").val(clientInfo.password);
		});

		$("#customerModal form").on("submit", () => { saveClient(clientId); });
	}
}

async function saveClient(id) {
	$("#customerModal").modal("toggle");

	var clientId = id || "customer1";
	if (!id) {
		await customers.once("value", snapshot => {
			var recordCount = Object.keys(snapshot?.val() || {}).length;
			if (recordCount) {
				for (var i=1; i<=recordCount+1; i++) {
					if (!snapshot.val()["customer"+i]) {
						clientId = "customer"+i;
						break;
					}
				}
			}
		});
	}

	customers.child(clientId).set({
		firstName: $("#txtFirstName").val(),
		middleName: $("#txtMiddleName").val(),
		lastName: $("#txtLastName").val(),
		address: $("#txtAddress").val(),
		mobile: $("#txtMobile").val(),
		email: $("#txtEmail").val(),
		password: $("#txtPassword").val(),
	});

	displayRecord();
}

function deleteClient(clientId) {
	customers.child(clientId).remove();
	displayRecord();
}

function displayRecord() {
	customers.once("value", snapshot => {
		if (snapshot.val()) {
			$("#example1 tbody").html("");
			$.each(snapshot.val(), function(k, v) {
				$("#example1 tbody").append(`
					<tr>
						<td>${v.firstName}</td>
						<td>${v.middleName}</td>
						<td>${v.lastName}</td>
						<td>${v.address}</td>
						<td>${v.mobile}</td>
						<td><i style="color: blue"><u>${v.email}</u></i></td>
						<td><i style="color: blue"><u>${v.password}</u></i></td>
						<td>
							<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#customerModal" onclick="openClientModal('update', '${k}')">
								<i class="fa fa-pencil-alt"></i>
							</button>
							<button type="button" class="btn btn-danger btn-xs" onclick="deleteClient('${k}')">
								<i class="fa fa-trash"></i>
							</button>
						</td>
					</tr>
				`);
			});
		} else {
			initDatatable();
		}
	});
}

$(function() {
	initDatatable();
	displayRecord();
	$("form").submit(e => { e.preventDefault(); });
});
