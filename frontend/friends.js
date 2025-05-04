// Page navigation function
function goTo(page) {
    window.location.href = `${page}.html`;
}

// Get user info from localStorage
const uid = localStorage.getItem("uid");
const token = localStorage.getItem("token");

// General data fetch function - handles BaseList structure
function fetchData(url, callback) {
    fetch(url, {
        method: "POST",
        headers: {
            "uid": uid,
            "token": token
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("API response:", url, data); // Debug log
            if (data.success) {
                // Convert BaseList HashMap to array
                if (data.detail && data.detail.list) {
                    const listArray = [];
                    for (let i = 0; i < data.detail.size; i++) {
                        listArray.push(data.detail.list[i]);
                    }
                    callback(listArray);
                } else {
                    callback(data.detail);
                }
            } else {
                showMessage(data.message || "Request failed", "error");
            }
        })
        .catch(err => {
            console.error("Request error:", err);
            showMessage("Network error, please try again later", "error");
        });
}

function renderUser(user, buttons = []) {
    const isRequester = user.uid === Number(uid);
    const displayUid = isRequester ? user.uid2 : user.uid;
    const displayUsername = isRequester ? user.username2 || user.username : user.username;
    const displayImageId = isRequester ? user.imageId2 || user.imageId : user.imageId;
    const hasImage = isRequester ? user.hasImage2 ?? user.hasImage : user.hasImage;

    return `<div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
    <img src="${hasImage ? `http://localhost:8080/image/download/${displayImageId}` : 'avatar-placeholder.png'}" style="width:40px;height:40px;border-radius:50%">
    <span>${displayUsername} (UID: ${displayUid})</span>
    ${buttons.join(' ')}
  </div>`;
}

// Global variable to store friend list
let myFriendsList = [];

// Load friend list
function loadFriends() {
    const friendList = document.getElementById("friend-list");
    friendList.innerHTML = '<div style="text-align:center;padding:10px;">Loading...</div>';

    fetchData("http://localhost:8080/friend/friendship/list", list => {
        console.log("Friend list data:", list);
        // Store the list of friends for use by other functions
        myFriendsList = list || [];

        if (list && list.length > 0) {
            friendList.innerHTML = list.map(f => {
                const otherUid = f.uid === Number(uid) ? f.uid2 : f.uid;
                return renderUser(f, [
                    `<button onclick="deleteFriend(${otherUid})" style="background-color:#f44336;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Delete</button>`
                ]);
            }).join('');
        } else {
            friendList.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">No friends yet</div>';
        }
    });
}

// Load received friend requests - auto-accept if already friends
function loadReceivedRequests() {
    const receivedRequests = document.getElementById("received-requests");
    receivedRequests.innerHTML = '<div style="text-align:center;padding:10px;">Loading...</div>';

    // Get the friends list first
    fetchData("http://localhost:8080/friend/friendship/list", friendsList => {
        const myFriends = friendsList || [];

        // Then obtain the received request
        fetchData("http://localhost:8080/friend/application/list", requestsList => {
            console.log("Received requests:", requestsList);

            if (requestsList && requestsList.length > 0) {
                // Check which requests come from users who are already friends
                const friendRequests = [];
                const pendingRequests = [];

                requestsList.forEach(request => {
                    const isAlreadyFriend = myFriends.some(friend =>
                        (friend.uid === request.uid && friend.uid2 === Number(uid)) ||
                        (friend.uid2 === request.uid && friend.uid === Number(uid))
                    );

                    if (isAlreadyFriend) {
                        friendRequests.push(request);
                    } else {
                        pendingRequests.push(request);
                    }
                });

                // Auto-accepting requests from existing friends
                if (friendRequests.length > 0) {
                    console.log("Auto-accepting requests from existing friends:", friendRequests);

                    // Process each request in sequence
                    const processNextRequest = (index) => {
                        if (index >= friendRequests.length) {
                            // All have been processed and the remaining requests are displayed
                            renderPendingRequests(pendingRequests);
                            return;
                        }

                        const request = friendRequests[index];
                        // Call the API to accept the request
                        fetch("http://localhost:8080/friend/judge", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "uid": uid,
                                "token": token
                            },
                            body: JSON.stringify({
                                uid: request.uid,
                                uid2: Number(uid),
                                status: "ACCEPTED"
                            })
                        })
                            .then(res => res.json())
                            .then(data => {
                                console.log(`Auto-accept result (${request.uid}):`, data);
                                // Handle the next request
                                processNextRequest(index + 1);
                            })
                            .catch(err => {
                                console.error(`Auto-accept failed (${request.uid}):`, err);
                                // If there is an error, continue to handle the next one
                                processNextRequest(index + 1);
                            });
                    };

                    // Start to handle the first request
                    processNextRequest(0);
                } else {
                    // There are no requests that need to be automatically accepted. The pending requests are directly displayed
                    renderPendingRequests(pendingRequests);
                }
            } else {
                receivedRequests.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">No requests received</div>';
            }
        });
    });

    // Render the request to be processed
    function renderPendingRequests(requests) {
        if (requests.length > 0) {
            receivedRequests.innerHTML = requests.map(f => {
                let avatarSrc = `http://localhost:8080/image/download/${f.uid === 1 ? 1 : (f.uid === 2 ? 5 : 6)}`;

                return `<div class="user-item" data-uid="${f.uid}" style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                    <img src="${avatarSrc}" 
                         style="width:40px;height:40px;border-radius:50%"
                         onerror="this.src='avatar-placeholder.png';">
                    <span>${f.username} (UID: ${f.uid})</span>
                    <button onclick="judge(${f.uid}, 'ACCEPTED')" style="background-color:#4CAF50;color:white;border:none;padding:5px 10px;border-radius:4px;margin-right:5px;cursor:pointer;">Accept</button>
                    <button onclick="judge(${f.uid}, 'REJECTED')" style="background-color:#f44336;color:white;border:none;padding:5px 10px;border-radius:4px;cursor:pointer;">Reject</button>
                </div>`;
            }).join('');
        } else {
            receivedRequests.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">No pending requests</div>';
        }
    }
}

// Handle friend request
function judge(uid1, status) {
    fetch("http://localhost:8080/friend/judge", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify({ uid: uid1, uid2: Number(uid), status })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage(status === "ACCEPTED" ? "Friend request accepted" : "Friend request rejected", "success");

                // If accept the request
                if (status === "ACCEPTED") {
                    // Remove the currently processed request element directly from the interface
                    const requestItem = document.querySelector(`#received-requests [data-uid="${uid1}"]`);
                    if (requestItem) {
                        requestItem.remove();
                    }

                    // Reload the friends list to display new friends
                    loadFriends();

                    // If there are no other requests, display "No requests for now".
                    const remainingRequests = document.querySelectorAll('#received-requests .user-item');
                    if (remainingRequests.length === 0) {
                        document.getElementById("received-requests").innerHTML =
                            '<div style="text-align:center;padding:10px;color:#666;">No pending requests</div>';
                    }
                } else {
                    // If the request is rejected, only the currently processed request element is removed
                    const requestItem = document.querySelector(`#received-requests [data-uid="${uid1}"]`);
                    if (requestItem) {
                        requestItem.remove();
                    }

                    // If there are no other requests, display "No requests for now".
                    const remainingRequests = document.querySelectorAll('#received-requests .user-item');
                    if (remainingRequests.length === 0) {
                        document.getElementById("received-requests").innerHTML =
                            '<div style="text-align:center;padding:10px;color:#666;">No pending requests</div>';
                    }
                }
            } else {
                showMessage("Action failed：" + data.message, "error");
            }
        })
        .catch(err => {
            console.error("Failed to process friend request:", err);
            showMessage("Network error, please try again later", "error");
        });
}
// Delete a friend
function deleteFriend(otherId) {
    if (!confirm("Are you sure you want to delete this friend?")) return;

    fetch("http://localhost:8080/friend/friendship/delete", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify({ uid2: otherId })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage("Friend deleted successfully", "success");
                loadFriends();
            } else {
                showMessage("Delete failed: " + data.message, "error");
            }
        })
        .catch(err => {
            console.error("Failed to delete friend:", err);
            showMessage("Network error, please try again later", "error");
        });
}

// Load sent friend requests - fix avatar flicker issue
function loadSentRequests() {
    const sentRequests = document.getElementById("sent-requests");
    sentRequests.innerHTML = '<div style="text-align:center;padding:10px;">Loading...</div>';

    fetch("http://localhost:8080/friend/request/list", {
        method: "POST",
        headers: {
            "uid": uid,
            "token": token
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log("API response:", data);

            if (data.success && data.detail) {
                // Handle the BaseList structure
                let list = [];
                if (data.detail.list) {
                    // Convert the HashMap to an array
                    for (let i = 0; i < data.detail.size; i++) {
                        list.push(data.detail.list[i]);
                    }
                } else if (Array.isArray(data.detail)) {
                    list = data.detail;
                }

                if (list.length > 0) {
                    // Render List
                    sentRequests.innerHTML = list.map(f => {
                        // Since it is known that the uid2 user has an avatar in the database, the avatar is directly obtained using the recipient's UID
                        // Make sure not to use the logic that depends on fields such as hasImage2, because the API may not return these fields
                        let avatarSrc = `http://localhost:8080/image/download/${f.uid2 === 1 ? 1 : (f.uid2 === 2 ? 5 : 6)}`;

                        return `<div style="display: flex; align-items: center; gap: 10px; margin: 10px 0;">
                        <img src="${avatarSrc}" 
                             style="width:40px;height:40px;border-radius:50%"
                             onerror="this.src='avatar-placeholder.png';">
                        <span>${f.username2} (UID: ${f.uid2})</span>
                        <span style="color: ${getStatusColor(f.status)};padding:5px 10px;border-radius:4px;">Status：${formatStatus(f.status)}</span>
                    </div>`;
                    }).join('');
                } else {
                    sentRequests.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">No requests sent</div>';
                }
            } else {
                sentRequests.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">No requests sent</div>';
            }
        })
        .catch(err => {
            console.error("Failed to load sent requests:", err);
            sentRequests.innerHTML = '<div style="text-align:center;padding:10px;color:#666;">Load failed, please refresh</div>';
        });
}


// Send a friend request
function sendFriendRequest() {
    const input = document.getElementById("search-user").value.trim();
    if (!input) {
        showMessage("Please enter a username or UID", "error");
        return;
    }

    fetch("http://localhost:8080/friend/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "uid": uid,
            "token": token
        },
        body: JSON.stringify({
            uid2: isNaN(input) ? input : Number(input),
            detail: "Friend request"
        })
    })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                showMessage("Friend request sent", "success");
                document.getElementById("search-user").value = "";
                loadSentRequests();
            } else {
                showMessage("Failed to add friend：" + data.message, "error");
            }
        })
        .catch(err => {
            console.error("Failed to send friend request:", err);
            showMessage("Network error, please try again later", "error");
        });
}

// Format status text
function formatStatus(status) {
    const statusMap = {
        "WAITING": "Pending",
        "ACCEPTED": "Accepted",
        "REJECTED": "Rejected"
    };
    return statusMap[status] || status;
}


// Get color based on status
function getStatusColor(status) {
    const colorMap = {
        "WAITING": "#FFC107",  // Yellow
        "ACCEPTED": "#4CAF50", // Green
        "REJECTED": "#F44336"  // Red
    };
    return colorMap[status] || "gray";
}

// Show toast message
function showMessage(text, type) {
    // Check if there is already a message box
    let messageElement = document.getElementById("message-toast");
    if (!messageElement) {
        messageElement = document.createElement("div");
        messageElement.id = "message-toast";
        messageElement.style.position = "fixed";
        messageElement.style.top = "20px";
        messageElement.style.right = "20px";
        messageElement.style.padding = "10px 20px";
        messageElement.style.borderRadius = "5px";
        messageElement.style.zIndex = "1000";
        messageElement.style.boxShadow = "0 3px 10px rgba(0,0,0,0.2)";
        document.body.appendChild(messageElement);
    }

    // Set the message content and style
    messageElement.textContent = text;
    if (type === "success") {
        messageElement.style.backgroundColor = "#4CAF50";
        messageElement.style.color = "white";
    } else {
        messageElement.style.backgroundColor = "#F44336";
        messageElement.style.color = "white";
    }

    messageElement.style.display = "block";

    //Hide in 3 seconds
    setTimeout(() => {
        messageElement.style.display = "none";
    }, 3000);
}

// Initialize when the page is loaded
window.onload = () => {
    // Check the login status
    if (!uid || !token) {
        alert("You are not logged in. Redirecting to login page...");
        goTo("login");
        return;
    }

    // Add debugging information
    console.log("Current user ID:", uid);
    console.log("Token:", token);

    // Load the data of each part
    loadFriends();
    loadSentRequests();
    loadReceivedRequests();
};