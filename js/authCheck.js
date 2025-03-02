import { API_BASE_URL, getToken, getApiKey } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  async function fetchUserProfile() {
    try {
      const token = getToken();
      const apiKey = getApiKey();
      const username = localStorage.getItem("username");

      if (!token || !apiKey || !username) {
        throw new Error("User authentication details missing.");
      }

      const response = await fetch(`${API_BASE_URL}/profiles/${username}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user profile.");
      }

      const userData = await response.json();

      document.getElementById(
        "userCredits"
      ).innerText = `Credits: ${userData.data.credits}`;
    } catch (error) {
      console.error("Profile Fetch Error:", error);
      alert("User not found. Please log in again.");
    }
  }

  fetchUserProfile();
});
