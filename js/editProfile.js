import { API_BASE_URL } from "./api.js";
import { getToken, getUsername, getApiKey } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
  const avatarInput = document.getElementById("avatar-url");
  const saveButton = document.getElementById("save-avatar");
  const token = getToken();
  const profileName = getUsername();
  const apiKey = getApiKey();

  if (!token || !profileName) {
    alert("User not authenticated. Please log in.");
    window.location.href = "/login/";
    return;
  }

  async function updateAvatar() {
    const avatarUrl = avatarInput.value.trim();
    if (!avatarUrl) {
      alert("Please enter a valid avatar URL.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/profiles/${profileName}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-Noroff-API-Key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avatar: { url: avatarUrl } }),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar.");
      }

      alert("Avatar updated successfully!");
      window.location.href = "/profile/";
    } catch (error) {
      alert(`Error updating avatar: ${error.message}`);
    }
  }

  saveButton.addEventListener("click", updateAvatar);
});
