document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const sendMessageButton = document.getElementById("sendMessageButton");
  const searchButton = document.getElementById("searchButton");
  const profileButton = document.getElementById("profileBtn");
  const profile = document.getElementById("profile");

  function getCookie(name) {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");
    for (let cookie of cookies) {
      const [cookieName, cookieValue] = cookie.split("=");
      if (cookieName.trim() === name) {
        return cookieValue;
      }
    }
    return null;
  }

  const loggedInUser = getCookie("loggedInUsername");
  const loggedInEmail = getCookie("loggedInEmail");
  const loggedInProfilePic = getCookie("loggedInProfilePic");
  if (!loggedInUser) {
    window.location.href = "/join";
    return;
  }

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = `Welcome back ${loggedInUser}`;
  profileButton.style.backgroundImage = `url(${loggedInProfilePic})`;

  logoutButton.addEventListener("click", function () {
    document.cookie =
      "loggedInUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "loggedInEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "loggedInProfilePic=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    alert("Logging out...Goodbye!");
    window.location.href = "/join";
  });

  sendMessageButton.addEventListener("click", () => {
    console.log("Sending message...");
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
});
