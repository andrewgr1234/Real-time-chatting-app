import { getCookies, fetchUserData } from "../../src/public-functions.js";
import {
  pfpChange,
  emailChange,
  usernameChange,
  passwordChange,
  deleteUser,
} from "../../src/updateUserData.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const searchButton = document.getElementById("searchButton");
  const profileButton = document.getElementById("profileBtn");
  const profile = document.getElementById("profile");
  const deleteButton = document.getElementById("deleteUser");

  const pfpChangeButton = document.getElementById("pfpChangeButton");
  const emailChangeButton = document.getElementById("emailChangeButton");
  const usernameChangeButton = document.getElementById("usernameChangeButton");
  const passwordChangeButton = document.getElementById("passwordChangeButton");

  const sessionCookie = getCookies("sessionId");
  if (!sessionCookie) {
    window.location.href = "/join";
    return;
  }

  fetchUserData()
    .then((data) => {
      updateProfileInfo(data);
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  profileButton.addEventListener("click", () => {
    if (profile.style.display === "block") {
      profile.style.display = "none";
    } else {
      profile.style.display = "block";
    }
  });

  document.addEventListener("click", (event) => {
    if (!profile.contains(event.target) && event.target !== profileButton) {
      profile.style.display = "none";
    }
  });

  searchButton.addEventListener("click", () => {
    const friends = document.getElementById("friends");
    if (friends.style.display == "none") {
      friends.style.display = "block";
    } else {
      friends.style.display = "none";
    }
  });

  function updateProfileInfo(userData) {
    const welcomeMessage = document.getElementById("welcomeMessage");
    welcomeMessage.textContent = `Welcome back ${userData.username}`;
    profileButton.style.backgroundImage = `url(${userData.profilePic})`;

    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const profileImg = document.getElementById("img");
    email.textContent = userData.email;
    username.textContent = userData.username;
    profileImg.src = userData.profilePic;
  }

  pfpChangeButton.addEventListener("click", pfpChange);
  emailChangeButton.addEventListener("click", emailChange);
  usernameChangeButton.addEventListener("click", usernameChange);
  passwordChangeButton.addEventListener("click", passwordChange);
  deleteButton.addEventListener("click", deleteUser);

  logoutButton.addEventListener("click", async () => {
    try {
      const response = await fetch("/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${response.status}`
        );
      }
      alert("Logging out...Goodbye!");
      window.location.href = "/join";
    } catch (error) {
      console.error("Error logging out:", error);
      alert("Failed to log out: " + error.message);
    }
  });

  const friendsList = document.getElementById("friendsList");
  const tabList = document.getElementById("tabList");
  const chatboxContent = document.getElementById("chatboxContent");

  friendsList.addEventListener("click", (e) => {
    if (e.target.tagName === "LI") {
      const friendName = e.target.textContent;
      openChatTab(friendName);
    }
  });

  function openChatTab(friendName) {
    const existingTab = [...tabList.children].find(
      (tab) => tab.textContent.trim() === friendName
    );

    if (!existingTab) {
      const tab = document.createElement("li");
      tab.textContent = friendName;

      const closeButton = document.createElement("span");
      closeButton.textContent = " x";
      closeButton.classList.add("close-tab");
      tab.appendChild(closeButton);

      tabList.appendChild(tab);
      displayChatBox(friendName);

      tab.addEventListener("click", () => displayChatBox(friendName));

      closeButton.addEventListener("click", (e) => {
        e.stopPropagation();
        tab.remove();
        if (tab.classList.contains("active")) {
          chatboxContent.innerHTML = "";
        }
      });
    }

    displayChatBox(friendName);
  }

  function displayChatBox(friendName) {
    chatboxContent.innerHTML = `
      <div id="chatbox-${friendName}" class="chatbox">
        <div class="messages" id="messages-${friendName}"></div>
        <div class="chat-input-container">
          <input type="text" id="input-${friendName}" placeholder="Type a message..." />
          <button onclick="sendMessage('${friendName}')">Send</button>
        </div>
      </div>
    `;

    const activeTab = [...tabList.children].find((tab) =>
      tab.classList.contains("active")
    );
    if (activeTab) activeTab.classList.remove("active");

    const currentTab = [...tabList.children].find(
      (tab) => tab.textContent.trim() === friendName
    );
    if (currentTab) currentTab.classList.add("active");
  }

  window.sendMessage = function (friendName) {
    const input = document.getElementById(`input-${friendName}`);
    const message = input.value.trim();
    if (message) {
      const messagesDiv = document.getElementById(`messages-${friendName}`);
      const userMessage = document.createElement("div");
      userMessage.classList.add("message", "you");
      userMessage.textContent = `You: ${message}`;
      messagesDiv.appendChild(userMessage);

      setTimeout(() => {
        const friendMessage = document.createElement("div");
        friendMessage.classList.add("message", "friend");
        friendMessage.textContent = `${friendName}: nuh uh`;
        messagesDiv.appendChild(friendMessage);
      }, 1000);

      input.value = "";
    }
  };
});
