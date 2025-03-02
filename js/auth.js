import { AUTH_API_BASE_URL } from "./api.js";

async function loginUser(email, password) {
  try {
    const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.data) {
      localStorage.setItem("token", data.data.accessToken);
      localStorage.setItem("username", data.data.name || "TestUser");

      await createAndStoreApiKey();

      return true;
    } else {
      throw new Error(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Login Error:", error);
    alert(error.message);
    return false;
  }
}

async function createAndStoreApiKey() {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found!");

    const response = await fetch(`${AUTH_API_BASE_URL}/create-api-key`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.key) {
      localStorage.setItem("apiKey", data.key);
    } else {
      throw new Error(data.message || "Failed to generate API key");
    }
  } catch (error) {
    console.error("API Key Error:", error);
    alert(error.message);
  }
}

export { loginUser };
