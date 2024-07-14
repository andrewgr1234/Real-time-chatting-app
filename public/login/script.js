document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("loginForm");
  const loginButton = document.getElementById("loginButton");

  let users;

  fetch("db.json")
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

    if (
      users &&
      users.user0 &&
      users.user0.username === username &&
      users.user0.password === password
    ) {
      setCookie("loggedInUser", username, 7);
      console.log("Success!");
      window.location.href = "/home";
    } else {
      alert("Wrong username or password");
    }
  }

  loginForm.addEventListener("submit", checkLogin);
});

