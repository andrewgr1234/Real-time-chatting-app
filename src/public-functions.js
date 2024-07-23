export function getCookies(names) {
  const allCookies = document.cookie.split("; ").reduce((acc, cookie) => {
    const [cookieName, cookieValue] = cookie.split("=");
    acc[cookieName] = decodeURIComponent(cookieValue);
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

export function deleteCookies() {
  document.cookie.split(";").forEach((cookie) => {
    const [name] = cookie.split("=");
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

export async function fetchUserData() {
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

export function setCookie(name, value, days) {
  let expires = "";
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
