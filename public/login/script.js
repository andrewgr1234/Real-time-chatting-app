document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("loginForm");

  let users;

  fetch("/db.json")
    .then((response) => response.json())
    .then((data) => {
      users = data;
      console.log(users);
    })
    .catch((error) => console.error("Error fetching user data:", error));

  function setCookie(name, value, days) {
    let expires = "";
    if (days) {
      let date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function checkLogin(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;
    let loggedIn = false;

    Object.values(users).forEach((user) => {
      if (user.username === username && user.password === password) {
        loggedIn = true;
        const { email, profilePic } = getUserData(username);
        setCookie("loggedInUsername", username, 7);
        setCookie("loggedInEmail", email, 7);
        setCookie("loggedInProfilePic", profilePic, 7);
        console.log("Success!");
        window.location.href = "/home";
      }
    });

    if (!loggedIn) {
      alert("Wrong username or password");
    }
  }

  function getUserData(username) {
    let email = null;
    let profilePic = null;
    Object.values(users).forEach((user) => {
      if (user.username === username) {
        email = user.email;
        profilePic = user.profilePic;
      }
    });
    return { email, profilePic };
  }

  loginForm.addEventListener("submit", checkLogin);
});
