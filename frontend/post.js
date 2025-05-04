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
            alert(`Redirecting to ${page} page (not yet implemented)`);
    }
}

// Check user login status
function checkLogin() {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) {
        alert("Not logged in, redirecting to login page");
        window.location.href = "login.html";
        return false;
    }
    return true;
}

// Submit a new post
function submitNewPost() {
    // Check if the user is logged in
    if (!checkLogin()) return;

    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const permission = document.getElementById('post-permission').value;
    const imageFile = document.getElementById('post-image').files[0];

    // Form validation
    if (!title) {
        showMessage('Please enter a title', 'error');
        return;
    }

    if (!content) {
        showMessage('Please enter content', 'error');
        return;
    }

    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    // Show loading indicator
    setLoadingState(true);

    // If an image is selected, upload it first
    if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);

        fetch('http://localhost:8080/image/upload', {
            method: 'POST',
            headers: {
                'uid': uid,
                'token': token
            },
            body: formData
        })
            .then(res => res.json())
            .then(imageData => {
                if (imageData.success) {
                    // Image uploaded successfully, proceed to submit the blog post
                    submitBlogWithImage(title, content, permission, imageData.detail);
                } else {
                    setLoadingState(false);
                    showMessage('Image upload failed: ' + imageData.message, 'error');
                }
            })
            .catch(err => {
                setLoadingState(false);
                console.error(err);
                showMessage('Network error, please try again later', 'error');
            });
    } else {
        // No image, submit the blog post directly
        submitBlogWithImage(title, content, permission, null);
    }
}

// Submit blog post (with or without image)
function submitBlogWithImage(title, content, permission, imageId) {
    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    fetch('http://localhost:8080/blog/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'uid': uid,
            'token': token
        },
        body: JSON.stringify({
            title: title,
            content: content,
            hasImage: imageId ? 1 : 0,
            imageId: imageId,
            permission: permission
        })
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                showMessage('Post published successfully', 'success');
                // Delay redirect to home page
                setTimeout(() => {
                    goTo('home');
                }, 1500);
            } else {
                showMessage('Post failed: ' + data.message, 'error');
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage('Network error, please try again later', 'error');
        });
}

// Display message popup
function showMessage(text, type) {
    const messageElement = document.createElement("div");
    messageElement.id = "floating-message";
    messageElement.className = type;
    messageElement.textContent = text;
    messageElement.style.position = "fixed";
    messageElement.style.top = "20px";
    messageElement.style.left = "50%";
    messageElement.style.transform = "translateX(-50%)";
    messageElement.style.padding = "10px 20px";
    messageElement.style.borderRadius = "5px";
    messageElement.style.zIndex = "1000";
    document.body.appendChild(messageElement);
    setTimeout(() => document.body.removeChild(messageElement), 3000);
}

// Show or hide loading overlay
function setLoadingState(isLoading) {
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

            const spinner = document.createElement("div");
            spinner.className = "loading-indicator";
            loadingElement.appendChild(spinner);

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

// Image preview functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check login status on page load
    checkLogin();

    // Set up image preview when user selects a file
    const imageInput = document.getElementById('post-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview image" class="preview-image">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }
});
