
$("#forgotPassword_btn").click((e) => {
    e.preventDefault();

    let forgotInfo = {
        email: $("#email").val(),
    }
    console.log(forgotInfo);
    // console.log(loginInfo);
    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/forgotPassword',
        type: 'POST',
        data: JSON.stringify(forgotInfo),
        dataType: 'json',
        contentType: "application/json",
        success: (result) => {
            console.log(result);
            if (result === 'Email sent'){
                alert('A verification link has been sent to your maill');
            } else {
                alert("Invalid User");
            } 
            
            
        },
        error: (err) => {
            console.log(err);
        }

    });
})