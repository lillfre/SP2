import { AUTH_API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const registerForm = document.getElementById("register-form");

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email.endsWith("@stud.noroff.no")) {
        alert("Only stud.noroff.no emails are allowed.");
        return;
      }

      try {
        const response = await fetch(`${AUTH_API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Registration successful! You can now log in.");
          window.location.href = "/login/";
        } else {
          alert(
            `Registration failed: ${
              result.errors?.[0]?.message || result.message || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred. Please check the console.");
      }
    });
  }
});
