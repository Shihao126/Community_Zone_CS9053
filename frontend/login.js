function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const message = document.getElementById("message");

    if (!username || !password) {
        message.textContent = "Please enter username and password";
        return;
    }

    fetch("http://localhost:8080/user/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                message.style.color = "green";
                message.textContent = "Login successful!";
                console.log("UID:", data.detail.uid);
                console.log("Token:", data.detail.token);
                // Store UID and token in localStorage for later use
                localStorage.setItem("uid", data.detail.uid);
                localStorage.setItem("token", data.detail.token);
                window.location.href = "home.html";
            } else {
                message.style.color = "red";
                message.textContent = "Login failed: " + data.message;
            }
        })
        .catch(err => {
            console.error(err);
            message.style.color = "red";
            message.textContent = "Request error";
        });
}
