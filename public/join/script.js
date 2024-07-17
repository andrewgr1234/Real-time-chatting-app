import functions from "../../public-functions.js";
const cookieNames = ["loggedInUsername", "loggedInEmail", "loggedInProfilePic"];
const cookies = functions.getCookies(cookieNames);
cookieNames.forEach((name) => {
  if (cookies[name]) {
    window.location.href = "/home";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  let users;

  functions
    .fetchUserData()
    .then((data) => {
      users = data;
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  function checkLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    let loggedIn = false;

    Object.values(users).forEach((user) => {
      if (user.username === username && user.password === password) {
        loggedIn = true;
        const { email, profilePic } = getUserData(username);
        functions.setCookie("loggedInUsername", username, 7);
        functions.setCookie("loggedInEmail", email, 7);
        functions.setCookie("loggedInProfilePic", profilePic, 7);
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

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const profilePic = formData.get("profilePic");

    try {
      const usersResponse = await fetch("/users");
      if (!usersResponse.ok) {
        throw new Error(`HTTP error! Status: ${usersResponse.status}`);
      }

      const users = await usersResponse.json();
      const existingUser = users.find((user) => user.username === username);
      const existingEmail = users.find((user) => user.email === email);

      if (existingUser) {
        alert("Username already exists. Please choose a different one.");
        return;
      } else if (existingEmail) {
        alert("Email already exists. Please choose a different one.");
        return;
      }

      const signupResponse = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, profilePic }),
      });

      if (!signupResponse.ok) {
        throw new Error(`HTTP error! Status: ${signupResponse.status}`);
      }

      const data = await signupResponse.json();
      console.log("Signup response:", data.message);
      alert("User signed up successfully!");
      window.location.href = "/join";
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    }
  });
});
