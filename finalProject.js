// FINAL Project 6.859 -- Elina Oikonomaki

// containins all of the timeline Elements
let timeLineSVGDocument;
// the JSON-Object
let dayJSONObj;
// current Walks Json;
let currentWalksJSONObj = {};
var sketchWidth;
var sketchHeight;
let geoJSON;
var allPoints = {};
let mappa;

var objCalls = 0;

//Elina's access token 
mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpbmFvaWsiLCJhIjoiY2tidWwzenhvMDVyMTJ4bzVyYWVlMGdkZSJ9.ZzKoxiO3-YaCk4CJilMPVA';

mappa = new mapboxgl.Map({
container: 'mapboxContainer', // container id
style: 'mapbox://styles/elinaoik/ckov2hlfu7c1517mdfm2qx7zq', // style URL
center: [-71.115, 42.372], // starting position [lng, lat]
zoom: 15.26 // starting zoom
});

// some p5 to load the local JSON as object
function setup(){
    
    dayJSONObj = loadJSON("/data/activedays.json");

    sketchWidth = document.getElementById("p5-sketch-Container").offsetWidth;
    sketchHeight = document.getElementById("p5-sketch-Container").offsetHeight;
    var canvas =createCanvas(sketchWidth, sketchHeight);


    // Move the canvas so it’s inside our <div id="sketch-holder">.
    canvas.parent('p5-sketch-Container');
        //Mapbox
 

}

var c = [[0, 1], [0, 0.5, 0.5, 1]];

function draw() {

  frameRate(2);


  background(255);
  
  // console.log(glob_x);
  var all_ln_glob_x = [];

  var tracks = Object.keys(allPoints).length

  var cls = ['red', 'green', 'blue', 'magenta']

/*
 * 0 -> 1       map( 0, height)
 * 0 -> 0.5     map(0.5,
 */


  if( tracks > 0){
      for (let walkIdx in allPoints){
        for (let ptIdx in allPoints[walkIdx]){
        // console.log(allPoints[walkIdx][ptIdx].duration);
            //
            for (var i = 0; i < tracks; i++){
                //stroke(int(allPoints[walkIdx][ptIdx].colorShade));
                stroke(cls[i]);
                line(all_ln_glob_x[i], i*height/tracks + 3, all_ln_glob_x[i], (i+1)*height/tracks) - 3 ;
                push();

                textSize(8);
                noStroke();
                translate(all_ln_glob_x[i] + 10 , i*height/tracks + 10);
                rotate(radians(45));
                fill(cls[i]);
                if (allPoints[walkIdx][ptIdx]['geoPt']['properties']['phase']['name']){
                    text(allPoints[walkIdx][ptIdx]['geoPt']['properties']['phase']['name'],0,0 );
                    ellipse(-5,-5,5,5);
                }

                pop();

                // the 5 is the distance we need to change
                if(!all_ln_glob_x[i]){
                    all_ln_glob_x[i] = 0;
                }
                all_ln_glob_x[i] += allPoints[walkIdx][ptIdx].duration ;
                allPoints[walkIdx][ptIdx].globX = all_ln_glob_x[i];
            }
         }
      }

  }

  for (let walkIdx in allPoints){
    tracks += 1
    for (let ptIdx in allPoints[walkIdx]){ 
      
      // MouseOverVLines(tracks,allPoints[walkIdx][ptIdx].globX,allPoints[walkIdx][ptIdx].globX_2);
      MouseOverVLines(tracks,'','');

  }
    
}}

function MouseOverVLines(n,x1,x2){
    y_values = [];

    for (var i=0; i<n.length; i++){
        div = i+1;
        y = height/div;
        y_values.push(y);
    }

    // console.log(y_values);

      // for(var i=0; i<y_values, i++){

      //   y2 += curr_y[i] + curr_y[i+1];

      //   if (int(mouseX) >= x1 - 2 && int(mouseX) <= x1 +2 && int(mouseY) >= y_values[i] && int(mouseY) <= y2){
      //   push();
      //   stroke('red');
      //   strokeWeight(20);
      //   line(x1, y_values[i], x1, y2);
      //   pop();
      //   }
      // }    
  }
  


  

    

function windowResized() {
  sketchWidth = document.getElementById("p5-sketch-Container").offsetWidth;
  sketchHeight = document.getElementById("p5-sketch-Container").offsetHeight;
  resizeCanvas(sketchWidth, sketchHeight);
}

// var newurl = "https://dl.dropboxusercontent.com/s/d0xsijpf5v8g97a/08012020_PM.json?raw=1";
// -------- DOM Events
document.addEventListener('DOMContentLoaded', function () {
    //Fires after the html has loaded    
    assignTimeLineButtonActivity();

    

});

// --------- 1. DOMCONTENTLOADED DOM FUNCTIONS
// --------- Contains all the functions that are called in the DOMContentLoaded EL.
function assignTimeLineButtonActivity (){

    // we load the JSON
    // we get the SVG
    var tmlsvg = document.getElementById("timelineSVG");

    // we wait until the SVG is loaded then we get the document
    tmlsvg.addEventListener('load', function(){
        timeLineSVGDocument = tmlsvg.contentDocument;

        // we create
        var linkElm = timeLineSVGDocument.createElementNS("http://www.w3.org/1999/xhtml", "link");
        linkElm.setAttribute("href", "../style.css");
        linkElm.setAttribute("type", "text/css");
        linkElm.setAttribute("rel", "stylesheet");

        // css injection
        $("svg",timeLineSVGDocument).first().prepend(linkElm);
        // remove inline css 
        $("style",timeLineSVGDocument).remove();

        // AM AND PM
        var timelineBoxesPM = $("[id*='_PM']", timeLineSVGDocument)
        var timelineBoxesAM = $("[id*='_AM']", timeLineSVGDocument)

        // THE AM BOXES
        timelineBoxesAM.each(function(){
            // cleaning up the id
            var replaceId = $(this)[0].id.replace('_x3', '').replace('_', '').replace('_x5F','');
            $(this).attr('id',replaceId);
            // adding an additional Color
            $(this).addClass('timelineBoxAMDefault');

            // EventListener for Morning Boxes
            $(this).on("mouseover", function(){
                if (!$(this).hasClass('timelineBoxAMSelected')){
                    $(this).addClass('timelineBoxAMActive').removeClass('timelineBoxAMDefault');
                    // nested svg
                    //console.log($("#timeLineButtonDeselectAll",timeLineSVGDocument));
                    // external svg
                    //console.log($("#photoSVGContainer",document));
                }
            });

            $(this).on("mouseleave", function(){
                if (!$(this).hasClass('timelineBoxAMSelected')){
                    $(this).removeClass('timelineBoxAMActive').addClass('timelineBoxAMDefault');
                }
            });

            //Loading JSON files on click //

            $(this).on("click", function(e){
                if (!$(this).hasClass('timelineBoxAMSelected')){
                    $(this).removeClass('timelineBoxAMActive').removeClass('timelineBoxAMDefault').addClass('timelineBoxAMSelected');
                    // we retrieve the right json for this element

                    var dayVal = dayJSONObj.days[$(this).attr('id')];
                    // if the url is not null we set the current walk to
                    if (dayVal.url != ""){
                        updateCurrentWalkJSON(dayVal.url, $(this).attr('id'))
                    }

                    // this waits for the variable to be be true until then it does nothing
                    (async() => {
                        while(!currentWalksJSONObj.hasOwnProperty($(this).attr('id'))) // define the condition as you like
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        console.log("AM");
                        createDurationPath(this.id);
                        createMapPts(mappa);

                    })();
                } else {
                    $(this).removeClass('timelineBoxAMSelected');
                    // remove the data from the walk again
                    delete currentWalksJSONObj[$(this).attr('id')];
                    // delete horizontal lines
                    // $("[id*='_linearPath']", document).remove();
                }
              
            });
        });

        // THE PM BOXES
        timelineBoxesPM.each(function(){
            // cleaning up the id
            var replaceId = $(this)[0].id.replace('_x3', '').replace('_', '').replace('_x5F','');
            $(this).attr('id',replaceId);
            // adding an additional Color
            $(this).addClass('timelineBoxPMDefault');

            // EventListener for Morning Boxes
            $(this).on("mouseover", function(){
                if (!$(this).hasClass('timelineBoxPMSelected')){
                    $(this).addClass('timelineBoxPMActive').removeClass('timelineBoxPMDefault');
                }
            });

            $(this).on("mouseleave", function(){
                if (!$(this).hasClass('timelineBoxPMSelected')){
                    $(this).removeClass('timelineBoxPMActive').addClass('timelineBoxPMDefault');
                }
            });


            $(this).on("click", function(e){
                
                if (!$(this).hasClass('timelineBoxPMSelected')){
                    $(this).removeClass('timelineBoxPMActive').removeClass('timelineBoxPMDefault').addClass('timelineBoxPMSelected');
                    
                    // we retrieve the right json for this element
                    var dayVal = dayJSONObj.days[$(this).attr('id')];
                    // if the url is not null we set the current walk to
                    if (dayVal.url != ""){
                        updateCurrentWalkJSON(dayVal.url, $(this).attr('id'))
                    }

                    // this waits for the variable to be be true until then it does nothing
                    (async() => {
                        while(!currentWalksJSONObj.hasOwnProperty($(this).attr('id'))) // define the condition as you like
                            await new Promise(resolve => setTimeout(resolve, 1000));
                         
                        createDurationPath(this.id);
                        createMapPts(mappa);
                        
  
                        
                        // createPath();
                    })();

                } else {
                    $(this).removeClass('timelineBoxPMSelected');
                    // remove the data from the walk again
                    delete currentWalksJSONObj[$(this).attr('id')];

                    // delete horizontal lines
                    $("[id*='_linearPath']", document).remove();

                    // horElemC = 0;
                }
              
            });
        });

        // THE DESELECT ALL ELEMENTS BUTTON
        $('#timeLineButtonDeselectAll' ,timeLineSVGDocument).each(function(){
            $(this).on("click", function(){
                // remove selection
                $('.timelineBoxPMSelected', timeLineSVGDocument).removeClass('timelineBoxPMSelected').addClass('timelineBoxPMDefault');
                $('.timelineBoxAMSelected', timeLineSVGDocument).removeClass('timelineBoxAMSelected').addClass('timelineBoxAMDefault');
                // delete horizontal lines  
                 $("[id*='_linearPath']", document).remove();
                    horElemC = 0;
                    allPoints = {};

                //reset walks
                currentWalksJSONObj = {};
            });
        });
    });
}


//

function createDurationPath(timeId){   
    var calls = 0;
    console.log("hello");
      for (let currObj in currentWalksJSONObj){
          // console.log(Object.keys(currentWalksJSONObj));
          // console.log(currentWalksJSONObj[currObj].features);
            tmpPt = [];
            currentWalksJSONObj[currObj].data.features.forEach(function(point){
              var colorShade = map(point.properties.duration, 0, 40, 0, 255);
              var currPt = new gpsPoint(point, point.properties.duration, colorShade);
              currPt.colorShade = colorShade;              
              tmpPt.push(currPt);              
            });
            allPoints[timeId] = tmpPt;
            // console.log(allPoints);           
      }
};



function gpsPoint(geoPt, duration, colorShade){ 
                 this.geoPt = geoPt;
                 this.duration = duration;
                 this.colorShade = colorShade;
                 this.globX = '';
                }    

// --------- REQUEST UTILS

function updateCurrentWalkJSON(url, callerId) {

    /*
    * returns async json from DROPBOX
    * Needs to have the format: https://dl.dropboxusercontent.com/s/myjsonhash.json?raw=1
    */

    async function fetchDropboxJSON(urlA){
        let response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {},
            referrer: 'no-referrer',})
        let data = await response.json()
        return data;
    };

    async function main(){
        currentWalksJSONObj[callerId] = await fetchDropboxJSON(url);
    }
    main();
}


// --------- SVG UTILS

function dayBoxAddEventListener(svgElem){
    /* 
     * Event Listeners for svg day boxes
     */

    // when the mouse enters the line
    svgElem.addEventListener("mouseenter", function( event ) {
      // focus the mouseenter target
      svgElem.clssList.add('lineHi');
      svgElem.classList.remove('lineClick');
      //svgC.appendChild(svgElem);
    }, false);

    // when the mouse leaves the line
    svgElem.addEventListener("mouseleave", function( event ) {
      // unfocus the mouseleave target
      svgElem.classList.remove('lineUp');
      svgElem.classList.remove('lineHi');
    }, false);

    // when the mouse clicks the line
    // https://css-tricks.com/svg-line-animation-works/
    svgElem.addEventListener("click", function( event ) {
    console.log("mouse clicking: " + event.target.id);
    }, false);
}





function createMapPts(){   
    var calls = 0;
    console.log("hello MAP");

    mappa = new mapboxgl.Map({
    container: 'mapboxContainer', // container id
    style: 'mapbox://styles/elinaoik/ckov2hlfu7c1517mdfm2qx7zq', // style URL
    center: [-71.115, 42.372], // starting position [lng, lat]
    zoom: 15.26 // starting zoom
    });



    var song;

    var currMap;

//     const list = ['a', 'b', 'c'];
// for (let x of enumerate(list)) {
   
// }

      var count=0;
      for (let currObj in currentWalksJSONObj){
          console.log(count);
          currMap = currentWalksJSONObj[currObj];
          
          console.log('currMap'+[count]);



          mappa.on('load', function(){
          mappa.addSource('currMap'+[count], currMap);
          mappa.addLayer({
              'id': 'currMap'+[count],
              'type': 'circle',
              'source': 'currMap'+[count],
              // 'source-layer':'currMap'+{count},
              'layout':{'visibility':'visible'},
              'paint': {
                        'circle-color': 'white',
                        'circle-opacity':0.5,
                        'circle-radius':['get','duration']                       
              }
          });

          // Create a popup, but don't add it to the map yet.
          var popup = new mapboxgl.Popup({
              className: "currWalk-popup",
              closeButton: true,
              closeOnClick: true,
          }).setMaxWidth(600);
          
          mappa.on('mouseenter', 'currMap'+[count], function (e) {
              // Change the cursor style as a UI indicator.
              mappa.getCanvas().style.cursor = 'pointer';

              //console.log(currMap);

              var coordinates = e.features[0].geometry.coordinates.slice();
              //console.log("coordinates");
              var time = e.features[0].properties.time;
              //console.log(time);
              var duration = e.features[0].properties.duration;
              
              // '<audio controls><source src="'+sound'+" type="audio/mp3"></audio>'

              var d_time = "<h2 style='color:red;'>" + time + "</h2>";
              var d_duration = "<div class=duration>duration: " + duration + "</div>";
              // var d_description = "<div>description: " + description + "</div>";
              var d_coordinates = "<div>coordinates: " + coordinates + "</div>";

              // Ensure that if the map is zoomed out such that multiple
              // copies of the feature are visible, the popup appears
              // over the copy being pointed to.
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                  coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }

              // Populate the popup and set its coordinates
              // based on the feature found.
              popup.setLngLat(coordinates).setHTML(d_time+d_duration).addTo(mappa);                                                                                                                                       
          });

          mappa.on('click', function (e) {
              // Change the cursor style as a UI indicator.
              mappa.getCanvas().style.cursor = 'pointer';

              

              // var coordinates = e.features[0].geometry.coordinates.slice();
              // console.log("coordinates");
              // var time = e.features[0].properties.time;
              var SoundUl = e.properties['sound'].url;
              console.log(SoundUl);
              console.log(currMap);
              // var duration = e.features[0].properties.duration;

            // console.log(currMap);

            //   var s = e.features[0].properties;
            //   console.log(s);
            // for (var i=0; i<s.length; i++){
            //   console.log(s[0]);
            // }
                      
            // var sound = e.features[0].properties.sound.url;
            // var song = loadSound(sound);
            // song.play();
          });

          mappa.on('mouseleave', 'currMap'+[count], function (e) {
              mappa.getCanvas().style.cursor = '';
              popup.remove();
              // var sound = e.features[0].properties.sound.url;
              // var song = loadSound(sound);
              // song.pause();
          });        
    });

    //Adding buttons and toggle for  layers
        // After the last frame rendered before the map enters an "idle" state.
    mappa.on('idle', function () {
        // If these two layers have been added to the style,
        // add the toggle buttons.
        if (mappa.getLayer('currMap'+[count])) {
            // Enumerate ids of the layers.
            var toggleableLayerIds = ['currMap'+[count]];
            // Set up the corresponding toggle button for each layer.
            for (var i = 0; i < toggleableLayerIds.length; i++) {
                var id = toggleableLayerIds[i];
                if (!document.getElementById(id)) {
                    // Create a link.
                    var link = document.createElement('a');
                    link.id = id;
                    link.href = '#';
                    link.textContent = id;
                    link.className = 'Toggle-active';
                    // Show or hide layer when the toggle is clicked.
                    link.onclick = function (e) {
                        var clickedLayer = this.textContent;
                        e.preventDefault();
                        e.stopPropagation();

                        var visibility = mappa.getLayoutProperty(
                            clickedLayer,
                            'visibility'
                        );

                        // Toggle layer visibility by changing the layout object's visibility property.
                        if (visibility === 'visible') {
                            mappa.setLayoutProperty(
                                clickedLayer,
                                'visibility',
                                'none'
                            );
                            this.className = '';
                        } else {
                            this.className = 'Toggle-active';
                            mappa.setLayoutProperty(
                                clickedLayer,
                                'visibility',
                                'visible'
                            );
                        }
                    };

                    var layers = document.getElementById('menu');
                    layers.appendChild(link);
                }
            }
        }});


    count ++;      
  }

  //currMap = currentWalksJSONObj[currObj];
  console.log("Before---");
  // console.log(currMap);  
};


// p1.bindPopup('<h3>transformation Phase 1</h3><p>June 7th-8th</p><img src="../img/7th/IMG_0955.jpeg" style="width: 50%"> <img src="../img/8th/Frame-25-06-2020-09-26-55.jpeg" style="width: 50%"> <video width="320" height="240" controls><source src="movie.mp4" type="video/mp4"> <source src="movie.ogg" type="video/ogg">Your browser does not support the video tag.</video> <audio controls><source src="horse.ogg" type="audio/ogg"> <source src="horse.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio> <audio controls><source src="horse.ogg" type="audio/ogg"><source src="horse.mp3" type="audio/mpeg">Your browser does not support the audio element.</audio>',{maxWidth:500,maxZoom:10});

