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

  function toggleProfile() {
    profile.style.display = profile.style.display === "none" ? "block" : "none";
  }

  document.getElementById("pfp").addEventListener("click", () => {
    const pfpChangeButton = document.getElementById("pfpChangeButton");
    const newPfp = document.getElementById("newPfp");
    const isVisible = newPfp.style.display === "block";
    newPfp.style.display = isVisible ? "none" : "block";
    pfpChangeButton.style.display = isVisible ? "none" : "block";
  });

  document.getElementById("pfpChangeButton").addEventListener("click", () => {
    const newPfp = document.getElementById("newPfp").value;
    if (!newPfp) {
      alert("Please enter a URL");
      return;
    }

    fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ profilePic: newPfp }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to update profile picture");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          location.reload();
        }
      })
      .catch((error) => alert(error));
  });

  document.getElementById("emailChangeButton").addEventListener("click", () => {
    const newEmail = document.getElementById("newEmail").value;
    if (!newEmail) {
      alert("Please enter a new email address");
      return;
    }

    fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: newEmail }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error || "Failed to update email");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (!data.error) {
          location.reload();
        }
      })
      .catch((error) => alert(error));
  });

  document
    .getElementById("usernameChangeButton")
    .addEventListener("click", () => {
      const newUsername = document.getElementById("newUsername").value;
      if (!newUsername) {
        alert("Please enter a new username");
        return;
      }

      fetch("/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: newUsername }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Failed to update username");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (!data.error) {
            location.reload();
          }
        })
        .catch((error) => alert(error));
    });

  document
    .getElementById("passwordChangeButton")
    .addEventListener("click", () => {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (!currentPassword || !newPassword || !confirmPassword) {
        alert("Please fill in all fields to change your password.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      fetch("/updateUserData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((data) => {
              throw new Error(data.error || "Failed to update password");
            });
          }
          return response.json();
        })
        .then((data) => {
          if (!data.error) {
            alert("Password changed! Please log back in to apply changes.");
            deleteCookies();
            window.location.href = "/join";
          }
        })
        .catch((error) => alert(error));
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
            window.location.href = "/join";
          }
        })
        .catch((error) => alert(error));
    });
  });
});
