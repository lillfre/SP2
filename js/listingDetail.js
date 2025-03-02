import { API_BASE_URL } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listingDetailContainer = document.getElementById("listing-detail");
  const listingTitle = document.getElementById("listing-title");
  const listingSeller = document.getElementById("listing-seller");
  const listingCountdown = document.getElementById("listing-countdown");
  const listingImage = document.getElementById("listing-image");
  const listingDescription = document.getElementById("listing-description");
  const listingBidCount = document.getElementById("listing-bid-count");
  const listingHighestBid = document.getElementById("listing-highest-bid");

  const urlParams = new URLSearchParams(window.location.search);
  const listingId = urlParams.get("id");

  if (!listingId) {
    listingDetailContainer.innerHTML = `<p class="text-center text-danger">Invalid listing ID.</p>`;
    return;
  }

  async function fetchListingDetails() {
    try {
      const response = await fetch(
        `${API_BASE_URL}/listings/${listingId}?_bids=true`
      );
      const result = await response.json();

      const data = result.data;

      if (response.ok && data) {
        listingTitle.textContent = data.title || "No Title Provided";
        listingSeller.textContent = data.seller?.name || "Unknown Seller";

        if (
          Array.isArray(data.media) &&
          data.media.length > 0 &&
          data.media[0]?.url
        ) {
          listingImage.src = data.media[0].url;
        } else {
          listingImage.src = "/assets/logo.png";
        }
        listingImage.alt = data.title || "Listing Image";

        listingDescription.textContent =
          data.description || "No description available.";
        listingBidCount.textContent = data._count?.bids ?? 0;
        listingHighestBid.textContent = data.bids?.[0]?.amount ?? 0;

        if (data.endsAt) {
          startCountdown(data.endsAt);
        } else {
          listingCountdown.textContent = "No end date provided";
        }
      } else {
        console.error("Error fetching listing details:", data);
      }
    } catch (error) {
      console.error("Error fetching listing details:", error);
    }
  }

  function startCountdown(endsAt) {
    const endDate = new Date(endsAt).getTime();
    const countdownInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = endDate - now;

      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        listingCountdown.textContent = "Auction Ended";
        return;
      }

      const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      listingCountdown.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
  }

  fetchListingDetails();
});
