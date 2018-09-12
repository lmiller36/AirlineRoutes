var min = 10;

class Route {
    constructor(routeDataFields, airports, map) {
        this.departureAirportCode = routeDataFields[2];
        this.arrivalAirportCode = routeDataFields[4];
        this.pathDetails = this.departureAirportCode + " to " + this.arrivalAirportCode;

        this.departureAirport = airports[this.departureAirportCode];
        this.arrivalAirport = airports[this.arrivalAirportCode]
        this.isValid = this.departureAirport && this.arrivalAirport;
        // var dep = airports[departureAirportCode];
        // var arrival = airports[arrivalAirportCode];
        if (this.isValid) {
            this.flightPlanCoordinates = [
                this.departureAirport.pos,
                this.arrivalAirport.pos,
            ];

            this.flightPath = new google.maps.Polyline({

                path: this.flightPlanCoordinates,
                geodesic: true,
                strokeColor: this.departureAirport.color,
                strokeOpacity: 1.0,
                strokeWeight: 1
            });

            this.flightPath.setMap(map);
            this.flightPath.setVisible(false);

            this.departureAirport.routes.push(this);
            //flightPaths.push(flightPath);

            // 	if (!pathsArr[departureAirportCode])
            // 		pathsArr[departureAirportCode] = [];
            // 	if (!airportRoutes[departureAirportCode])
            // 		airportRoutes[departureAirportCode] = [];

            // 	airportRoutes[departureAirportCode].push(arrivalAirportCode);
            // 	pathsArr[departureAirportCode].push(flightPath);
        }

    }

    changeVisibility(bool){
       this.flightPath.setVisible(bool);
    }
}

function initializeRoutes(){
    var promise = new Promise(
         (resolve,reject) => {
             try {
                getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/routes.dat", function (rawRouteData) {
                    var routeData = rawRouteData.split("\n");
            
                    routeData.forEach(route => {
                        var routeDataFields = route.split(",");
                        var route = new Route(routeDataFields, getAirports(), map);
                    });

                    updateDestinationRestrictions(0);

                    resolve();
                });
             }
             catch (err) {
                 reject(err);
             }
     
         
         });
     return promise.then();
     
 }

 
function updateDestinationRestrictions(change) {
    min += change;
    document.getElementById("min").innerHTML = "Airports with  " + min + "+ destinations are currently visible";
    var airport = getAirports();
    airportKeys().forEach(airportCode => {
        var airport = airports[airportCode];
        if (airport.routes && airport.routes.length > min) {
            airport.hasEnoughDestinations = true;
        }
        else
            airport.hasEnoughDestinations = false;
        airport.changeVisibility(airport.hasEnoughDestinations);
    });
}
