import {
  getCookies,
  fetchUserData,
  deleteCookies,
} from "../../src/public-functions.js";

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

  profileButton.addEventListener("click", toggleProfile);

  document.addEventListener("click", (event) => {
    if (!profile.contains(event.target) && event.target !== profileButton) {
      profile.style.display = "none";
    }
  });

  searchButton.addEventListener("click", () => {
    alert("Search functionality not implemented yet.");
  });

  pfpChangeButton.addEventListener("click", async () => {
    const newPfp = document.getElementById("newPfp").value.trim();
    if (!newPfp) {
      alert("Please enter a new profile picture URL.");
      return;
    }
    try {
      const response = await fetch("/update-profile-pic", {
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
  });

  emailChangeButton.addEventListener("click", async () => {
    const newEmail = document.getElementById("newEmail").value.trim();
    if (!newEmail) {
      alert("Please enter a new email address.");
      return;
    }
    try {
      const response = await fetch("/update-email", {
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
  });

  usernameChangeButton.addEventListener("click", async () => {
    const newUsername = document.getElementById("newUsername").value.trim();
    if (!newUsername) {
      alert("Please enter a new username.");
      return;
    }
    try {
      const response = await fetch("/update-username", {
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
  });

  passwordChangeButton.addEventListener("click", async () => {
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
      const response = await fetch("/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
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
  });

  deleteButton.addEventListener("click", function handleClick() {
    deleteButton.textContent = "Are you sure? (Click again for yes)";
    deleteButton.removeEventListener("click", handleClick);
    deleteButton.addEventListener("click", () => {
      fetch("/deleteUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Failed to delete user");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (!data.error) {
            alert("User deleted, goodbye forever...");
            deleteCookies();
            window.location.href = "/";
          }
        })
        .catch((error) => alert(error));
    });
  });
});

function toggleProfile() {
  const profile = document.getElementById("profile");
  profile.style.display = profile.style.display === "none" ? "flex" : "none";
}
