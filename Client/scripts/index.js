$("#login_btn").click((e) => {
    e.preventDefault();

    let loginInfo = {
        email: $("#email").val(),
        password: $("#password").val()
    }
    // console.log(loginInfo);
    $.ajax({
        url: 'https://fileserverapi.herokuapp.com/login',
        type: 'POST',
        data: JSON.stringify(loginInfo),
        dataType: 'json',
        contentType: "application/json",
        success: (users) => {
            // console.log(result);
            if (users.length !== 0){
                users.forEach(user => {
                console.log(user.userRole);
                window.location.href = `https://fileserver-amalitech.herokuapp.com/templates/feed.html?userRole=${user.userRole}`;
                });
            } else {
                alert("Invalid User");
            } 
            
            
        },
        error: (err) => {
            console.log(err);
        }

    });
})