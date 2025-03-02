import { getToken } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const loginBtn = document.getElementById("login-btn");
  const registerBtn = document.getElementById("register-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const profileLink = document.getElementById("profile-link");
  const createListingLink = document.getElementById("create-listing-link");
  const profileAvatar = document.getElementById("user-avatar");
  const profileCredit = document.getElementById("user-credit");
  const profileEmail = document.getElementById("user-email");
  const avatarForm = document.getElementById("update-avatar-form");

  function updateNav() {
    const token = getToken();
    if (token) {
      loginBtn.classList.add("d-none");
      registerBtn.classList.add("d-none");
      logoutBtn.classList.remove("d-none");
      profileLink.style.display = "block";
      createListingLink.style.display = "block";
    } else {
      loginBtn.classList.remove("d-none");
      registerBtn.classList.remove("d-none");
      logoutBtn.classList.add("d-none");
      profileLink.style.display = "none";
      createListingLink.style.display = "none";
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("token");
      alert("You have been logged out.");
      updateNav();
      window.location.href = "/login/";
    });
  }

  updateNav();
});
