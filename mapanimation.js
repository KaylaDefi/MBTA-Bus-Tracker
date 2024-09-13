let map;
let markers = [];

// load map
function init(){
    let customMapStyle = [
        {
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#8ec3b9"
            }
          ]
        },
        {
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1a3646"
            }
          ]
        },
        {
          "featureType": "administrative.country",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "administrative.land_parcel",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#64779e"
            }
          ]
        },
        {
          "featureType": "administrative.province",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#4b6878"
            }
          ]
        },
        {
          "featureType": "landscape.man_made",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#334e87"
            }
          ]
        },
        {
          "featureType": "landscape.natural",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#6f9ba5"
            }
          ]
        },
        {
          "featureType": "poi",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#3C7680"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#304a7d"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "road",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#2c6675"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [
            {
              "color": "#255763"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#b0d5ce"
            }
          ]
        },
        {
          "featureType": "road.highway",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#023e58"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#98a5be"
            }
          ]
        },
        {
          "featureType": "transit",
          "elementType": "labels.text.stroke",
          "stylers": [
            {
              "color": "#1d2c4d"
            }
          ]
        },
        {
          "featureType": "transit.line",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#283d6a"
            }
          ]
        },
        {
          "featureType": "transit.station",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#3a4762"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [
            {
              "color": "#0e1626"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#4e6d70"
            }
          ]
        }
      ];
    let myOptions = {
        zoom      : 14,
        center    : { lat:42.353350, lng:-71.091525 },
        mapTypeId : google.maps.MapTypeId.ROADMAP,
        styles    : customMapStyle
    };
    let element = document.getElementById('map');
    map = new google.maps.Map(element, myOptions);
    addMarkers();
}

async function addMarkers() {
  try {
      let locations = await getBusLocations();

      if (locations && locations.length > 0) {
          console.log("Bus locations retrieved:", locations);
      } else {
          console.warn("No bus locations returned by API.");
          return;
      }

      locations.forEach(function(bus) {
          let marker = getMarker(bus.id);
          if (marker) {
              moveMarker(marker, bus);
          } else {
              addMarker(bus);
          }
      });

      console.log("Markers updated at:", new Date());

      setTimeout(addMarkers, 15000);
  } catch (error) {
      console.error("Error fetching bus locations:", error);
  }
}

async function getBusLocations() {
  let url = '/api/getBusLocations'; 

  try {
      let response = await fetch(url);

      if (!response.ok) {
          console.error("Failed to fetch MBTA data. Status:", response.status);
          return [];
      }

      let json = await response.json();

      console.log("MBTA API response:", json);

      return json.data;
  } catch (error) {
      console.error("Error during fetch:", error);
      return [];
  }
}

function addMarker(bus) {
  if (!bus.attributes.latitude || !bus.attributes.longitude) {
      console.error("Bus location data is missing for Bus ID:", bus.id);
      return;
  }

  let icon = getIcon(bus);

  console.log("Adding marker for Bus ID:", bus.id, "at position:", bus.attributes.latitude, bus.attributes.longitude);

  let marker = new google.maps.Marker({
      position: { lat: bus.attributes.latitude, lng: bus.attributes.longitude },
      map: map,
      icon: icon,
      id: bus.id
  });

  markers.push(marker);
}

function getIcon(bus) {
  console.log("Bus direction ID:", bus.attributes.direction_id);

  if (bus.attributes.direction_id === 0) {
      return 'red.png';  
  }
  return 'blue.png';  
}

function moveMarker(marker, bus) {
  let icon = getIcon(bus);

  console.log("Moving marker for Bus ID:", bus.id, "to position:", bus.attributes.latitude, bus.attributes.longitude);

  marker.setIcon(icon);
  marker.setPosition({ lat: bus.attributes.latitude, lng: bus.attributes.longitude });
}

function getMarker(id) {
  return markers.find(function(item) {
      return item.id === id;
  });
}

window.onload = init;