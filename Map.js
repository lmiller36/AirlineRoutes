function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

function createPositionArr(lat, lng) {
	return { "lat": parseFloat(lat), "lng": parseFloat(lng) };
}

function initMap() {
	var PE = { lat: 41.8908348, lng: -87.6272821 };
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: PE,
		styles: [{
			"featureType": "poi",
			"stylers": [
				{
					"visibility": "off"
				}
			]
		}]
	});

	var geocoder = new google.maps.Geocoder();

	// google.maps.event.addListener(map, 'click', function (event) {
	// 	geocoder.geocode({
	// 		'latLng': event.latLng
	// 	}, function (results, status) {
	// 		if (status == google.maps.GeocoderStatus.OK) {
	// 			var stateData = null;
	// 			if (stateGeometries)
	// 				results[0].address_components.forEach(component => {
	// 					if (stateGeometries[component.long_name])
	// 						stateData = stateGeometries[component.long_name];
	// 				});
	// 			if (stateData) {
	// 				map.data.addGeoJson(stateData);

	// 			//	var dataLayer = map.data;
	// 			//	var layerBounds = new google.maps.LatLngBounds();
	// 				//1.collect all coordinates from data layer
	// 				map.data.forEach(function (f) {
	// 					// console.log( google.maps.geometry.poly.containsLocation(event,f))
	// 					// console.log(f);
	// 					// var geometry = f.getGeometry();
	// 					// console.log(geometry);
	// 					// console.log(layerBounds.extend);
	// 					// console.log(layerBounds);

	// 					//processCoordinates(geometry, layerBounds.extend, layerBounds);
	// 				});
	// 				//google.maps.geometry.poly.containsLocation(event.latLng, stateData)
	// 			}
	// 		}
	// 	});



	// });
	//  map.data.loadGeoJson("");
	initializeAirports();


}