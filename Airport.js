var airports;

class Airport {
    constructor(airportDataFields, map) {
        this.airportName = airportDataFields[1];
        this.airportCode = airportDataFields[4];
        this.lat = airportDataFields[6];
        this.lng = airportDataFields[7];
        this.pos = createPositionArr(this.lat, this.lng);
        this.routes = [];
        this.map = map;
        this.color = randomColor();
        this.isClicked = false;
        this.isVisible = false;
        this.hasEnoughDestinations = false;

        this.marker = this.initMarker();
    }

    initMarker() {
        var marker = new google.maps.Marker({
            map: map,
            title: this.airportName,
            position: this.pos,
        });

        marker.content = this.airportName;

        google.maps.event.addListener(marker, 'click', () => {
            markerClick(this);
        });

        marker.setVisible(false);
        return marker;
    }

    hideRoutes() {

    }

    buildRoutesInfo() {
        var routesInfo = "";

        this.routes.forEach(route => {
            routesInfo += "\n\t" + route.arrivalAirport.airportName;
        })
        return routesInfo;
    }
    getRoutesInfo() {
        if (!this.routesInfo)
            this.routesInfo = this.buildRoutesInfo();
        return this.routesInfo;
    }

    hideIfApplicable() {
        if (this.isVisible && !this.isClicked) {
            this.changeVisibility(false);
        }
    }
    showIfApplicable() {
        if (!this.isVisible && this.hasEnoughDestinations) {
            this.changeVisibility(true);
        }
    }

    hide() {
        changeVisibility(false);
    }

    unClick() {
        this.isClicked = false;

        if (this.routesVisible) {
            this.changeVisibilityOfRoutes(false);
        }
        this.changeVisibility(this.hasEnoughDestinations);

        this.routesVisible = false;
    }

    click(showRoutes) {
        this.isClicked = true;

        if (showRoutes) {
            this.changeVisibilityOfRoutes(true);
            this.routesVisible = true;
        }

        this.changeVisibility(true);
    }

    changeVisibilityOfRoutes(bool) {
        this.routes.forEach(route => {
            route.changeVisibility(bool);
            if (bool)
                route.arrivalAirport.click(false);

        });
    }

    changeVisibility(bool) {
        if (this.isVisible != bool) {
            this.isVisible = bool;
            this.marker.setVisible(bool);
        }
    }
}

function initializeAirports() {
    var promise = new Promise(
        (resolve, reject) => {
            try {
                getData("https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat", (airportData) => {
                    airports = {};
                    airportData.split("\n").forEach(
                        airportText => {

                            var airportDataFields = cleanAirportField(airportText.split(","));
                            var airport = new Airport(airportDataFields, map);

                            if (airport.airportCode && airport.airportCode != "\N") {
                                airports[airport.airportCode] = airport;
                            }
                        })

                    resolve();
                });

            }
            catch (err) {
                reject(err);
            }


        });
    return promise.then();

}

function cleanAirportField(airportDataFields) {
    return airportDataFields.map(
        dataField => {
            return dataField.indexOf("\"") == -1 ? dataField : dataField.split("\"")[1];
        }
    )
}

function showApplicableAirports() {
    airportKeys().forEach(airportCode => {
        airports[airportCode].showIfApplicable();
    })
}

function hideApplicableAirports() {

    airportKeys().forEach(airportCode => {
        airports[airportCode].hideIfApplicable();
    })
}

function reset() {
    airportKeys().forEach(airportCode => {

        airports[airportCode].unClick();
        // airports[airportRoutes].hideRoutes();
    })
}

function markerClick(airport) {

    airport.click(true);

    hideApplicableAirports();
    map.setCenter(airport.pos);
}

function getAirports() {
    return airports;
}

function airportKeys() {
    return Object.keys(airports);
}