// Initialize Leaflet map
let map = L.map('map').setView([0, 0], 2); // Center on the world
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    minZoom: 2,
    maxZoom: 5,
}).addTo(map);

async function fetchData() {
    const selectedDataset = document.getElementById('dataset').value; // Get the selected dataset
    let robustaData;

    try {
        const response = await fetch(`http://127.0.0.1:5000/${selectedDataset}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        robustaData = await response.json();
        createHeatmap(robustaData);
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

function createHeatmap(robustaData) {
    // Clear any existing heatmap layer
    if (window.heatLayer) {
        map.removeLayer(window.heatLayer);
    }

    // Convert data to Leaflet heat format
    const selectedYear = getAcademicYear(document.getElementById('year').value);
    const heatmapData = robustaData.map(prod => [
        prod.latitude, prod.longitude, prod[selectedYear] || 0 // Format for Leaflet Heatmap: [lat, lng, intensity]
    ]);

    // Add heatmap layer
    window.heatLayer = L.heatLayer(heatmapData, {
        radius: 25,    // Adjust radius size as needed
        blur: 15,      // Adjust blur for smoothness
        maxZoom: 10,   // Maximum zoom level for clustering
    }).addTo(map);
}

// Add event listener for dropdown changes
document.getElementById('dataset').addEventListener('change', fetchData);

// Add event listener for year input changes
document.getElementById('year').addEventListener('input', function() {
    const selectedYear = this.value;
    document.getElementById('yearValue').textContent = getAcademicYear(selectedYear);
    fetchData(); // Fetch data whenever the year changes
});

// Call fetchData on page load to initialize the heatmap
document.addEventListener('DOMContentLoaded', fetchData);

function getAcademicYear(year) {
    const nextYear = parseInt(year) + 1; // Increment the year to get the next year
    return `${year}/${nextYear.toString().slice(-2)}`; // Format as "YYYY/YY"
}