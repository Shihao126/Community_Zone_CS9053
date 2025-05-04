function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const gender = document.getElementById("gender").value;
    const birthday = document.getElementById("birthday").value;
    const education = document.getElementById("education").value;
    const nationality = document.getElementById("nationality").value;
    const message = document.getElementById("message");

    if (!username || !password) {
        message.style.color = "red";
        message.textContent = "Please fill in the username and password";
        return;
    }

    fetch("http://localhost:8080/user/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username, password, gender, birthday, education, nationality
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                message.style.color = "green";
                message.textContent = "Registration successful! It is redirecting to the login page...";
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1500);
            } else {
                message.style.color = "red";
                message.textContent = "Registration failed：" + data.message;
            }
        })
        .catch(err => {
            console.error(err);
            message.style.color = "red";
            message.textContent = "Request error";
        });
}
