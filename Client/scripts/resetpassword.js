function getParamenter(parameterName) {
    let parameters = new URLSearchParams(window.location.search);
    return parameters.get(parameterName);
}

$(document).ready(() => {
    let email = getParamenter('email'); 
});

$("#reset_password_btn").click((e) => {
    e.preventDefault();
    let email = getParamenter('email'); 
    console.log(email);
    let newPassword = $("#new_password").val();
    let confirmPassword = $("#confirm_password").val();
    // alert('here');
    if (newPassword === confirmPassword) {
        let resetInfo = {
            email: email,
            newPassword: newPassword,
            confirmPassword:confirmPassword
        }
        console.log(resetInfo);
            $.ajax({
        url: 'https://fileserverapi.herokuapp.com/resetPassword',
        type: 'POST',
        data: JSON.stringify(resetInfo),
        dataType: 'json',
        contentType: "application/json",
        success: (users) => {
            window.location.href = `https://fileserver-amalitech.herokuapp.com/index.html`;
            alert("Password Reset Successful. You can now login");
            // console.log(users);
            // alert("Password Reset was Successful");
            // if (users.length !== 0){
            //     users.forEach(user => {
            //         console.log(user);
            //         // if(user.userRole = 'admin') {
            //             window.location.href = `http://127.0.0.1:5501/templates/feed.html?userRole=${user.userRole}`; //userId=${user.userId},username=${user.username},
            //         // }else {
            //             // window.location.href = `http://127.0.0.1:5501/templates/feed.html?userId=${user.userId},username=${user.username},userRole=${user.userRole}`;
            //         // }
            //     });
            // } else {
            //     alert("Password reset was Unsuccessful");
            // } 
            
            
        },
        error: (err) => {
            console.log(err);
        }

    });

    } else {
        alert("Password does not match");
    }
})