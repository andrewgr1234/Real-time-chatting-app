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
    window.location.href = "/login";
    return;
  }

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = `Welcome back ${loggedInUser}`;
  document.getElementById(
    "profileBtn"
  ).innerHTML = `<img src="${loggedInProfilePic}">`;

  logoutButton.addEventListener("click", function () {
    document.cookie =
      "loggedInUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "loggedInEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "loggedInProfilePic=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    alert("loging out...Goodbye!");
    window.location.href = "/login";
  });

  sendMessageButton.addEventListener("click", () => {
    console.log("Sending message...");
  });

  searchButton.addEventListener("click", () => {
    alert("Searching for friends...");
  });

  profileButton.addEventListener("click", () => {
    const email = document.getElementById("email");
    const username = document.getElementById("username");
    const profileimg = document.getElementById("img");
    if (profile.style.display == "none") {
      profile.style.display = "block";
    } else {
      profile.style.display = "none";
    }

    email.textContent = `${loggedInEmail}`;
    username.textContent = `${loggedInUser}`;
    profileimg.setAttribute("src", `${loggedInProfilePic}`);
  });
});
