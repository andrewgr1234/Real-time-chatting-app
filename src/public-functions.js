function getCookies(names) {
  const allCookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [cookieName, cookieValue] = cookie.split("=");
    acc[cookieName] = cookieValue;
    return acc;
  }, {});

  if (Array.isArray(names)) {
    return names.reduce((acc, name) => {
      acc[name] = allCookies[name] || null;
      return acc;
    }, {});
  } else if (typeof names === "string") {
    return allCookies[names] || null;
  } else {
    throw new Error("Invalid argument type. Expected string or array.");
  }
}

function deleteCookies() {
  document.cookie =
    "loggedInUsername=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "loggedInEmail=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "loggedInProfilePic=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    let date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

async function fetchUserData() {
  try {
    const response = await fetch("/DB.json");
    if (!response.ok) {
      throw new Error("Failed to fetch user data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error; // Optional: re-throw the error for handling in the calling code
  }
}

const functions = {
  getCookies,
  deleteCookies,
  setCookie,
  fetchUserData,
};

export default functions;
