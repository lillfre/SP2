import { API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const createListingForm = document.getElementById("create-listing-form");

  if (!localStorage.getItem("token")) {
    document.body.innerHTML = `
            <div class="container text-center mt-5">
                <h2>You must be logged in to create a listing</h2>
                <a href="/login/" class="btn btn-primary mt-3">Go to Login</a>
            </div>
        `;
    return;
  }

  createListingForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const description = document.getElementById("description").value;
    const media = document.getElementById("media").value;
    const deadline = document.getElementById("deadline").value;
    const token = localStorage.getItem("token");

    const listingData = {
      title,
      description,
      media: media ? [media] : [],
      endsAt: new Date(deadline).toISOString(),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/listings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(listingData),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Listing created successfully!");
        window.location.href = "/listings/";
      } else {
        alert(data.message || "Failed to create listing.");
      }
    } catch (error) {
      console.error("Error creating listing:", error);
    }
  });
});
