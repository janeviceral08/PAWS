const pets = firebase.database().ref("Pet Information");

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

function openPetModal(action, petId) {
	if (action === "add") {
		$("#petModal .modal-title").html("Add Pet");
		$("#petModal input").val("");
		$("#petModal form").on("submit", () => { savePet(); });
	} else if (action === "update") {
		$("#petModal .modal-title").html("Update Pet"); 

		pets.once("value", snapshot => {
			const petInfo = snapshot.val()[petId];
			$("#txtFile").val(petInfo.File);
			$("#txtCategory").val(petInfo.Category);
			$("#txtName").val(petInfo.Name);
			$("#txtDescription").val(petInfo.Description);
			$("#txtRecords").val(petInfo.Records);
			
		});

		$("#petModal form").on("submit", () => { savePet(petId); });
	}
}

async function savePet(id) {
	$("#petModal").modal("toggle");

	var petId = id || "pet1";
	if (!id) {
		await pets.once("value", snapshot => {
			var recordCount = Object.keys(snapshot?.val() || {}).length;
			if (recordCount) {
				for (var i=1; i<=recordCount+1; i++) {
					if (!snapshot.val()["pet"+i]) {
						petId = "pet"+i;
						break;
					}
				}
			}
		});
	}

	pets.child(petId).set({
		File: $("#txtFile").val(),
		Category: $("#txtCategory").val(),
		Name: $("#txtName").val(),
		Description: $("#txtDescription").val(),
		Records: $("#txtRecords").val(),
	});

	displayRecord();
}

function deletePet(petId) {
	pets.child(petId).remove();
	displayRecord();
}

function displayRecord() {
	pets.once("value", snapshot => {
		if (snapshot.val()) {
			$("#example1 tbody").html("");
			$.each(snapshot.val(), function(k, v) {
				$("#example1 tbody").append(`
					<tr>
						<td>${v.File}</td>
						<td>${v.Category}</td>
						<td>${v.Name}</td>
						<td>${v.Description}</td>
						<td>${v.Records}</td>
						<td>
							<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#petModal" onclick="openPetModal('update', '${k}')">
								<i class="fa fa-pencil-alt"></i>
							</button>
							<button type="button" class="btn btn-danger btn-xs" onclick="deletePet('${k}')">
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
