import { API_BASE_URL, getApiKey, getToken } from "./api.js";

document.addEventListener("DOMContentLoaded", async () => {
  const listingsContainer = document.getElementById("all-listings");
  const featuredListingsContainer =
    document.getElementById("featured-listings");
  const loadingSpinner = document.getElementById("loading-spinner");
  const searchBar = document.getElementById("search-bar");
  let allListings = [];

  async function fetchListings() {
    if (!listingsContainer && !featuredListingsContainer) {
      console.warn("Listings container not found on this page.");
      return;
    }
    if (loadingSpinner) loadingSpinner.style.display = "block";

    try {
      const response = await fetch(`${API_BASE_URL}/listings`, {
        headers: {
          "X-Noroff-API-Key": getApiKey(),
        },
      });
      const result = await response.json();

      const listings = result.data;

      if (response.ok && listings) {
        allListings = listings;
        displayListings(allListings);
        displayFeaturedListings(allListings);
      } else {
        console.error("Error fetching listings:", result);
      }
    } catch (error) {
      console.error("Error fetching listings:", error);
    }

    if (loadingSpinner) loadingSpinner.style.display = "none";
  }

  function displayListings(listings) {
    if (!listingsContainer) return;
    if (!listings.length) {
      listingsContainer.innerHTML = `<p class="text-center">No listings available.</p>`;
      return;
    }
    listingsContainer.innerHTML = listings
      .map((listing) => createListingCard(listing))
      .join("");
  }

  function createListingCard(listing) {
    const listingId = listing.id || "";
    let imageUrl = "/assets/logo.png";

    if (
      listing.media &&
      Array.isArray(listing.media) &&
      listing.media.length > 0 &&
      listing.media[0]?.url
    ) {
      const tempImage = new Image();
      tempImage.src = listing.media[0].url;
      tempImage.onerror = () => {
        console.warn(`Image failed to load: ${listing.media[0].url}`);
      };
      imageUrl = listing.media[0].url;
    }

    const description = listing.description
      ? listing.description.substring(0, 100) + "..."
      : "No description available.";
    const highestBid = listing.bids?.[0]?.amount || 0;

    return `
            <div class="col-md-4">
                <div class="card shadow-sm mb-4">
                    <img src="${imageUrl}" class="card-img-top" alt="${
      listing.title
    }" onerror="this.src='/assets/logo.png';">
                    <div class="card-body">
                        <h5 class="card-title">${
                          listing.title || "No Title"
                        }</h5>
                        <p class="card-text">${description}</p>
                        <p><strong>Highest Bid:</strong> $${highestBid}</p>
                        <a href="/listing-detail/index.html?id=${listingId}" class="btn btn-primary">View Listing</a>
                    </div>
                </div>
            </div>
        `;
  }

  if (searchBar) {
    searchBar.addEventListener("input", () => {
      const query = searchBar.value.toLowerCase();
      const filteredListings = allListings.filter((listing) =>
        listing.title.toLowerCase().includes(query)
      );
      displayListings(filteredListings);
    });
  }

  fetchListings();
});
