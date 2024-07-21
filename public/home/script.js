import functions from "../../src/public-functions.js";

function getCookies(names) {
  const allCookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [cookieName, cookieValue] = cookie.split("=");
    acc[cookieName] = cookieValue;
    return acc;
  }, {});

  if (Array.isArray(names)) {
    return names.reduce((acc, name) => {
      acc[name] = allCookies[name] || null;
      return acc;
    }, {});
  } else if (typeof names === "string") {
    return allCookies[names] || null;
  } else {
    throw new Error("Invalid argument type. Expected string or array.");
  }
}

async function fetchUserData() {
  try {
    const response = await fetch("/getUserData");
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const searchButton = document.getElementById("searchButton");
  const profileButton = document.getElementById("profileBtn");
  const profile = document.getElementById("profile");

  const sessionCookie = getCookies("sessionId");

  if (!sessionCookie) {
    alert("Please login first");
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

  logoutButton.addEventListener("click", () => {
    fetch("/logout", {
      method: "POST",
    })
      .then((response) => response.json())
      .then(() => {
        alert("Logging out... Goodbye!");
        window.location.href = "/join";
      })
      .catch((error) => console.error("Error logging out:", error));
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

  function saveChanges(updatedUser) {
    fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved successfully:", data);
      })
      .catch((error) => console.error("Error saving data:", error));
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Profile picture updated:", data);
        location.reload();
      })
      .catch((error) =>
        console.error("Error updating profile picture:", error)
      );
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
      .then((response) => response.json())
      .then((data) => {
        console.log("Email updated:", data);
        location.reload();
      })
      .catch((error) => console.error("Error updating email:", error));
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
        .then((response) => response.json())
        .then((data) => {
          console.log("Username updated:", data);
          location.reload();
        })
        .catch((error) => console.error("Error updating username:", error));
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
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            alert(data.error);
          } else {
            alert("Password changed! Please log back in to apply changes.");
            functions.deleteCookies();
            window.location.href = "/join";
          }
        })
        .catch((error) => console.error("Error updating password:", error));
    });
});
