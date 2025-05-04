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
            alert(`Redirecting to ${page} (not yet implemented)`);
    }
}

// Load user information
function loadUserInfo() {
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) {
        alert("Not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }

    // Display the loading status
    setLoadingState(true);

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
                document.getElementById("uid").textContent = user.uid;
                document.getElementById("username").textContent = user.username;
                document.getElementById("gender").textContent = formatGender(user.gender);
                document.getElementById("birthday").textContent = formatDate(user.birthday);
                document.getElementById("education").textContent = formatEducation(user.education);
                document.getElementById("nationality").textContent = formatNationality(user.nationality);

                if (user.bio) {
                    document.getElementById("bio").textContent = user.bio;
                }

                // Set the avatar (use imageId to concatenate the download address)
                if (user.hasImage && user.imageId) {
                    document.getElementById("avatar").src = `http://localhost:8080/image/download/${user.imageId}`;
                } else {
                    document.getElementById("avatar").src = "avatar-placeholder.png";
                }
            } else {
                showMessage("Failed to fetch user info: " + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Request error. Please check your network connection.", "error");
        });
}

// Load blog posts (with filtering logic)
function loadBlogPosts() {
    //Obtain the screening conditions
    const timeStart = document.getElementById("timeStart").value;
    const timeEnd = document.getElementById("timeEnd").value;
    const access = document.getElementById("access").value;

    // Obtain the status of the permission filter checkbox
    const privateChecked = document.getElementById("privateTag").checked;
    const friendChecked = document.getElementById("friendTag").checked;
    const publicChecked = document.getElementById("publicTag").checked;

    // Modification: Always request posts of all permission types from the back end and filter them on the front end
    const privateTag = 1;
    const friendTag = 1;
    const publicTag = 1;

    // Verify time filtering
    if (timeStart && timeEnd && new Date(timeStart) > new Date(timeEnd)) {
        showMessage("The starting time cannot be later than the ending time", "error");
        return;
    }

    // Prepare the request
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    if (!uid || !token) {
        alert("Not logged in. Redirecting to login page.");
        window.location.href = "login.html";
        return;
    }

    // Display the loading status
    setLoadingState(true);
    const postList = document.getElementById("postList");
    postList.innerHTML = '<div class="loading-posts">Loading...</div>';

    // Build request parameters - Always request all types of posts
    const requestData = {
        uid: uid,
        privateTag: privateTag,
        friendTag: friendTag,
        publicTag: publicTag,
        startTime: timeStart || null,
        endTime: timeEnd || null
    };

    console.log("Filter conditions:", {
        privateChecked: privateChecked,
        friendChecked: friendChecked,
        publicChecked: publicChecked,
        requestData: requestData
    });

    // Send a request
    fetch("http://localhost:8080/blog/get_with_parameter", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify(requestData)
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                // Pass the filter conditions selected by the user to the displayPosts function
                displayPosts(data.detail, access, {
                    privateTag: privateChecked,
                    friendTag: friendChecked,
                    publicTag: publicChecked
                });
            } else {
                showMessage("Failed to load posts: " + data.message, "error");
                postList.innerHTML = '<div class="post-placeholder"><p class="placeholder-text">Failed to load posts</p></div>';
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Request error. Please check your network connection.", "error");
            postList.innerHTML = '<div class="post-placeholder"><p class="placeholder-text">Network error</p></div>';
        });
}

// Global variable: Saves the current blog data
let currentBlogs = [];

// Display blog posts
function displayPosts(blogData, access, filterSettings) {
    const postList = document.getElementById("postList");
    const uid = localStorage.getItem("uid");
    const blogs = [];

    // Convert HashMap to array
    if (blogData && blogData.list && blogData.size > 0) {
        for (let i = 0; i < blogData.size; i++) {
            blogs.push(blogData.list[i]);
        }
    }

    // Save blog data for use during editing
    currentBlogs = blogs;

    if (blogs && blogs.length > 0) {
        // Sorted by release time, the latest ones are displayed at the top
        blogs.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));

        // Filtering the posts
        const filteredBlogs = blogs.filter(blog => {
            // If only viewing oneself, then only one's own posts will be displayed
            if (access === 'self' && blog.uid != uid) {
                return false;
            }

            // If you access all the posts, filter out the private posts that do not belong to you
            if (access === 'all' && blog.permission === 'PRIVATE' && blog.uid != uid) {
                return false;
            }

            // Filter based on the permission type selected by the user
            if (blog.permission === 'PRIVATE' && !filterSettings.privateTag) {
                return false;
            }
            if (blog.permission === 'FRIEND' && !filterSettings.friendTag) {
                return false;
            }
            if (blog.permission === 'PUBLIC' && !filterSettings.publicTag) {
                return false;
            }

            return true;
        });

        console.log("Filtered posts:", filteredBlogs.map(b => ({
            id: b.id,
            title: b.title,
            permission: b.permission
        })));

        if (filteredBlogs.length === 0) {
            postList.innerHTML = '<div class="post-placeholder"><p class="placeholder-text">No posts matched the filters</p></div>';
            return;
        }

        let postsHTML = "";
        filteredBlogs.forEach(blog => {
            const isMyPost = blog.uid == uid;
            const createTime = new Date(blog.createTime).toLocaleString('zh-CN');

            // Set different styles according to the permission type
            let permissionClass = "";
            let permissionText = "";
            switch (blog.permission) {
                case "PRIVATE":
                    permissionClass = "permission-private";
                    permissionText = "Private";
                    break;
                case "FRIEND":
                    permissionClass = "permission-friend";
                    permissionText = "Friends Only";
                    break;
                case "PUBLIC":
                    permissionClass = "permission-public";
                    permissionText = "Public";
                    break;
            }

            postsHTML += `
                <div class="post-item ${permissionClass}" id="post-${blog.id}">
                    <div class="post-header">
                        <div class="post-author">
                            <img src="${blog.userHasImage ? `http://localhost:8080/image/download/${blog.userImageId}` : 'avatar-placeholder.png'}" 
                                class="author-avatar" alt="Avata"
                                onerror="this.src='avatar-placeholder.png';">
                            <div class="author-info">
                                <span class="author-name">${blog.username}</span>
                                <span class="post-time">${createTime}</span>
                            </div>
                        </div>
                        <span class="post-permission">${permissionText}</span>
                    </div>
                    <div class="post-title">${blog.title}</div>
                    <div class="post-content">${blog.content}</div>
                    ${blog.hasImage ? `
                    <div class="post-image">
                        <a href="http://localhost:8080/image/download/${blog.imageId}" target="_blank">
                            <img src="http://localhost:8080/image/download/${blog.imageId}" 
                                alt="Post image" class="blog-thumbnail"
                                onerror="this.style.display='none';">
                        </a>
                    </div>` : ''}
                    <div class="post-footer">
                        <button class="comment-btn" onclick="viewComments(${blog.id})">View Comments</button>
                        ${isMyPost ? `
                        <div class="post-actions">
                        <button class="edit-btn" onclick="editPost(${blog.id})">Edit</button>
                            <button class="delete-btn" onclick="deletePost(${blog.id})">Delete</button>    
                        </div>` : ''}
                    </div>
                    <div id="comments-${blog.id}" class="comments-section" style="display: none;"></div>
                </div>
            `;
        });

        postList.innerHTML = postsHTML;
    } else {
        postList.innerHTML = '<div class="post-placeholder"><p class="placeholder-text">No posts available</p></div>';
    }
}

// Toggle comment section
function viewComments(blogId) {
    const commentsSection = document.getElementById(`comments-${blogId}`);
    const isHidden = commentsSection.style.display === 'none';

    if (isHidden) {
        // Display the loading status
        commentsSection.style.display = 'block';
        commentsSection.innerHTML = '<div class="loading-comments">Loading comments...</div>';

        // Get comments
        const uid = localStorage.getItem("uid");
        const token = localStorage.getItem("token");

        fetch(`http://localhost:8080/blog/comment/get/${blogId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "uid": uid,
                "token": token
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    displayComments(blogId, data.detail);
                } else {
                    commentsSection.innerHTML = '<div class="comment-error">Failed to load comments</div>';
                }
            })
            .catch(err => {
                console.error(err);
                commentsSection.innerHTML = '<div class="comment-error">Network error</div>';
            });
    } else {
        // Hide comments
        commentsSection.style.display = 'none';
    }
}

// Render comments
function displayComments(blogId, commentData) {
    const commentsSection = document.getElementById(`comments-${blogId}`);
    const comments = [];

    // Convert the HashMap structure to an array
    if (commentData && commentData.list && commentData.size > 0) {
        for (let i = 0; i < commentData.size; i++) {
            comments.push(commentData.list[i]);
        }
    }

    if (comments && comments.length > 0) {
        // Sort by time
        comments.sort((a, b) => new Date(a.createTime) - new Date(b.createTime));

        let commentsHTML = '<div class="comments-list">';
        comments.forEach(comment => {
            const commentTime = new Date(comment.createTime).toLocaleString('en-US');
            const imageUrl = comment.hasImage && comment.imageId
                ? `http://localhost:8080/image/download/${comment.imageId}`
                : 'avatar-placeholder.png';

            commentsHTML += `
                <div class="comment-item">
                    <div class="comment-header">
                        <span class="author-name">${comment.username}</span>
                        <span class="comment-time">${commentTime}</span>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                </div>
            `;
        });

        // Add the comment form
        commentsHTML += `
            <div class="comment-form">
                <textarea id="comment-input-${blogId}" placeholder="Write a comment..." rows="2"></textarea>
                <button onclick="submitComment(${blogId})">Send</button>
            </div>
        `;

        commentsHTML += '</div>';
        commentsSection.innerHTML = commentsHTML;
    } else {
        // Display the comment form when there are no comments
        commentsSection.innerHTML = `
            <div class="comments-list">
                <div class="no-comments">No comments yet</div>
                <div class="comment-form">
                    <textarea id="comment-input-${blogId}" placeholder="Write a comment..." rows="2"></textarea>
                    <button onclick="submitComment(${blogId})">Send</button>
                </div>
            </div>
        `;
    }
}

// Submit a comment
function submitComment(blogId) {
    const commentInput = document.getElementById(`comment-input-${blogId}`);
    const commentContent = commentInput.value.trim();

    if (!commentContent) {
        showMessage("Comment cannot be empty", "error");
        return;
    }

    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    // Display the loading status
    setLoadingState(true);

    fetch("http://localhost:8080/blog/comment/submit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify({
            blogId: blogId,
            content: commentContent
        })
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                showMessage("Comment posted successfully", "success");
                commentInput.value = "";
                // Reload the comment
                viewComments(blogId);
            } else {
                showMessage("Failed to post comment: " + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Network error. Please try again later.", "error");
        });
}

// Edit a post
function editPost(blogId) {
    // Obtain the current post data
    const blog = currentBlogs.find(b => b.id === blogId);
    if (!blog) {
        showMessage("Post data not found", "error");
        return;
    }

    // Obtain the post element
    const postElement = document.getElementById(`post-${blogId}`);
    if (!postElement) {
        showMessage("Post element not found", "error");
        return;
    }

    // Save the original content for restoration when editing is cancelled
    postElement.setAttribute('data-original', postElement.innerHTML);

    // 构建编辑表单
    const permissionOptions = [
        { value: "PRIVATE", text: "Private", selected: blog.permission === "PRIVATE" },
        { value: "FRIEND", text: "Friends Only", selected: blog.permission === "FRIEND" },
        { value: "PUBLIC", text: "Public", selected: blog.permission === "PUBLIC" }
    ];

    const editFormHTML = `
        <div class="edit-post-form">
            <div class="form-group">
                <label for="edit-title-${blogId}">Title:</label>
                <input type="text" id="edit-title-${blogId}" value="${blog.title}" class="edit-title-input">
            </div>
            <div class="form-group">
                <label for="edit-content-${blogId}">Content:</label>
                <textarea id="edit-content-${blogId}" rows="4" class="edit-content-textarea">${blog.content}</textarea>
            </div>
            <div class="form-group">
                <label for="edit-permission-${blogId}">Visibility:</label>
                <select id="edit-permission-${blogId}" class="edit-permission-select">
                    ${permissionOptions.map(option =>
        `<option value="${option.value}" ${option.selected ? 'selected' : ''}>${option.text}</option>`
    ).join('')}
                </select>
            </div>
            <div class="edit-actions">
                <button class="cancel-btn" onclick="cancelEdit(${blogId})">Cancel</button>
                <button class="save-btn" onclick="saveEditedPost(${blogId})">Save</button>
            </div>
        </div>
    `;

    // Replace the post content with the edit form
    postElement.innerHTML = editFormHTML;
}

// Cancel editing
function cancelEdit(blogId) {
    const postElement = document.getElementById(`post-${blogId}`);
    if (!postElement) return;

    // Restore the original content
    const originalHTML = postElement.getAttribute('data-original');
    if (originalHTML) {
        postElement.innerHTML = originalHTML;
    } else {
        // If the original content is not saved, reload the post list
        loadBlogPosts();
    }
}

// Save the edited post
function saveEditedPost(blogId) {
    // Obtain the edited data
    const title = document.getElementById(`edit-title-${blogId}`).value.trim();
    const content = document.getElementById(`edit-content-${blogId}`).value.trim();
    const permission = document.getElementById(`edit-permission-${blogId}`).value;

    // Basic verification
    if (!title || !content) {
        showMessage("Title and content cannot be empty", "error");
        return;
    }

    // Obtain the original post data
    const originalBlog = currentBlogs.find(b => b.id === blogId);
    if (!originalBlog) {
        showMessage("Original post data not found", "error");
        return;
    }

    // Preparation for request data
    const updatedBlog = {
        id: blogId,
        title: title,
        content: content,
        permission: permission,
        hasImage: originalBlog.hasImage,
        imageId: originalBlog.imageId,
        uid: originalBlog.uid
    };

    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    // Display the loading status
    setLoadingState(true);

    // Send an update request
    fetch("http://localhost:8080/blog/edit", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify(updatedBlog)
    })
        .then(res => res.json())
        .then(data => {
            setLoadingState(false);
            if (data.success) {
                showMessage("Post updated successfully", "success");
                // Reload the post list to display the updated content
                loadBlogPosts();
            } else {
                showMessage("Update failed: " + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Network error. Please try again later.", "error");
        });
}

// Delete a Post
function deletePost(blogId) {
    if (!confirm("Are you sure you want to delete this post?")) return;

    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");

    // Display the loading status
    setLoadingState(true);

    fetch(`http://localhost:8080/blog/delete/${blogId}`, {
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
                showMessage("Post deleted successfully", "success");
                // Reload the post list
                loadBlogPosts();
            } else {
                showMessage("Delete failed: " + data.message, "error");
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage("Network error. Please try again later.", "error");
        });
}

// Submit a new post
function submitNewPost() {
    const title = document.getElementById('post-title').value.trim();
    const content = document.getElementById('post-content').value.trim();
    const permission = document.getElementById('post-permission').value;
    const imageFile = document.getElementById('post-image').files[0];

    if (!title || !content) {
        showMessage('Title and content cannot be empty', 'error');
        return;
    }

    const uid = localStorage.getItem('uid');
    const token = localStorage.getItem('token');

    if (!uid || !token) {
        alert('Not logged in. Redirecting to login page.');
        window.location.href = 'login.html';
        return;
    }

    // Display the loading status
    setLoadingState(true);

    // If there are pictures, upload them first
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
                    // The picture was uploaded successfully. Continue to submit the blog
                    submitBlogWithImage(title, content, permission, imageData.detail);
                } else {
                    setLoadingState(false);
                    showMessage('Image upload failed: ' + imageData.message, 'error');
                }
            })
            .catch(err => {
                setLoadingState(false);
                console.error(err);
                showMessage('Network error. Please try again later.', 'error');
            });
    } else {
        // If there are no pictures, just submit the blog directly
        submitBlogWithImage(title, content, permission, null);
    }
}

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
                // Clear the form
                document.getElementById('post-title').value = '';
                document.getElementById('post-content').value = '';
                document.getElementById('post-permission').value = 'PUBLIC';
                document.getElementById('post-image').value = '';
                document.getElementById('image-preview').innerHTML = '';
                // Reload the post list
                loadBlogPosts();
            } else {
                showMessage('Publish failed: ' + data.message, 'error');
            }
        })
        .catch(err => {
            setLoadingState(false);
            console.error(err);
            showMessage('Network error. Please try again later.', 'error');
        });
}

// Submit the screening conditions
function submitFilter() {
    loadBlogPosts();
    showMessage("Filters applied", "success");
}

// Show floating message
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

// Loading overlay
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

// Format conversion tool function
function formatGender(gender) {
    return { 'male': 'Male', 'female': 'Female', 'other': 'Other' }[gender] || gender;
}

function formatDate(dateString) {
    if (!dateString) return 'Not set';
    try {
        return new Date(dateString).toLocaleDateString('en-US');
    } catch {
        return dateString;
    }
}

function formatEducation(education) {
    return { 'Bachelor': 'Bachelor', 'Master': 'Master', 'PhD': 'PhD', 'Other': 'Other' }[education] || education;
}

function formatNationality(nationality) {
    return { 'CN': 'China', 'US': 'United States', 'UK': 'United Kingdom', 'JP': 'Japan', 'Other': 'Other' }[nationality] || nationality;
}


// Picture preview
document.addEventListener('DOMContentLoaded', function() {
    const imageInput = document.getElementById('post-image');
    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('image-preview').innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-thumbnail">`;
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

// Initialize data on page load
window.onload = function () {
    loadUserInfo();

    const now = new Date();
    const oneWeekAgo = new Date(now);
    oneWeekAgo.setDate(now.getDate() - 7);

    const timeStartInput = document.getElementById("timeStart");
    const timeEndInput = document.getElementById("timeEnd");

    timeStartInput.value = formatDateTimeLocal(oneWeekAgo);
    timeEndInput.value = formatDateTimeLocal(now);

    loadBlogPosts();
};

function formatDateTimeLocal(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${d}T${hh}:${mm}`;
}