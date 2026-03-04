mapboxgl.accessToken = 'pk.eyJ1IjoiY2hlbmphbmEiLCJhIjoiY21rNGdpc3BoMDdiNzNlb3Yxbm02dGpwOCJ9.xYpWe_CkRr_Oe_Q-DtaVYw'; //***ADD YOUR ACCESS TOKEN HERE***

const map = new mapboxgl.Map({
    container: 'my-map',
    style: 'mapbox://styles/mapbox/standard',
    config: {
        basemap: {
            theme: "monochrome"
        }
    },
    center: [-79.4133, 43.7725],
    zoom: 12,
    minZoom: 6
});

/*--------------------------------------------------------------------
MAP CONTROLS
--------------------------------------------------------------------*/
map.addControl(new mapboxgl.NavigationControl());
map.addControl(new mapboxgl.FullscreenControl());

const geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl,
    countries: "ca"
});

document.getElementById('geocoder').appendChild(geocoder.onAdd(map));

// Load the map
map.on('load', () => {

// 1. ADD DATA SOURCES
    // Add a data source containing GeoJSON data
    map.addSource('Restaurants-Data', {
        'type': 'geojson',
        'data': 'https://raw.githubusercontent.com/JananChen/GGR472Lab3/main/data/restaurants.geojson' // Add restaurants point data source path
    });
// 2. VISUALIZE DATA LAYERS
    map.addLayer({
        'id': 'restaurants-pnt',
        'type': 'circle', // Choose the symbol to be a circle
        'source': 'Restaurants-Data', // Get data from the Restaurants-Data data source
        'paint': {
            'circle-radius': 8, // Set radius of restaurant points
            'circle-color': [
                'step',
                ['get', 'Stars'],
                '#fd3c3c',
                2, '#fc972a',
                3, '#e3e01a',
                4, '#adbd00',
                5, '#008015'
            ] // Set colour of restaurant points depending on their stars
        }
    });

});
/*--------------------------------------------------------------------
CREATE LEGEND IN JAVASCRIPT
--------------------------------------------------------------------*/
// Declare array variables for labels and colours
const legenditems = [
    { label: '1', colour: '#fd3c3c' },
    { label: '2', colour: '#fc972a' },
    { label: '3', colour: '#e3e01a' },
    { label: '4', colour: '#adbd00' },
    { label: '5', colour: '#008015' }
];

// For each array item create a row to put the label and colour in
legenditems.forEach(({ label, colour }) => {
    const row = document.createElement('div'); // each item gets a 'row' as a div - this isn't in the legend yet, we do this later
    const colcircle = document.createElement('span'); // create span for colour circle

    colcircle.className = 'legend-colcircle'; // the colcircle will take on the shape and style properties defined in css
    colcircle.style.setProperty('--legendcolour', colour); // a custom property is used to take the colour from the array and apply it to the css class

    const text = document.createElement('span'); // create span for label text
    text.textContent = label; // set text variable to tlegend label value in array

    row.append(colcircle, text); // add circle and text to legend row
    legend.appendChild(row); // add row to legend container
});

/*--------------------------------------------------------------------
ADD INTERACTIVITY BASED ON HTML EVENT
--------------------------------------------------------------------*/

// 1) Add event listener which returns map view to full screen on button click using flyTo method
document.getElementById('returnbutton').addEventListener('click', () => {
    map.flyTo({
        center: [-79.4133, 43.7725],
        zoom: 12,
        essential: true
    });
});


// 2) Change display of legend based on check box
let legendcheck = document.getElementById('legendcheck');

legendcheck.addEventListener('click', () => {
    if (legendcheck.checked) {
        legendcheck.checked = true;
        legend.style.display = 'block';
    }
    else {
        legend.style.display = "none";
        legendcheck.checked = false;
    }
});


// 3) Change map layer display of restaurants based on check box using setLayoutProperty method
document.getElementById('layercheck').addEventListener('change', (e) => {
    map.setLayoutProperty(
        'restaurants-pnt',
        'visibility',
        e.target.checked ? 'visible' : 'none'
    );
});

// 4) Filter data layer to show selected stars of restaurants from dropdown selection
let starvalue;

document.getElementById("Starsset").addEventListener('change',(e) => {   
    starvalue = document.getElementById('StarsN').value;

    //console.log(boundaryvalue); // Useful for testing whether correct values are returned from dropdown selection

    if (starvalue == 'All') {
        map.setFilter(
            'restaurants-pnt',
            null // Resets the filter to show all restaurants
        );
    } else {
        map.setFilter(
            'restaurants-pnt',
            ['==', ['get', 'Stars'], Number(starvalue)] // Shows only selected star value of restaurants
        );
    }

});









