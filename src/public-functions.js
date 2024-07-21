function getCookies(name) {
  const cookies = document.cookie.split(";").reduce((acc, cookie) => {
    const [cookieName, cookieValue] = cookie.split("=").map((c) => c.trim());
    acc[cookieName] = decodeURIComponent(cookieValue);
    return acc;
  }, {});

  console.log("All cookies:", cookies); // Debugging
  return cookies[name] || null;
}

function deleteCookies() {
  document.cookie = "session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

async function fetchUserData() {
  try {
    const response = await fetch("/getUserData");
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

const functions = {
  getCookies,
  deleteCookies,
  fetchUserData,
  setCookie,
};

export default functions;
