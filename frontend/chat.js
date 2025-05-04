let pollingInterval = null;

function startPollingMessages() {
    if (pollingInterval) clearInterval(pollingInterval);
    pollingInterval = setInterval(() => {
      if (currentSessionId && currentSessionType) {
        loadMessages(currentSessionId, currentSessionType);
      }
    }, 3000); // Poll for new messages every 3 seconds
  }


// Page navigation
function goTo(page) {
    window.location.href = `${page}.html`;
  }

  // User identity
  const uid = localStorage.getItem("uid");
  const token = localStorage.getItem("token");

  // Current chat session
  let currentSessionType = null;
  let currentSessionId = null;
  
  // Authentication headers
  function authHeaders() {
    return {
      "Content-Type": "application/json",
      "uid": uid,
      "token": token
    };
  }

// Render a chat message (with avatar)
function renderChatMessage(msg) {
    const isMe = msg.uid === Number(uid);
    const container = document.getElementById("messages");
    if (!container) return;
  
    const wrapper = document.createElement("div");
    wrapper.className = "message-wrapper";
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "flex-end";
    wrapper.style.margin = "10px";
    wrapper.style.justifyContent = isMe ? "flex-end" : "flex-start";
  
    const bubble = document.createElement("div");
    bubble.textContent = msg.record;
    bubble.style.backgroundColor = isMe ? "#4CAF50" : "#e0e0e0";
    bubble.style.color = isMe ? "#fff" : "#000";
    bubble.style.padding = "10px 14px";
    bubble.style.borderRadius = "16px";
    bubble.style.maxWidth = "60%";
    bubble.style.margin = "0 10px";
  
    // Occupy the avatar container and later replace it with an image or a letter
    const avatarContainer = document.createElement("div");
    avatarContainer.style.width = "36px";
    avatarContainer.style.height = "36px";
    avatarContainer.style.borderRadius = "50%";
    avatarContainer.style.display = "flex";
    avatarContainer.style.alignItems = "center";
    avatarContainer.style.justifyContent = "center";
    avatarContainer.style.fontSize = "16px";
    avatarContainer.style.color = "#fff";
    avatarContainer.style.margin = "0 10px";
    avatarContainer.style.flexShrink = "0";
  
    // By default, it is in a gray loading status
    avatarContainer.style.backgroundColor = "#bbb";
  
    // Add DOM structure (insert an empty container first)
    if (isMe) {
      wrapper.appendChild(bubble);
      wrapper.appendChild(avatarContainer);
    } else {
      wrapper.appendChild(avatarContainer);
      wrapper.appendChild(bubble);
    }
  
    // Load user avatar or fallback to initials
    fetch(`http://localhost:8080/user/info/other/${msg.uid}`, {
      method: "POST",
      headers: {
        "uid": uid,
        "token": token
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success && data.detail) {
          const user = data.detail;
  
          if (user.hasImage && user.imageId) {
            const img = document.createElement("img");
            img.src = `http://localhost:8080/image/download/${user.imageId}`;
            img.style.width = "36px";
            img.style.height = "36px";
            img.style.borderRadius = "50%";
            avatarContainer.innerHTML = "";
            avatarContainer.appendChild(img);
          } else {
              // No avatar → Display a green initial background
            avatarContainer.style.backgroundColor = "#4CAF50";
            avatarContainer.textContent = user.username?.[0]?.toUpperCase() || "?";
          }
        }
      })
      .catch(err => {
        console.error("Failed to load user avatar:", err);
      });
  
    return wrapper;
  }
  



  // Generate a friend session ID
  function generateFriendSessionId(a, b) {
    return a < b ? `${a}_${b}` : `${b}_${a}`;
  }
  
  // Prompt to create a group
  function showCreateGroupPrompt() {
    const name = prompt("Enter a group name:");
    if (!name) return;
    fetch("http://localhost:8080/chat/group/create", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ name, description: "" })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) loadGroups();
        else alert("Creation failed: " + data.message);
      })
      .catch(err => alert("Failed to create group: " + err));
  }
  
  // Prompt to join a group
  function showJoinGroupPrompt() {
    const groupId = prompt("Enter the group ID to join：");
    if (!groupId) return;
    fetch("http://localhost:8080/chat/group/join", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ groupId: Number(groupId) })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) loadGroups();
        else alert("Join failed: " + data.message);
      })
      .catch(err => alert("Failed to join group: " + err));
  }

// Load group icons
function loadGroups() {
  fetch("http://localhost:8080/chat/group/list", {
    method: "POST",
    headers: authHeaders()
  })
    .then(res => res.json())
    .then(data => {
      console.log("Group data received:", data); // Helpful for debugging

      const list = document.getElementById("group-icons");
      list.innerHTML = "";

      const rawList = data?.detail?.list ?? data?.detail ?? [];
      const groups = Array.isArray(rawList) ? rawList : Object.values(rawList).filter(v => typeof v === "object");

      if (data.success && groups.length > 0) {
        groups.forEach(group => {
          const wrapper = document.createElement("div");
          wrapper.style.display = "flex";
          wrapper.style.flexDirection = "column";
          wrapper.style.alignItems = "center";
          wrapper.style.marginBottom = "12px";

          // Default group icon: first letter
          const icon = document.createElement("div");
          icon.textContent = group.name[0].toUpperCase();
          icon.className = "group-icon";
          icon.style.width = "48px";
          icon.style.height = "48px";
          icon.style.borderRadius = "50%";
          icon.style.backgroundColor = "#9C27B0";  // Purple
          icon.style.color = "#fff";
          icon.style.display = "flex";
          icon.style.alignItems = "center";
          icon.style.justifyContent = "center";
          icon.style.fontSize = "18px";
          icon.style.border = "2px solid transparent";
          icon.style.transition = "border-color 0.3s";
          icon.title = group.name;

          icon.onclick = () => {

            // Clear cached messages
            loadedMessageIds.clear();

            // Clear chat area
            const container = document.getElementById("messages");
            if (container) container.innerHTML = "";

            // Reset all borders
            document.querySelectorAll(".group-icon").forEach(i => {
              if (i.style) i.style.borderColor = "transparent";
            });

            document.querySelectorAll(".friend-icon").forEach(i => {
              if (i.style) i.style.borderColor = "transparent";
            });

            // Highlight selected group
            icon.style.borderColor = "#4CAF50";

            // Update session info
            currentSessionId = group.id;
            currentSessionType = "Group";

            // Load messages for this group
            loadMessages(currentSessionId, currentSessionType);

            // Start polling
            startPollingMessages();
          };

          // Group's name - label
          const label = document.createElement("div");
          label.textContent = group.name;
          label.style.color = "#fff";
          label.style.fontSize = "12px";
          label.style.marginTop = "4px";
          label.style.textAlign = "center";

          wrapper.appendChild(icon);
          wrapper.appendChild(label);
          list.appendChild(wrapper);
        });
      } else {
        list.innerHTML = "<div style='color: #999; padding: 10px;'>暂无群组</div>";
      }
    })
    .catch(err => {
      console.error("Failed to load groups:", err);
    });
}

  
  // Load friend icons
  function loadFriendIcons() {
    
    fetch("http://localhost:8080/friend/friendship/list", {
      method: "POST",
      headers: authHeaders()
    })
      .then(res => res.json())
      .then(data => {
        const list = document.getElementById("friend-icons");
        list.innerHTML = "";
      
        const rawList = data?.detail?.list ?? {};
        const friends = Array.isArray(rawList) ? rawList : Object.values(rawList).filter(v => typeof v === "object");
          
        if (data.success && friends.length > 0) {
            friends.forEach(friend => {
                const isSelfUid = friend.uid === Number(uid);
                const otherUid = isSelfUid ? friend.uid2 : friend.uid;
                const otherName = isSelfUid
                  ? friend.username2 || `User${friend.uid2}`
                  : friend.username || `User${friend.uid}`;
              
                const iconWrapper = document.createElement("div");
                iconWrapper.style.display = "flex";
                iconWrapper.style.flexDirection = "column";
                iconWrapper.style.alignItems = "center";
                iconWrapper.style.marginBottom = "12px";
              
                // Request profile picture information
                fetch(`http://localhost:8080/user/info/other/${otherUid}`, {
                  method: "POST",
                  headers: {
                    "uid": uid,
                    "token": token
                  }
                })
                  .then(res => res.json())
                  .then(data => {
                    let iconElement;
              
                    if (data.success && data.detail && data.detail.hasImage && data.detail.imageId) {
                      // If user has an avatar and use pictures
                      const avatar = document.createElement("img");
                      avatar.src = `http://localhost:8080/image/download/${data.detail.imageId}`;
                      avatar.alt = otherName;
                      avatar.className = "friend-icon";
                      avatar.style.width = "48px";
                      avatar.style.height = "48px";
                      avatar.style.borderRadius = "50%";
                      avatar.style.border = "2px solid transparent";
                      avatar.style.transition = "border-color 0.3s";
                      avatar.title = otherName;
                      iconElement = avatar;
                    } else {
                      // No avatar. The first letter of the blue circle is displayed
                      const placeholder = document.createElement("div");
                      placeholder.textContent = otherName[0].toUpperCase();
                      placeholder.className = "friend-icon";
                      placeholder.style.width = "48px";
                      placeholder.style.height = "48px";
                      placeholder.style.borderRadius = "50%";
                      placeholder.style.backgroundColor = "#2196F3"; // Blue
                      placeholder.style.color = "#fff";
                      placeholder.style.display = "flex";
                      placeholder.style.alignItems = "center";
                      placeholder.style.justifyContent = "center";
                      placeholder.style.fontSize = "18px";
                      placeholder.style.border = "2px solid transparent";
                      placeholder.style.transition = "border-color 0.3s";
                      placeholder.title = otherName;
                      iconElement = placeholder;
                    }
              
                    iconElement.onclick = () => {
                        // Clear the message cache
                        loadedMessageIds.clear();

                        // Clear the chat box
                        const container = document.getElementById("messages");
                        if (container) container.innerHTML = "";

                        // Activate styles
                        document.querySelectorAll(".friend-icon").forEach(i => {
                          if (i.style) i.style.borderColor = "transparent";
                        });

                        document.querySelectorAll(".group-icon").forEach(i => {
                          if (i.style) i.style.borderColor = "transparent";
                        });

                        iconElement.style.borderColor = "#4CAF50";

                        // Switch sessions & Load messages
                        currentSessionId = generateFriendSessionId(uid, otherUid);
                        currentSessionType = "Friend";
                        loadMessages(currentSessionId, currentSessionType);
                        startPollingMessages(); // Start the poll
                      };
              
                    const label = document.createElement("div");
                    label.textContent = otherName;
                    label.style.color = "#fff";
                    label.style.fontSize = "12px";
                    label.style.marginTop = "4px";
                    label.style.textAlign = "center";
              
                    iconWrapper.appendChild(iconElement);
                    iconWrapper.appendChild(label);
                    list.appendChild(iconWrapper);
                  })
                  .catch(err => {
                    console.error("Failed to load avatar:", err);
                  });
              });
              
        } else {
          list.innerHTML = "<div style='color: #999; padding: 10px;'>No friends available</div>";
        }
      })
      
      .catch(err => {
        document.getElementById("friend-icons").innerHTML = `<div style="color: red; padding: 10px;">Failed to load：${err.message}</div>`;
        console.error("Failed to load friends:", err);
      });
  }


// Cache for message IDs
// Define a global variable outside the function to record the loaded message ID
const loadedMessageIds = new Set();

function loadMessages(sessionId, sessionType) {
  const endTime = new Date().toISOString();
  const startTime = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();

  fetch("http://localhost:8080/chat/record/get", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      sessionType,
      sessionId,
      startTime,
      endTime
    })
  })
    .then(res => res.json())
    .then(data => {
      const container = document.getElementById("messages");
      const rawList = data?.detail?.list ?? {};
      const messages = Array.isArray(rawList)
        ? rawList
        : Object.values(rawList).filter(v => typeof v === "object");

      if (data.success && messages.length > 0) {
        messages.forEach(msg => {
          if (!loadedMessageIds.has(msg.id)) {
            const dom = renderChatMessage(msg);
            container.appendChild(dom);
            loadedMessageIds.add(msg.id);
            container.scrollTop = container.scrollHeight;
          }
        });
      }
    });
}

  
  // Send a message
  function sendMessage() {
    console.log("Send button clicked, preparing to submit message.");
    const input = document.getElementById("messageText");
    const text = input.value.trim();
    if (!text || !currentSessionType || !currentSessionId) return;
    fetch("http://localhost:8080/chat/record/submit", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({
        sessionType: currentSessionType,
        sessionId: currentSessionId,
        record: text
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          input.value = "";
          loadMessages(currentSessionId, currentSessionType);
        } else {
          alert("Failed to send message: " + data.message);
        }
      });
  }

// Initialize on page load
  window.onload = () => {
    document.getElementById("messageText").addEventListener("keydown", function (event) {
        // To see if press the Enter
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault(); // Prevent newline
            sendMessage();
        }
    });
    
    if (!uid || !token) {
      alert("Not logged in. Please log in again.");
      goTo("login");
      return;
    }
    loadGroups();
    loadFriendIcons();
  };
  