let uploads = localStorage.getItem("documents") ? JSON.parse(localStorage.getItem("documents")) : [];

const getDocumentList = () => {

    let documentListTable = document.getElementById("documentListBody");
    documentListTable.innerHTML = "";
    let htmlContent = "";
    for (let i = 0; i < uploads.length; i++) {
        let upload = uploads[i];
        htmlContent += `<tr><td>${upload.fileDescription}</td><td>${upload.fileName}</td><td><button class="btn btn-warning" onclick="editDocument(${upload.id})">Edit</button>&nbsp;<button class="btn btn-danger" onclick="deleteDocument(${upload.id})">Delete</button></td></tr>`;
    }
    documentListTable.innerHTML = htmlContent;
}

getDocumentList();

document.getElementById("uploadNowBtn").addEventListener("click", function () {
    let fileInput = document.getElementById("documentFile");
    let file = fileInput.files[0];
    let fileDescription = document.getElementById("documentLabel").value;

    if (fileDescription.trim() === "") {
        alert("Please fill in the file description");
        return;
    }
    if (file === undefined) {
        alert("Please select a file");
        return;
    }

    if (file) {
        let fileName = file.name;
        let upload = {
            id: Number(new Date()),
            fileName: fileName,
            fileDescription: fileDescription
        };
        uploads.push(upload);
        localStorage.setItem("documents", JSON.stringify(uploads));
        getDocumentList();
        $('#upload_file').modal('hide');
    }
});

const deleteDocument = (id) => {
    $('#deleteModal').modal('show');
    let inputField = document.getElementById('fileID');
    inputField.value = id;
}

document.querySelector(".confirm-delete").addEventListener("click", function () {
    let fileID = $("#deleteModal .modal-body input").val();
    let uploads = localStorage.getItem("documents") ? JSON.parse(localStorage.getItem("documents")) : [];
    let index = uploads.findIndex(function (upload) {
        return upload.id === Number(fileID);
    });
    if (index !== -1) {
        uploads.splice(index, 1);
    }
    localStorage.setItem("documents", JSON.stringify(uploads));
    getDocumentList();
    window.location.reload();
    $('#deleteModal').modal('hide');
});

const editDocument = (id) => {
    $('#editModal').modal('show');
    let idField = document.getElementById('edit_document_id');
    idField.value = id;

    let index = uploads.findIndex(function (upload) {
        return upload.id === Number(id);
    });
    let upload = uploads[index];
    document.getElementById('editDocumentLabel').value = upload.fileDescription;
}

document.getElementById("edit_document_save").addEventListener("click", function () {
    let fileDescription = document.getElementById('editDocumentLabel').value;
    let id = document.getElementById('edit_document_id').value;

    if (fileDescription.trim() === "") {
        alert("Please fill in the file description");
        return;
    }

    let index = uploads.findIndex(function (upload) {
        return upload.id === Number(id);
    });
    
    uploads[index].fileDescription = fileDescription;
    localStorage.setItem("documents", JSON.stringify(uploads));
    getDocumentList();
    $('#editModal').modal('hide');
});

$('#upload_file').on('hidden.bs.modal', function (e) {
    document.getElementById("fileDescription").value = "";
    document.getElementById("fileInput").value = "";
});

$('editModal').on('hidden.bs.modal', function (e) {
    document.getElementById('editDocumentLabel').value = "";
    document.getElementById('edit_document_id').value = "";
});