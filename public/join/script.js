document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  async function checkLogin(event) {
    event.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    console.log("Login form data:", { username, password });

    try {
      const loginResponse = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json();
        throw new Error(
          errorData.message || `HTTP error! Status: ${loginResponse.status}`
        );
      }

      const data = await loginResponse.json();

      if (data.message === "Success") {
        window.location.href = "/home";
      } else {
        alert("Login failed: " + data.message);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      alert("Failed to log in: " + error.message);
    }
  }

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const email = formData.get("email");
    const username = formData.get("username");
    const password = formData.get("password");
    const profilePic = formData.get("profilePic");

    console.log("Signup form data:", { username, password, email, profilePic });

    try {
      const signupResponse = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email, profilePic }),
      });

      if (!signupResponse.ok) {
        const errorData = await signupResponse.json();
        throw new Error(
          errorData.error || `HTTP error! Status: ${signupResponse.status}`
        );
      }

      const data = await signupResponse.json();
      alert(data.message);

      if (data.message === "User signed up successfully.") {
        window.location.href = "/join";
      }
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up: " + error.message);
    }
  });

  loginForm.addEventListener("submit", checkLogin);
});
