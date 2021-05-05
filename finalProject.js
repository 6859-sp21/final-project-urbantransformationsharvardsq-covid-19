/*
 * 
 * ELINA'S PROJECT
 *
 */

// containins all of the timeline Elements
let timeLineSVGDocument;
// the JSON-Object
let dayJSONObj;
// current Walks Json;
let currentWalksJSONObj = {};



//---------P5---

var lineCurr = null;
var DataArr; 
// contains all of the LineSegments JS-Objects
var LineSegments = [];
var horElemC = 15;

let XSCREENEXP = 504; 
let YSCREENEXP = 370;
let screenWidth = window.innerWidth;
let screenHeight = window.innerHeight;

//for the MAP variables
//Walk Bouding Box:
//Bottom right :  42.369962, -71.113062  
//Top left :  42.374412, -71.1213000000000 px

//top-left reference point
var p0 = {
    scrX: 0.0,        // Minimum X position on screen
    scrY: 0.0,         // Minimum Y position on screen
    lat: 42.374412,    // Latitude
    lng: -71.12130000000001     // Longitude
}
//bottom-right reference point
var p1 = {
    scrX: XSCREENEXP,          // Maximum X position on screen
    scrY: YSCREENEXP,        // Maximum Y position on screen
    lat: 42.369962,    // Latitude
    lng: -71.113062       // Longitude
}
var radius = 6.371;     //Earth Radius in Km

// some p5 to load the local JSON as object
function setup(){
    dayJSONObj = loadJSON("data/activedays.json");
}


var newurl = "https://dl.dropboxusercontent.com/s/d0xsijpf5v8g97a/08012020_PM.json?raw=1";




// -------- DOM Events
document.addEventListener('DOMContentLoaded', function () {
    /*
     * Fires after the html has loaded
     */
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

            $(this).on("click", function(){
                if (!$(this).hasClass('timelineBoxAMSelected')){
                    $(this).removeClass('timelineBoxAMActive').removeClass('timelineBoxAMDefault').addClass('timelineBoxAMSelected');
                } else {
                    $(this).removeClass('timelineBoxAMSelected');
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


            $(this).on("click", function(){
                if (!$(this).hasClass('timelineBoxPMSelected')){
                    $(this).removeClass('timelineBoxPMActive').removeClass('timelineBoxPMDefault').addClass('timelineBoxPMSelected');

                    // aug1 
                    // jul11
                    
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
                        createDurationPath();
                        createPath();
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

                //reset walks
                currentWalksJSONObj = {};
            });
        });
    });
}

var currH;
function createDurationPath(){
    currH = 50;
    Object.entries(currentWalksJSONObj).forEach(([k,v]) => {
        
        

        v.lines.forEach(function(linearPathLines){


        //-----------  creating horizontal lines -----------------------------------------------------------------//
        createLinearL(linearPathLines.id+'_linearPath',horElemC,currH,horElemC+5,currH, str(linearPathLines.Duration).trim());
        horElemC += 3.5;
        console.log(horElemC);
        console.log(linearPathLines);
        });

    currH += 50;
    horElemC = 0;
    });

}

function createPath(){
    Object.entries(currentWalksJSONObj).forEach(([k,v]) => {
        console.log(k);
        console.log(v);
        v.lines.forEach(function(MapPathLines){
            //-----------  creating map lines -----------------------------------------------------------------//
            svgLn = createLine(MapPathLines);
            console.log(MapPathLines.SoundUrl);
            var newMapPathLines = new LineSegment(MapPathLines.id, svgLn, MapPathLines.SoundUrl,MapPathLines.Speed,MapPathLines.Duration,MapPathLines.Length);
            LineSegments.push(newMapPathLines);
            });
    });
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

//-----------  FUNCTION creating horizontal svg + events  -----------------------------------------------------------------//

function createLinearL(id,x1,y1,x2,y2,duration){
  
  var svgHor = document.createElementNS('http://www.w3.org/2000/svg','line');

  
  svgHor.setAttribute("id", id);
  svgHor.setAttribute("x1", x1);
  svgHor.setAttribute("y1", y1);
  svgHor.setAttribute("x2", x2);
  svgHor.setAttribute("y2", y2);

  svgHor.setAttribute("stroke", "white");
  

  svgHor.setAttribute("stroke-width", duration);


  var svgC = document.getElementById("pathLinearSVGContainer");
  svgC.appendChild(svgHor);
  
  
  //----------Adding Events ------------------------------------------//
  
  svgHor.addEventListener("mouseenter", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "red";
  
  //lineCurrTextX = event.target.getAttribute("x1");
  //lineCurrTextY = event.target.getAttribute("y1");
   lineCurr = LineSegments[event.target.id];
   lineCurr.svgLn.style.stroke = "red";
  }, false);
  
 //---------------------------------------------------------------------------------------// 
  // add the panning here ---
  svgHor.addEventListener("pointermove", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "red";
 
     
  lineCurrTextX = event.target.getAttribute("x1");
  lineCurrTextY = event.target.getAttribute("y1");
  
  console.log(event.target.id);
  
  lineCurr = LineSegments[event.target.id];
  lineCurr.svgLn.style.stroke = "red";
  
  
  }, false);
//-------------------------------------------------------  
  svgHor.addEventListener("click", function( event ) {
  // highlight the mouseenter target
  
    var song = LineSegments[svgHor.id].sound;
    console.log(song);
    if (song.isPlaying()) {
    // .isPlaying() returns a boolean
      song.pause(); // .play() will resume from .pause() position
    } else {
      song.play();
    }
  }, false);
//----------------------------------------------------------------------------//
  svgHor.addEventListener("mouseleave", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "white";
  //event.target.style["stroke-width"] = "3";
  lineCurr = LineSegments[event.target.id];
  lineCurr.svgLn.style.stroke = "white";
  
  //lineCurrTextX = null;
  lineCurr = null;

  }, false);
}

//----------------------------------------------------------------//
//-----------  FUNCTION creating map svg + events  -----------------------------------------------------------------//

function createLine(lineS){
  // this function creates a line and adds eventlisteners
  
  var EndPt = latlngToScreenXY(lineS.EndPt.lat, lineS.EndPt.lon);
  var StartPt = latlngToScreenXY(lineS.StartPt.lat, lineS.StartPt.lon);

  var svgLn = document.createElementNS('http://www.w3.org/2000/svg','line');
  
  svgLn.setAttribute("id", lineS.id);
  svgLn.setAttribute("x1", StartPt.x);
  svgLn.setAttribute("y1", StartPt.y);
  svgLn.setAttribute("x2", EndPt.x);
  svgLn.setAttribute("y2", EndPt.y);

  svgLn.setAttribute("stroke", "white");
  svgLn.setAttribute("stroke-width", "3");

  var svgC = document.getElementById("mapSVGContainer");
  svgC.appendChild(svgLn);
  
  //----------Adding Events ------------------------------------------//
  
  svgLn.addEventListener("mouseenter", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "red";
  event.target.style["stroke-width"] = "10";
  
  //lineCurrTextX = event.target.getAttribute("x1");
  //lineCurrTextY = event.target.getAttribute("y1");
  lineCurr = LineSegments[event.target.id];
  lineCurr.svgHor.style.stroke = "red";
  }, false);
  
  // add the panning here ---
  svgLn.addEventListener("pointermove", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "red";
  event.target.style["stroke-width"] = "10";
     
  //lineCurrTextX = event.target.getAttribute("x1");
  //lineCurrTextY = event.target.getAttribute("y1");
  lineCurr = LineSegments[event.target.id];
  lineCurr.svgHor.style.stroke = "red";
  }, false);
  
  svgLn.addEventListener("click", function( event ) {
  // highlight the mouseenter target
  
    var song = LineSegments[svgLn.id].sound;
    if (song.isPlaying()) {
    // .isPlaying() returns a boolean
      song.pause(); // .play() will resume from .pause() position
    } else {
      song.play();
    }
  }, false);

  svgLn.addEventListener("mouseleave", function( event ) {
  // highlight the mouseenter target
  event.target.style.stroke = "white";
  event.target.style["stroke-width"] = "3";
  
  lineCurr = LineSegments[event.target.id];
  lineCurr.svgHor.style.stroke = "white";

  
  //lineCurrTextX = null;
  lineCurr = null;

  }, false);
  
  return svgLn;
}


//p5 draw function
function draw() {
    if(lineCurr != null){
          
          var newX = int(lineCurr.svgLn.getAttribute("x1"));
          var newY = int(lineCurr.svgLn.getAttribute("y1"));
          var colr = str(lineCurr.svgLn.style.stroke); 
          fill(colr);
          textSize(40);
          text(lineCurr.name, newX, newY);
    }else{
           fill('white');
    }
    
}

//Creating a Javascript Object//

function LineSegment(id,svgLn,SoundUrl,StartPt,EndPt,Speed,Duration,Length){
  // this is a JS object
  // add more things
  this.id = id;
  this.svgLn = svgLn;
  this.Speed = Speed;
  this.Duration = Duration;
  this.Length = Length;
  this.sound = loadSound(SoundUrl);
  this.Startime = StartPt.time;
  this.Endtime = EndPt.time;
  
}

function createSvgLine(x1, y1, x2, y2, containerId, className, id){
    /* 
     * A static svg Line
     */
    var svgLn = document.createElementNS('http://www.w3.org/2000/svg','line');
    svgLn.setAttribute("id", id);
    svgLn.classList.add(className);
    svgLn.setAttribute("x1", x1);
    svgLn.setAttribute("y1", y1);
    svgLn.setAttribute("x2", x2);
    svgLn.setAttribute("y2", y2);

    // we get the SVG container from index.thml
    var svgC = document.getElementById(containerId);

    // we append our line to that container as a childElement
    svgC.appendChild(svgLn);
}

function createSvgRect(x, y, w, h, containerId, className, id){
    /* 
     * A static svg Line
     */
    var svgRect = document.createElementNS('http://www.w3.org/2000/svg','rect');
    svgRect.setAttribute("id", id);
    svgRect.classList.add(className);
    svgRect.setAttribute("x", x1);
    svgRect.setAttribute("y", y1);
    svgRect.setAttribute("height", h);
    svgRect.setAttribute("width", w);
}

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

// --------- MAP UTILS

//-----------------------------------------------------------------------------------------------//


//## Now I can calculate the global X and Y for each reference point ##\\

// This function converts lat and lng coordinates to GLOBAL X and Y positions
function latlngToGlobalXY(lat, lng){
    //Calculates x based on cos of average of the latitudes
    let x = radius*lng*Math.cos((p0.lat + p1.lat)/2);
    //Calculates y based on latitude
    let y = radius*lat;
    return {x: x, y: y}
}
// Calculate global X and Y for top-left reference point
p0.pos = latlngToGlobalXY(p0.lat, p0.lng);
// Calculate global X and Y for bottom-right reference point
p1.pos = latlngToGlobalXY(p1.lat, p1.lng);

/*
* This gives me the X and Y in relation to map for the 2 reference points.
* Now we have the global AND screen areas and then we can relate both for the projection point.
*/

// This function converts lat and lng coordinates to SCREEN X and Y positions
function latlngToScreenXY(lat, lng){
    //Calculate global X and Y for projection point
    let pos = latlngToGlobalXY(lat, lng);
    //Calculate the percentage of Global X position in relation to total global width
    pos.perX = ((pos.x-p0.pos.x)/(p1.pos.x - p0.pos.x));
    //Calculate the percentage of Global Y position in relation to total global height
    pos.perY = ((pos.y-p0.pos.y)/(p1.pos.y - p0.pos.y));

    //Returns the screen position based on reference points
    return {
        x: p0.scrX + (p1.scrX - p0.scrX)*pos.perX,
        y: p0.scrY + (p1.scrY - p0.scrY)*pos.perY
    }
}

//# The usage is like this #\\

//var pos = latlngToScreenXY(-22.815319, -47.071718);
//$point = $("#point-to-project");
//$point.css("left", pos.x+"em");
//$point.css("top", pos.y+"em");


//--------Adding functionality to the buttons for switching between Graphs ---------------------//

// function turnOnGDP(number){
//   console.log("turnOnGDP");
//   var svgStyle1 = document.getElementById("lineChart"+ number +"GDP").getAttribute("display");
//   var svgStyle2 = document.getElementById("lineChart"+ number +"YEAR").getAttribute("display");

//   var elemnt = document.getElementById("lineChart"+ number +"GDP");
//   console.log(elemnt);
//   console.log(svgStyle2);

//   if (svgStyle1 == "none"){
//       document.getElementById("lineChart"+ number +"GDP").setAttribute("display", "block");
//       document.getElementById("lineChart"+ number +"YEAR").setAttribute("display", "none");
//   }
// }

// function turnOnYEAR(number){
//   console.log("turnOnYEAR");
//   var svgStyle1 = document.getElementById("lineChart"+ number +"GDP").getAttribute("display");
//   var svgStyle2 = document.getElementById("lineChart"+ number +"YEAR").getAttribute("display");

//   //console.log(svgStyle1);
//   //console.log(svgStyle2);

//   if (svgStyle2 == "none"){
//       document.getElementById("lineChart"+ number +"GDP").setAttribute("display", "none");
//       document.getElementById("lineChart"+ number +"YEAR").setAttribute("display", "block");
//   }
// }
