document.addEventListener("DOMContentLoaded", () => {
  const logoutButton = document.getElementById("logoutButton");
  const sendMessageButton = document.getElementById("sendMessageButton");
  const searchButton = document.getElementById("searchButton");

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

  const loggedInUser = getCookie("loggedInUser");
  if (!loggedInUser) {
    window.location.href = "/";
    return;
  }

  const welcomeMessage = document.getElementById("welcomeMessage");
  welcomeMessage.textContent = `Welcome back ${loggedInUser}`;

  logoutButton.addEventListener("click", function () {
    document.cookie =
      "loggedInUser=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  });

  sendMessageButton.addEventListener("click", () => {
    console.log("Sending message...");
  });

  searchButton.addEventListener("click", () => {
    alert("Searching for friends...");
  });
});
