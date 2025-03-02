import { API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listingsContainer = document.getElementById("user-listings");
  const loadingSpinner = document.getElementById("loading-spinner");
  const token = localStorage.getItem("token");

  if (!token) {
    document.body.innerHTML = `
            <div class="container text-center mt-5">
                <h2>You must be logged in to view your listings</h2>
                <a href="/login/" class="btn btn-primary mt-3">Go to Login</a>
            </div>
        `;
    return;
  }

  async function fetchUserListings() {
    loadingSpinner.style.display = "block";
    try {
      const response = await fetch(`${API_BASE_URL}/listings?user=true`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (response.ok) {
        displayUserListings(data);
      } else {
        console.error("Error fetching user listings:", data);
      }
    } catch (error) {
      console.error("Error fetching user listings:", error);
    }
    loadingSpinner.style.display = "none";
  }

  function displayUserListings(listings) {
    listingsContainer.innerHTML = listings
      .map(
        (listing) => `
            <div class="col-md-4">
                <div class="card shadow-sm mb-4">
                    <img src="${
                      listing.media[0] || "/assets/logo.png"
                    }" class="card-img-top" alt="${listing.title}">
                    <div class="card-body">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="card-text">${listing.description.substring(
                          0,
                          100
                        )}...</p>
                        <p><strong>Highest Bid:</strong> $${
                          listing.bids?.[0]?.amount || 0
                        }</p>
                        <a href="/listing-detail/?id=${
                          listing.id
                        }" class="btn btn-primary">View Listing</a>
                        <button class="btn btn-warning mt-2 edit-listing" data-id="${
                          listing.id
                        }">Edit</button>
                        <button class="btn btn-danger mt-2 delete-listing" data-id="${
                          listing.id
                        }">Delete</button>
                    </div>
                </div>
            </div>
        `
      )
      .join("");
    attachEventListeners();
  }

  function attachEventListeners() {
    document.querySelectorAll(".delete-listing").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const listingId = e.target.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this listing?")) {
          try {
            const response = await fetch(
              `${API_BASE_URL}/listings/${listingId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            if (response.ok) {
              alert("Listing deleted successfully!");
              fetchUserListings();
            } else {
              alert("Failed to delete listing.");
            }
          } catch (error) {
            console.error("Error deleting listing:", error);
          }
        }
      });
    });
  }

  fetchUserListings();
});
