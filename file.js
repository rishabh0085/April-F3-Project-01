document.addEventListener("DOMContentLoaded", getCurrentImageOfTheDay);

function getCurrentImageOfTheDay() {
    const currentDate = new Date().toISOString().split("T")[0];
    getImageOfTheDay(currentDate);
}

function getImageOfTheDay(date) {
    const apiKey = "YOUR_API_KEY";
    const apiUrl = `https://api.nasa.gov/planetary/apod?date=${date}&api_key=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(data => {
            displayImage(data);
            saveSearch(date);
            addSearchToHistory();
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });
}

function saveSearch(date) {
    let searches = JSON.parse(localStorage.getItem("searches")) || [];
    searches.push(date);
    localStorage.setItem("searches", JSON.stringify(searches));
}

function addSearchToHistory() {
    const searchHistory = document.getElementById("search-history");
    searchHistory.innerHTML = "";
    let searches = JSON.parse(localStorage.getItem("searches")) || [];

    searches.forEach(date => {
        const listItem = document.createElement("li");
        listItem.textContent = date;
        listItem.addEventListener("click", () => {
            getImageOfTheDay(date);
        });
        searchHistory.appendChild(listItem);
    });
}

function displayImage(data) {
    const container = document.getElementById("current-image-container");
    container.innerHTML = "";

    if (data.media_type === "image") {
        const img = document.createElement("img");
        img.src = data.url;
        img.alt = data.title;
        container.appendChild(img);
    } else {
        container.textContent = "No image available for this date.";
    }
}

document.getElementById("search-form").addEventListener("submit", function(event) {
    event.preventDefault();
    const date = document.getElementById("search-input").value;
    getImageOfTheDay(date);
});
