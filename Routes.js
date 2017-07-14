var map=null
var currentLocMarker,pos,result;
var markers=[];
var polygons=[];
var windows=[];
var initialized=false;
var allRests=null;
var JSON=[];
var count=0;
var airports=null;
var routes=null;
var flightPaths=[];
var numAirports=0;
var justAirports=[];
var first=true;
var pathsArr=[];
function init() {
	//clearOverlays();
}

function changeFunction(){
	var cat=document.getElementById("select").value;
	var airportList=document.getElementById("airpots").value.split(",");
	if(cat=="Airpots"){
		if(airports==null){
			getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat",function(x){
				var tempArr=x.split("\n");
				var arr=[];
				for(var i=0;i<tempArr.length;i++){
					var a=tempArr[i].split(",");
					justAirports.push(a);
					addAirport(a,airportList);
					arr[a[4]]=a;
				}
				airports=arr;
				if(!first)
					addChosenAirports(airportList);
				first=true;
			});
		}
		else{
			addChosenAirports(airportList);
		}

	}
	else{
		if(routes==null){
			getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat",function(x){
				var tempArr=x.split("\n");
				var arr=[];
				for(var i=0;i<tempArr.length;i++){
					var a=tempArr[i].split(",");
					arr.push(a);
					addRoutes(a,airportList);
				}
				routes=arr;
				addChosenRoutes(airportList);
				//console.log(pathsArr);
			}); 
		}
		else{
			setAllPaths(false);
			addChosenRoutes(airportList);

		}


	}
}

function addChosenRoutes(airportList){
	for(var i=0;i<airportList.length;i++){
		var flightArrPath=pathsArr[airportList[i].toUpperCase()];
		for (var j = flightArrPath.length - 1; j >= 0; j--) {
			flightArrPath[j].setVisible(true);
		};

	}
	// for(var j=0;j<routes.length;j++){
	// 	for(var i=0;i<airportList.length;i++){
	// 		var name=airportList[i].toUpperCase();
	// 		if(routes[j][2]==name){
	// 			flightPaths[j].setVisible(true);	
	// 		}
	// 	}
	// 	// var temp=airports["\""+airportList[j].toUpperCase()+"\""];

	// 	// if(temp!=null)
	// 	// 	markers[temp[0]].setVisible();
	// }
}

function addChosenAirports(airportList){

	for(var j=0;j<airportList.length;j++){
		var temp=airports["\""+airportList[j].toUpperCase()+"\""];

		if(temp!=null)
			markers[temp[0]].setVisible();
	}

}

function addRoutes(a){
	//console.log(a);
	var dep=airports["\""+a[2]+"\""];
	var arrival=airports["\""+a[4]+"\""];
	// console.log(dep);
	// console.log(arrival);
	if(dep!=null&&arrival!=null){
		var flightPlanCoordinates = [
		{lat: parseFloat(dep[6]), lng: parseFloat(dep[7])},
		{lat: parseFloat(arrival[6]), lng: parseFloat(arrival[7])},
		];

		var flightPath = new google.maps.Polyline({
			path: flightPlanCoordinates,
			geodesic: true,
			strokeColor: '#FF0000',
			strokeOpacity: 1.0,
			strokeWeight: 1
		});

		flightPath.setMap(map);
		flightPath.setVisible(false);
		flightPaths.push(flightPath);

		// if(a[2]=="ORD"&&a[4]=="LGA"){
		// 	console.log(flightPlanCoordinates)
		// 	var tempArr=[];
		// 	tempArr.push(flightPath);
		// 	pathsArr[a[2]]=tempArr
		// }
		if(pathsArr[a[2]]==null)
		{

			var tempArr=[];
			tempArr.push(flightPath);
			pathsArr[a[2]]=tempArr;


		}
		else
			pathsArr[a[2]].push(flightPath);
		}

	}

	function setBothFalse(){
		setAll(false);
		setAllPaths(false);
	}

	function setAllPaths(bool){
		for (var i = flightPaths.length - 1; i >= 0; i--) {
			flightPaths[i].setVisible(bool);
		}

	}

	function setAll(bool){
	// console.log(markers);
	// console.log(justAirports);
	// console.log(markers.length)
	for(var i=0;i<markers.length;i++){
		if(markers[i]!=null)
			markers[i].setVisible(bool);
	}
	
}

function addAirport(arr){

	var pos=createPositionArr(arr[6],arr[7]);
	var marker = new google.maps.Marker({
		map: map,
		title: arr[1],
		position: pos,
	});

	var contentString=arr[1];
	// temp['address']+'<br>zipcode:'+temp['zipcode']+
	// '<br>results:'+temp['results']+'<br>comments:'+format(temp['comments'])+'<br><br></left>';
	marker.content = contentString;


	var infowindow = new google.maps.InfoWindow();
	google.maps.event.addListener(marker, 'click', function(){
		infowindow.setContent(this.content);
		infowindow.open(map, this);
	});

	marker.setVisible(false);
	markers[arr[0]]=marker;

	
}

function getData(url,callback){
	var request = new XMLHttpRequest();
	request.open('GET',url, true);
	request.send(null);
	request.onreadystatechange = function () {
		if (request.readyState === 4 && request.status === 200) {

			callback(request.responseText);

		}
	}


}

function getJSON(myURL,callback){
	let url = myURL;
	fetch(url)
	.then(res => res.json())
	.then((out) => {
		callback(out);
	})
	.catch(err => console.error(err));
}

function recenterMap(pos){
	map.setCenter(pos);
	var marker = new google.maps.Marker({
		map: map,
		title: "Center Location",
		position: pos,
	});
	markers.push(marker);
}

function createPositionArr(lat,lng){
	var x={"lat":parseFloat(lat),"lng":parseFloat(lng)};
	return x;
}


function clearOverlays() {
	for (var i = 0; i < markers.length; i++ ) {
		markers[i].setMap(null);
	}
	markers.length = 0;
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}


function initMap() {
	var PE = {lat: 41.8908348, lng: -87.6272821};
	map = new google.maps.Map(document.getElementById('map'), {
		zoom: 3,
		center: PE,
		styles:[  {
			"featureType": "poi",
			"stylers": [
			{
				"visibility": "off"
			}
			]
		}]
	});
	changeFunction();
}
