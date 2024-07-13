document.addEventListener("DOMContentLoaded", () => {
  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const loginForm = document.getElementById("loginForm");
  let users;

  fetch("database/db.json")
    .then((response) => response.json())
    .then((data) => {
      users = data;
      console.log(users);
    })
    .catch((error) => console.error("Error fetching user data:", error));

  function checkLogin(event) {
    event.preventDefault();
    const username = usernameInput.value;
    const password = passwordInput.value;

    if (
      users &&
      users.user1 &&
      users.user1.username === username &&
      users.user1.password === password
    ) {
      console.log("Success!");
      window.location.href = "https://www.google.com";
    } else {
      console.log("Wrong username or password");
    }
  }

  loginForm.addEventListener("submit", checkLogin);
});
