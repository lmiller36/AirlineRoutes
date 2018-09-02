function initializeGeoJSON(){
    var US_States = "http://eric.clst.org/assets/wiki/uploads/Stuff/gz_2010_us_outline_500k.json";
    getJSON(US_States,(arr)=>{
        console.log(arr);
    });
}