// var map = null
// var currentLocMarker, pos, result;
var markers = [];
// var polygons = [];
// var windows = [];
// var initialized = false;
// var allRests = null;
// var JSON = [];
// var count = 0;
var stateGeometries;
var airports = null;
var routes = null;
var flightPaths = [];
var airportRoutes = {};
var showAirportMarkers = false;
// var numAirports = 0;
// var justAirports = [];
// var first = true;
var pathsArr = [];
var routeColors = {};
function init() {
	//clearOverlays();
}

function toggleShowAirportMarkers() {
	showAirportMarkers = !showAirportMarkers;
}

function changeFunction() {

	var airportsList = document.getElementById("airports").value.split(",");

	console.log(showAirportMarkers);

	addChosenRoutes(airportsList);

}

function initializeAirports() {
	getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat", function (airportData) {
		airports = [];
		airportData.split("\n").forEach(
			airport => {
				var airportDataFields = cleanAirportField(airport.split(","));
				var airportName = airportDataFields[4];

				if (airportName && airportName != "\N") {
					addAirport(airportDataFields);
					airports[airportName] = airportDataFields;
				}
			});

		initializeRoutes();
	});
}
function initializeRoutes() {
	getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat", function (rawRouteData) {
		var routeData = rawRouteData.split("\n");
		routes = [];
		routeData.forEach(route => {
			var routeDataFields = route.split(",");
			routes.push(routeDataFields);
			addRoutes(routeDataFields);
		});
		initializeStateBorders();
	});
}

function initializeStateBorders() {
	var states_URL = "https://cors.io/?http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_040_00_500k.json";
	getData(states_URL, (rawStatesData) => {
		var statesDataJSON = JSON.parse(rawStatesData);
		 stateGeometries = {};
		statesDataJSON.features.forEach(stateGeometryData=>{
			stateGeometries[stateGeometryData.properties.NAME] = {
				"type":"FeatureCollection",
				"features":[stateGeometryData]
			}
		});
	})
}

function cleanAirportField(airportDataFields) {
	return airportDataFields.map(
		dataField => {
			return dataField.indexOf("\"") == -1 ? dataField : dataField.split("\"")[1];
		}
	)
}

function addChosenRoutes(airportsList) {
	setBothFalse(false);
	if (airportsList)
		airportsList.forEach(airportCode => {
			if (pathsArr) {
				if (showAirportMarkers) {
					var airportsToHighlight = airportRoutes[airportCode].slice();
					airportsToHighlight.push(airportCode);
					addChosenAirports(airportsToHighlight);
				}
				var flightArrPath = pathsArr[airportCode.toUpperCase()];
				flightArrPath.forEach(path => {
					path.setVisible(true);
				})
			}
		});
}

function addChosenAirports(airportList) {
	if (!airportList || airportList.length == 1 && airportList[0] == "")
		setAllAirports(true);
	else {
		setAllAirports(false);
		airportList.forEach(airportCode => {
			if (airports[airportCode]) {
				markers[airportCode].setVisible();
			}
		});
	}
}

function addRoutes(routeDataFields, color) {
	var departureAirportCode = routeDataFields[2];
	var arrivalAirportCode = routeDataFields[4];

	var dep = airports[departureAirportCode];
	var arrival = airports[arrivalAirportCode];
	var pathDetails = dep + " to " + arrival;
	if (dep && arrival) {
		var flightPlanCoordinates = [
			{ lat: parseFloat(dep[6]), lng: parseFloat(dep[7]) },
			{ lat: parseFloat(arrival[6]), lng: parseFloat(arrival[7]) },
		];

		var flightPath = new google.maps.Polyline({

			path: flightPlanCoordinates,
			geodesic: true,
			strokeColor: getColor(dep),
			strokeOpacity: 1.0,
			strokeWeight: 1
		});

		flightPath.setMap(map);
		flightPath.setVisible(false);
		flightPaths.push(flightPath);

		if (!pathsArr[departureAirportCode])
			pathsArr[departureAirportCode] = [];
		if (!airportRoutes[departureAirportCode])
			airportRoutes[departureAirportCode] = [];

		airportRoutes[departureAirportCode].push(arrivalAirportCode);
		pathsArr[departureAirportCode].push(flightPath);
	}

}

function setBothFalse() {
	setAllAirports(false);
	setAllPaths(false);
}

function setAllPaths(bool) {
	for (var i = flightPaths.length - 1; i >= 0; i--) {
		flightPaths[i].setVisible(bool);
	}

}

function setAllAirports(bool) {
	Object.keys(markers).forEach(
		key => markers[key].setVisible(bool)
	)
}

function getColor(departureAirportCode) {
	if (!routeColors[departureAirportCode])
		routeColors[departureAirportCode] = randomColor();
	return routeColors[departureAirportCode];
}

function randomColor() {
	var R_Value = Math.trunc(Math.random() * 256);
	var G_Value = Math.trunc(Math.random() * 256);
	var B_Value = Math.trunc(Math.random() * 256);

	return '#' + R_Value.toString(16) + G_Value.toString(16) + B_Value.toString(16);
	// '#FF0000'
}

function addAirport(airportDataFields) {
	var airportName = airportDataFields[1];
	var airportCode = airportDataFields[4];
	var lat = airportDataFields[6];
	var lng = airportDataFields[7];
	var pos = createPositionArr(lat, lng);
	var marker = new google.maps.Marker({
		map: map,
		title: airportName,
		position: pos,
	});

	marker.content = airportName;


	var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function () {
		infowindow.setContent(this.content);
		infowindow.open(map, this);
	});

	marker.setVisible(false);
	markers[airportCode] = marker;


}


function recenterMap(pos) {
	map.setCenter(pos);
	var marker = new google.maps.Marker({
		map: map,
		title: "Center Location",
		position: pos,
	});
	markers.push(marker);
}

function clearOverlays() {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}

function getData(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {

			callback(request.responseText);

		}
	}


}

function createPositionArr(lat, lng) {
	return { "lat": parseFloat(lat), "lng": parseFloat(lng) };
}