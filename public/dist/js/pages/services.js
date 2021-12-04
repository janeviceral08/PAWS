const services = firebase.database().ref("Services");

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

function openServiceModal(action, serviceId) {   
	if (action === "add") {
		$("#serviceModal .modal-title").html("Add Services");
		$("#serviceModal input").val("");
		$("#serviceModal form").on("submit", () => { saveServices(); });
	} else if (action === "update") {
		$("#serviceModal .modal-title").html("Update Services");

		services.once("value", snapshot => {
			const serviceInfo = snapshot.val()[serviceId];
			$("#txtCode").val(serviceInfo.Code);
			$("#txtCategory").val(serviceInfo.Category);
			$("#txtDescription").val(serviceInfo.Description);
			$("#txtDetails").val(serviceInfo.Details);
			$("#txtServiceFee").val(serviceInfo.ServiceFee);
		});

		$("#serviceModal form").on("submit", () => { saveServices(serviceId); });
	}
}

async function saveServices(id) {
	$("#serviceModal").modal("toggle");

	var serviceId = id || "service1";  
	if (!id) {
		await services.once("value", snapshot => {
			var recordCount = Object.keys(snapshot?.val() || {}).length;
			if (recordCount) {
				for (var i=1; i<=recordCount+1; i++) {
					if (!snapshot.val()["services"+i]) {
						serviceId = "services"+i;
						break;
					}
				}
			}
		});
	}

	services.child(serviceId).set({
		Code: $("#txtCode").val(),
		Category: $("#txtCategory").val(), 
		Description: $("#txtDescription").val(),
		Details: $("#txtDetails").val(),
		ServiceFee: $("#txtServiceFee").val(),
	});

	displayRecord();
}

function deleteService(serviceId) {
	services.child(serviceId).remove();
	displayRecord();
}

function displayRecord() {
	services.once("value", snapshot => {
		if (snapshot.val()) {
			$("#example1 tbody").html("");
			$.each(snapshot.val(), function(k, v) {
				$("#example1 tbody").append(`
					<tr>
						<td>${v.Code}</td>
						<td>${v.Category}</td>
						<td>${v.Description}</td>
						<td>${v.Details}</td>
						<td>${v.ServiceFee}</td>
						<td>
							<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#serviceModal" onclick="openServiceModal('update', '${k}')">
								<i class="fa fa-pencil-alt"></i>
							</button>
							<button type="button" class="btn btn-danger btn-xs" onclick="deleteService('${k}')">
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
