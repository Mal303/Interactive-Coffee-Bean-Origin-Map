// Initialize the map and set its view to a geographical center
var map = L.map('map').setView([0, 0], 2); // Centered on the world with zoom level 2

// Add a tile layer (map imagery) from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
}).addTo(map);

// Coffee production data for 2024/2025 (measured in 1000 60 KG bags)
var coffeeData = [
    { country: "Angola", production: 25 },
    { country: "Bolivia", production: 100 },
    { country: "Brazil", production: 69900 },
    { country: "Burundi", production: 215 },
    { country: "Cameroon", production: 300 },
    { country: "China", production: 1900 },
    { country: "Colombia", production: 12400 },
    { country: "Congo (Kinshasa)", production: 275 },
    { country: "Costa Rica", production: 1100 },
    { country: "Cote d'Ivoire", production: 1400 },
    { country: "Cuba", production: 100 },
    { country: "Dominican Republic", production: 125 },
    { country: "Ecuador", production: 355 },
    { country: "El Salvador", production: 450 },
    { country: "Ethiopia", production: 8360 },
    { country: "Guatemala", production: 3120 },
    { country: "Guinea", production: 175 },
    { country: "Honduras", production: 5300 },
    { country: "India", production: 6000 },
    { country: "Indonesia", production: 10900 },
    { country: "Jamaica", production: 15 },
    { country: "Kenya", production: 750 },
    { country: "Laos", production: 450 },
    { country: "Madagascar", production: 300 },
    { country: "Malawi", production: 10 },
    { country: "Malaysia", production: 1500 },
    { country: "Mexico", production: 3900 },
    { country: "Nicaragua", production: 2685 },
    { country: "Panama", production: 75 },
    { country: "Papua New Guinea", production: 875 },
    { country: "Peru", production: 4250 },
    { country: "Philippines", production: 450 },
    { country: "Rwanda", production: 275 },
    { country: "Sierra Leone", production: 50 },
    { country: "Tanzania", production: 1400 },
    { country: "Thailand", production: 700 },
    { country: "Togo", production: 100 },
    { country: "Uganda", production: 6400 },
    { country: "United States", production: 50 },
    { country: "Venezuela", production: 500 },
    { country: "Vietnam", production: 29000 }
];

// Fetch the GeoJSON data from the URL
fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
    .then(response => response.json())
    .then(geoData => {
        // Map coffee production data to the GeoJSON countries
        geoData.features.forEach(function(feature) {
            let countryName = feature.properties.ADMIN;  // Country name in the GeoJSON file
            let productionInfo = coffeeData.find(coffee => coffee.country === countryName);
            feature.properties.production = productionInfo ? productionInfo.production : 0;  // Add production data
        });

        // Style the countries based on coffee production levels
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.production), // Set the color based on production
                weight: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }

        // Function to determine color based on production levels
        function getColor(production) {
            return production > 20000 ? '#800026' :
                   production > 10000 ? '#BD0026' :
                   production > 5000  ? '#E31A1C' :
                   production > 1000  ? '#FC4E2A' :
                   production > 500   ? '#FD8D3C' :
                   production > 0     ? '#FEB24C' :
                                        '#FFEDA0';
        }

        // Add GeoJSON layer to the map
        L.geoJson(geoData, {
            style: style, // Apply the style to the GeoJSON data
            onEachFeature: function (feature, layer) {
                // Display a popup with the country name and production level
                layer.bindPopup("<b>" + feature.properties.ADMIN + "</b><br>Production: " + feature.properties.production + " (2024/25)<br>Measured in 1000 KG bags");
            }
        }).addTo(map);
    })
    .catch(error => console.error('Error loading GeoJSON:', error));
