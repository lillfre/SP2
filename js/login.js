import { AUTH_API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      try {
        const response = await fetch(`${AUTH_API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          const token = result.data?.accessToken;
          const userEmail = result.data?.email;

          if (!token || !userEmail) {
            console.error("API did not return a valid token or email:", result);
            alert("Login failed: Invalid response received.");
            return;
          }

          const userName = userEmail.split("@")[0];

          localStorage.setItem("token", token);
          localStorage.setItem("userName", userName);

          alert("Login successful!");
          window.location.href = "/profile/";
        } else {
          console.error("Login error response:", result);
          alert(
            `Login failed: ${
              result.errors?.[0]?.message || result.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please check the console.");
      }
    });
  }
});
