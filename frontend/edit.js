// Page navigation function
function goTo(page) {
    switch (page) {
        case 'home':
            window.location.href = "home.html";
            break;
        case 'chat':
            window.location.href = "chat.html";
            break;
        case 'friends':
            window.location.href = "friends.html";
            break;
        case 'post':
            window.location.href = "post.html";
            break;
        case 'edit':
            window.location.href = "edit.html";
            break;
        default:
            alert(`Redirecting to ${page} page (not implemented yet)`);
    }
}

// Check user login status
function checkLogin() {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");
    return uid && token;
}

// Load current user info
function loadUserInfo() {
    if (!checkLogin()) {
        showMessage("Please log in first", "error");
        setTimeout(() => goTo("login"), 1500);
        return;
    }

    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    setLoadingState(true, "Loading user info...");

    fetch("http://localhost:8080/user/info/get", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        }
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                const user = data.detail;
                document.getElementById("username").value = user.username || "";
                document.getElementById("birthday").value = formatDateForInput(user.birthday);
                document.getElementById("gender").value = user.gender;
                document.getElementById("education").value = user.education;
                document.getElementById("nationality").value = user.nationality;
                document.getElementById("bio").value = user.bio || "";

                if (user.hasImage && user.imageId) {
                    document.getElementById("avatar").src = `http://localhost:8080/image/download/${user.imageId}`;
                } else {
                    document.getElementById("avatar").src = "avatar-placeholder.png";
                }
            } else {
                showMessage("Failed to load user info: " + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Request failed", "error");
        });
}

// Save user info
function saveUserInfo() {
    if (!checkLogin()) return;

    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    const username = document.getElementById("username").value.trim();
    const gender = document.getElementById("gender").value;
    //const birthday = document.getElementById("birthday").value;
    const birthdayInput = document.getElementById("birthday").value;
    const birthday = new Date(birthdayInput + 'T00:00:00'); // Forcibly set to midnight local time
    const birthdayStr = birthday.toISOString().substring(0, 10); // Take the first 10 digits yyyy-MM-dd
    const education = document.getElementById("education").value;
    const nationality = document.getElementById("nationality").value;
    const bio = document.getElementById("bio").value.trim();
    const passwordInput = document.getElementById("password");

    if (!username) {
        showMessage("Username cannot be empty", "error");
        return;
    }

    const userData = {
        username,
        gender,
        birthday:birthdayStr,
        education,
        nationality,
        bio
    };

    // Set the avatar field
    const imageId = localStorage.getItem("imageId");
    if (imageId) {
        userData.hasImage = 1;
        userData.imageId = Number(imageId);
    }

    // Set the password field
    if (passwordInput && passwordInput.value) {
        userData.password = passwordInput.value;
        localStorage.setItem("password", passwordInput.value); // Synchronous caching
    }

    setLoadingState(true, "Saving...");

    fetch("http://localhost:8080/user/info/update", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify(userData)
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                showMessage("Saved successfully!", "success");
                setTimeout(() => goTo("home"), 1000);
            } else {
                showMessage("Failed to save：" + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Network error", "error");
        });
}

// Avatar upload logic
document.addEventListener('DOMContentLoaded', function () {
    const changeAvatarBtn = document.getElementById('change-avatar');
    const fileInput = document.getElementById('avatar-file');

    if (changeAvatarBtn && fileInput) {
        changeAvatarBtn.addEventListener('click', () => fileInput.click());

        fileInput.addEventListener('change', function () {
            if (fileInput.files && fileInput.files[0]) {
                const uid = localStorage.getItem("uid");
                const token = localStorage.getItem("token");

                const formData = new FormData();
                formData.append("file", fileInput.files[0]);

                setLoadingState(true, "Uploading avatar...");
                fetch("http://localhost:8080/image/upload", {
                    method: "POST",
                    headers: {
                        "uid": uid,
                        "token": token
                    },
                    body: formData
                })
                    .then(res => res.json())
                    .then(data => {
                        setLoadingState(false);
                        if (data.success && data.detail) {
                            const newImageId = data.detail;
                            localStorage.setItem("imageId", newImageId);
                            document.getElementById("avatar").src = `http://localhost:8080/image/download/${newImageId}`;
                            showMessage("Avatar uploaded successfully", "success");
                        } else {
                            showMessage("Failed to upload avatar: " + data.message, "error");
                        }
                    })
                    .catch(err => {
                        setLoadingState(false);
                        console.error(err);
                        showMessage("Upload failed. Please check your network.", "error");
                    });
            }
        });
    }

    // Password edit toggle
    const passwordInput = document.getElementById("password");
    const toggleBtn = document.getElementById("toggle-password-edit");
    let editingPassword = false;

    if (toggleBtn) {
        toggleBtn.addEventListener("click", function () {
            editingPassword = !editingPassword;
            passwordInput.disabled = !editingPassword;
            if (editingPassword) {
                passwordInput.value = "";
                toggleBtn.textContent = "Cancel";
                passwordInput.focus();
            } else {
                passwordInput.value = localStorage.getItem("password") || "";
                toggleBtn.textContent = "Edit Password";
            }
        });
    }

    const storedPwd = localStorage.getItem("password") || "";
    if (storedPwd && passwordInput) {
        passwordInput.value = storedPwd;
    }
});

function showMessage(text, type) {
    let messageElement = document.getElementById("floating-message");
    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.id = "floating-message";
        messageElement.style.position = "fixed";
        messageElement.style.top = "20px";
        messageElement.style.left = "50%";
        messageElement.style.transform = "translateX(-50%)";
        messageElement.style.padding = "10px 20px";
        messageElement.style.borderRadius = "5px";
        messageElement.style.zIndex = "1000";
        messageElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
        document.body.appendChild(messageElement);
    }
    messageElement.className = type;
    messageElement.textContent = text;
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.parentNode.removeChild(messageElement);
        }
    }, 3000);
}

function setLoadingState(isLoading, message = "") {
    let loadingElement = document.getElementById("loading-indicator");
    if (isLoading) {
        if (!loadingElement) {
            loadingElement = document.createElement("div");
            loadingElement.id = "loading-indicator";
            loadingElement.style.position = "fixed";
            loadingElement.style.top = "0";
            loadingElement.style.left = "0";
            loadingElement.style.width = "100%";
            loadingElement.style.height = "100%";
            loadingElement.style.backgroundColor = "rgba(0,0,0,0.5)";
            loadingElement.style.display = "flex";
            loadingElement.style.justifyContent = "center";
            loadingElement.style.alignItems = "center";
            loadingElement.style.zIndex = "2000";
            loadingElement.style.flexDirection = "column";
            loadingElement.style.color = "white";

            const spinner = document.createElement("div");
            spinner.className = "loading-indicator";
            loadingElement.appendChild(spinner);

            const messageText = document.createElement("div");
            messageText.textContent = message;
            messageText.style.marginTop = "15px";
            loadingElement.appendChild(messageText);

            document.body.appendChild(loadingElement);
            document.body.style.overflow = "hidden";
        }
    } else {
        if (loadingElement) {
            document.body.removeChild(loadingElement);
            document.body.style.overflow = "auto";
        }
    }
}

function formatDateForInput(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
}

window.onload = loadUserInfo;
