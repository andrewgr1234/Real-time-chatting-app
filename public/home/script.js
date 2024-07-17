import functions from "../../public-functions.js";

document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const searchButton = document.getElementById("searchButton");
  const profileButton = document.getElementById("profileBtn");
  const profile = document.getElementById("profile");
  const loggedInUser = functions.getCookies("loggedInUsername");
  const loggedInEmail = functions.getCookies("loggedInEmail");
  const loggedInProfilePic = functions.getCookies("loggedInProfilePic");
  let users;

  if (!loggedInUser) {
    window.location.href = "/join";
    return;
  }

  functions
    .fetchUserData()
    .then((data) => {
      users = data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = `Welcome back ${loggedInUser}`;
  profileButton.style.backgroundImage = `url(${loggedInProfilePic})`;

  logoutButton.addEventListener("click", function () {
    functions.deleteCookies();
    alert("Logging out...Goodbye!");
    window.location.href = "/join";
  });

  searchButton.addEventListener("click", () => {
    alert("Searching for friends...");
    console.log("Searching for friends...");
  });

  profileButton.addEventListener("click", () => {
    toggleProfile();
  });

  document.addEventListener("click", (event) => {
    if (!profile.contains(event.target) && event.target !== profileButton) {
      profile.style.display = "none";
    }
  });

  function toggleProfile() {
    if (profile.style.display === "none") {
      profile.style.display = "block";
      const email = document.getElementById("email");
      const username = document.getElementById("username");
      const profileimg = document.getElementById("img");
      email.textContent = loggedInEmail;
      username.textContent = loggedInUser;
      profileimg.src = loggedInProfilePic;
    } else {
      profile.style.display = "none";
    }
  }

  function saveChanges(updatedUsers) {
    fetch("/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUsers),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data saved successfully:", data);
      })
      .catch((error) => console.error("Error saving data:", error));
  }

  document.getElementById("emailChangeButton").addEventListener("click", () => {
    const newEmail = document.getElementById("newEmail").value;
    const user = Object.values(users).find(
      (user) => user.username === loggedInUser
    );

    if (!newEmail) {
      alert("Please enter a new email address");
      return;
    }
    if (user) {
      user.email = newEmail;
      alert("Email Changed!");
      saveChanges(users);
      functions.setCookie("loggedInEmail", user.email, 7);
      location.reload();
    } else {
      alert("User not found. Please try again.");
    }
  });

  document
    .getElementById("usernameChangeButton")
    .addEventListener("click", () => {
      const newUsername = document.getElementById("newUsername").value;
      const user = Object.values(users).find(
        (user) => user.email === loggedInEmail
      );

      if (!newUsername) {
        alert("Please enter a new username");
        return;
      }
      if (user) {
        user.username = newUsername;
        alert("Username Changed!");
        saveChanges(users);
        functions.setCookie("loggedInUsername", user.username, 7);
        location.reload();
      } else {
        alert("User not found. Please try again.");
      }
    });

  document
    .getElementById("passwordChangeButton")
    .addEventListener("click", () => {
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const user = Object.values(users).find(
        (user) => user.email === loggedInEmail
      );

      if (!newPassword || !currentPassword || !confirmPassword) {
        alert("Please fill in all fields to change your password.");
        return;
      }
      if (!user) {
        alert("User not found. Please try again.");
        return;
      }
      if (user.password !== currentPassword) {
        alert(
          "The current password you entered is incorrect. Please try again."
        );
        return;
      }
      if (newPassword !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      user.password = newPassword;
      alert("Password changed! Please log back in to apply changes.");
      saveChanges(users);
      functions.deleteCookies();
      window.location.href = "/join";
    });
});
