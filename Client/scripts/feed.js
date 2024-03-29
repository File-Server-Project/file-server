function showModal() {
    document.getElementById("overlay").style.display = "block";
}

function closeModal() {
    document.getElementById("overlay").style.display = "none";
}

//get URL query parameters
function getParamenter(parameterName) {
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

// Get all files
$(document).ready(function () {
    

    let userRole = getParamenter('userRole'); 
    // let userId = getParamenter('userId'); 

    console.log(userRole);
    // console.log(userId);
    if (userRole === 'admin'){
        // $("#show_modal_btn").css("display") = "block";
        // document.getElementById("show_modal_btn").style.display = "block";
        $("#show_modal_btn").css("display","block");

    }
    // else {
        
    // }
    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/allFiles',
        type: 'GET',
        success: function(files) {
            console.log(files);
            let grid = $('#grid');
            let gridContent = "";
            files.forEach(file => {
                gridContent = `
                <div id="row" class="row">
                    <div id="action_field" class="action_field">
                    <b id="${file.fileId}" class="download_btn" onclick="download(this.id)">Download</b>
                    <b id="${file.fileId}" class="send_email" onclick="fileToEmail(this.id)">Email</b>
                    </div>
                    <div id="title_field" class="title_field">${file.title}</div>
                    <div id="file_name_${file.fileId}" onclick="DownloadEmailCount(this.id)" class="file_name_field">${file.fileName}</div>
                    <div id="description_field" class="description_field">${file.description}</div>
                </div>
                `;
                grid.append(gridContent);
            });

        },
        error: function (err) {
            console.log(err);
        }
    })
});

//Get Specific files or files
$('#search_btn').click(function (e) {
    e.preventDefault();
    let searchInfo = {
        search: $('#search_input').val()
    }
    $("#grid").html("");
    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/fileSearch',
        type: 'POST',
        data: JSON.stringify(searchInfo),
        dataType: 'json',
        contentType: "application/json",
        success: function(files) {

            if (files.length !== 0) {
                console.log(files);
                let grid = $('#grid');
                let gridContent = "";
                files.forEach(file => {
                    
                    gridContent = `
                    <div id="row" class="row">
                        <div id="action_field" class="action_field"><p id="download_btn${file.fileId}" class="download_btn">Download</p>
                        <p id="${file.fileId}" class="send_email" onclick="fileToEmail(this.id)">Email</p></div>
                        <div id="title_field" class="title_field">${file.title}</div>
                        <div id="file_name_field" class="file_name_field" onclick="fileDownloadEmailCount(this.id)">${file.fileName}</div>
                        <div id="description_field" class="description_field">${file.description}</div>
                    </div>
                    `;
                    grid.append(gridContent);


                });
            }else{
                alert("No such FIle");
            }

        },
        error: function (err) {
            console.log(err);
        }
    })
});

// count the number of times a file has been downloaded and send to an email
const DownloadEmailCount = (click_id) => {
    let fileId = click_id.split("_")[2];
    // console.log(fileId);
    console.log("here")
    let countInput = {
        fileId : fileId
    }

    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/fileEmailCount',
        type: 'POST',
        data: JSON.stringify(countInput),
        dataType: 'json',
        contentType: "application/json",
        success: (result) => {
            console.log(result[0].emailCount);
            let emailCount = result[0].emailCount
            let downloadCount = result[1].downloadCount

            alert(`Email Count = ${emailCount} \nDownload Count = ${downloadCount}`);
           
        },
        error: (err) => {
            console.log(err);
        }

    });

}

// file to an email adress
const fileToEmail = (click_id) => {
    let fileId = click_id;
    // console.log(fileId);
    let recepientEmail = prompt("Receipient email");
    // console.log(recepientEmail);

    let emailInfo = {
        fileId: fileId,
        recepientEmail: recepientEmail
    };
    
    console.log(emailInfo);
    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/fileEmail',
        type: 'POST',
        data: JSON.stringify(emailInfo),
        dataType: 'json',
        contentType: "application/json",
        success: (result) => {
            console.log(result);
            if(result) alert("File Sent to " + recepientEmail);
           
        },
        error: (err) => {
            console.log(err);
        }

    });

}

//download a file
const download = (click_id) => {

    let fileId = click_id;
    let fileName = $(`#file_name_${fileId}`).text();
    console.log(fileId);
    console.log(fileName);


    window.location.href = `https://fileserverapi.herokuapp.com/fileDownload?fileName=${fileName}&fileId=${fileId}`;

}

//Upload a file
$('#upload_form').submit(function (e) {
    e.preventDefault();
    const form_data = new FormData(upload_form);

    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/fileUpload',
        type: 'POST',

        cache: false,
        // "multipart/form-data",
        contentType: false,
        processData: false,
        data: form_data,
        enctype: 'multipart/form-data',
        
        success: function(files) {
            console.log("FIle uploaded");
            alert("FIle uploaded");


        },
        error: function (err) {
            console.log(err);
        }
    })

});
