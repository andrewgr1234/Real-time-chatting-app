import { fetchUserData } from "./public-functions.js";

export async function pfpChange() {
  const newPfp = document.getElementById("newPfp").value.trim();
  if (!newPfp) {
    alert("Please enter a new profile picture URL.");
    return;
  }
  try {
    const response = await fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profilePic: newPfp }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    alert("Profile picture updated successfully.");
    fetchUserData().then(updateProfileInfo);
  } catch (error) {
    console.error("Error updating profile picture:", error);
    alert("Failed to update profile picture: " + error.message);
  }
}

export async function emailChange() {
  const newEmail = document.getElementById("newEmail").value.trim();
  if (!newEmail) {
    alert("Please enter a new email address.");
    return;
  }
  try {
    const response = await fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newEmail }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    alert("Email address updated successfully.");
    fetchUserData().then(updateProfileInfo);
  } catch (error) {
    console.error("Error updating email address:", error);
    alert("Failed to update email address: " + error.message);
  }
}

export async function usernameChange() {
  const newUsername = document.getElementById("newUsername").value.trim();
  if (!newUsername) {
    alert("Please enter a new username.");
    return;
  }
  try {
    const response = await fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: newUsername }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    alert("Username updated successfully.");
    fetchUserData().then(updateProfileInfo);
  } catch (error) {
    console.error("Error updating username:", error);
    alert("Failed to update username: " + error.message);
  }
}

export async function passwordChange() {
  const currentPassword = document
    .getElementById("currentPassword")
    .value.trim();
  const newPassword = document.getElementById("newPassword").value.trim();
  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  if (!currentPassword || !newPassword || !confirmPassword) {
    alert("Please fill out all password fields.");
    return;
  }

  if (newPassword !== confirmPassword) {
    alert("New password and confirm password do not match.");
    return;
  }

  try {
    const response = await fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! Status: ${response.status}`
      );
    }
    alert("Password updated successfully.");
  } catch (error) {
    console.error("Error updating password:", error);
    alert("Failed to update password: " + error.message);
  }
}

export async function deleteUser() {
  try {
    const response = await fetch("/deleteUser", {
      method: "DELETE",
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
    alert("Your account has been deleted. Goodbye!");
    window.location.href = "/join";
  } catch (error) {
    console.error("Error deleting account:", error);
    alert("Failed to delete account: " + error.message);
  }
}

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
