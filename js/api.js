const API_BASE_URL = "https://v2.api.noroff.dev/auction";
const AUTH_API_BASE_URL = "https://v2.api.noroff.dev/auth";

function getApiKey() {
  const apiKey = localStorage.getItem("apiKey");

  return apiKey;
}

function getToken() {
  const token = localStorage.getItem("token");

  return token;
}

export { API_BASE_URL, AUTH_API_BASE_URL, getApiKey, getToken };
