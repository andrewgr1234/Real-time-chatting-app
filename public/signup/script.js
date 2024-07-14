document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(signupForm);
    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const usersResponse = await fetch("/users");
      if (!usersResponse.ok) {
        throw new Error(`HTTP error! Status: ${usersResponse.status}`);
      }

      const users = await usersResponse.json();
      const existingUser = users.find((user) => user.username === username);

      if (existingUser) {
        alert("Username already exists. Please choose a different one.");
        return;
      }

      const signupResponse = await fetch("/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!signupResponse.ok) {
        throw new Error(`HTTP error! Status: ${signupResponse.status}`);
      }

      const data = await signupResponse.json();
      console.log("Signup response:", data.message);
      alert("User signed up successfully!");
    } catch (error) {
      console.error("Error signing up:", error);
      alert("Failed to sign up. Please try again.");
    }
  });
});
