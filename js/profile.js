import { API_BASE_URL, getApiKey, getToken } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const profileName = localStorage.getItem("username");
  const token = getToken();
  const apiKey = getApiKey();

  if (!token || !profileName) {
    alert("User not found. Please log in again.");
    window.location.href = "/login/";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/profiles/${profileName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Noroff-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile data.");
    }

    const result = await response.json();
    const userData = result.data;

    document.getElementById("profile-name").textContent = userData.name;
    document.getElementById("profile-credits").textContent = userData.credits;
    document.getElementById("profile-avatar").src =
      userData.avatar?.url || "/assets/default-avatar.png";
  } catch (error) {
    console.error("Error fetching profile:", error);
    alert("Authentication issue. Please log in again.");
    window.location.href = "/login/";
  }
});
