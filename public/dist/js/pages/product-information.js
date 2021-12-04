const products = firebase.database().ref("Product Information");

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

function openProductModal(action, productId) {
	if (action === "add") {
		$("#productModal .modal-title").html("Add Product");
		$("#productModal input").val("");
		$("#productModal form").on("submit", () => { saveProduct(); });
	} else if (action === "update") {
		$("#productModal .modal-title").html("Update Product"); 

		products.once("value", snapshot => {
			const productInfo = snapshot.val()[productId];
			$("#txtFile").val(productInfo.File);
			$("#txtCode").val(productInfo.Code);
			$("#txtCategory").val(productInfo.Category);
			$("#txtDescription").val(productInfo.Description);
			$("#txtDetails").val(productInfo.Details);
			$("#txtQuantity").val(productInfo.Quantity);
			$("#txtUnitPrice").val(productInfo.UnitPrice);
			
		});

		$("#productModal form").on("submit", () => { saveProduct(productId); });
	}
}

async function saveProduct(id) {
	$("#productModal").modal("toggle");

	var productId = id || "product1";
	if (!id) {
		await products.once("value", snapshot => {
			var recordCount = Object.keys(snapshot?.val() || {}).length;
			if (recordCount) {
				for (var i=1; i<=recordCount+1; i++) {
					if (!snapshot.val()["product"+i]) {
						productId = "product"+i;
						break;
					}
				}
			}
		});
	}

	products.child(productId).set({
		File: $("#txtFile").val(),
		Code: $("#txtCode").val(),
		Category: $("#txtCategory").val(),
		Description: $("#txtDescription").val(),
		Details: $("#txtDetails").val(),
		Quantity: $("#txtQuantity").val(),
		UnitPrice: $("#txtUnitPrice").val(),
	});

	displayRecord();
}

function deleteProduct(productId) {
	products.child(productId).remove();
	displayRecord();
}

function displayRecord() {
	products.once("value", snapshot => {
		if (snapshot.val()) {
			$("#example1 tbody").html("");
			$.each(snapshot.val(), function(k, v) {
				$("#example1 tbody").append(`
					<tr>
						<td>${v.File}</td>
						<td>${v.Code}</td>
						<td>${v.Category}</td>
						<td>${v.Description}</td>
						<td>${v.Details}</td>
						<td>${v.Quantity}</td>
						<td>${v.UnitPrice}</td>
						<td>
							<button type="button" class="btn btn-info btn-xs" data-toggle="modal" data-target="#productModal" onclick="openProductModal('update', '${k}')">
								<i class="fa fa-pencil-alt"></i>
							</button>
							<button type="button" class="btn btn-danger btn-xs" onclick="deleteProduct('${k}')">
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
