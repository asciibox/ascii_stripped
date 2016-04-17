var resizeTO; // Trigger resize end event
var drawCharacters = new Array(); // This is just an one-dimensional array containing a two-dimensional array with x and y coordinates for the screenCharacterArray
var globalContext;
/** When we are drawing by using mouse clicks, this is set to true **/

var singleClick = false;
var mouseDown = false;
/** This is the general width and height, used globally to show the right coordinate system inside the canvas **/
var width = 320;
var height = 100;

var movingX = false;
var movingY = false;
var movingXStartPos = 0;
var movingYStartPos = 0;

// Check/uncheck if the scrollbar is being shown
var scrollBarXShown = 1;
var scrollBarYShown = 1;

// You can modify this. It gets set in the call to app.js->setCanvasSize(), and called from index.html in the callback of Codepage initialization. If you change this, the canvasCharacter-Height and -width changes.

var firstLine = 0; // Top Y Position according to scrollbar
var leftLine = 0; // Very left X Position according to scrollbar

var resizeToScreen = false;

var screenCharacterArray = new Array();


/** Depending on the screen size, this has a certain value of pixels **/
var characterWidth, characterHeight; // There is a difference to canvasCharacterWidth and canvasCharacterHeight: characterWidth is most likely 8 whereas canvasCharacterWidth is the real pixel wide in the canvas



/** Ansi interpreter, display and charactersatonce **/
var interpreter, display, charactersatonce;


/** This clears the screen, but only the area in which the region gets displayed, i.e. max. to visibleWidth and visibleHeight (i.e. 45 characters times 90 characters) **/
function doClearScreen() {
    var bgstring = "#000000";
    ctx = document.getElementById("ansi").getContext("2d");
    ctx.fillStyle = bgstring;
    var window_innerWidth = (visibleWidth * (canvasCharacterWidth));
    var window_innerHeight = (visibleHeight * (canvasCharacterHeight));

    //   ctx.fillRect(0, 0, document.getElementById("ansi").getContext("2d").width, document.getElementById("ansi").getContext("2d").height);

   // console.log((window_innerWidth - canvasCharacterWidth) + "---" + (window_innerHeight - (canvasCharacterHeight * 1)))
    // clears everything
    //ctx.fillRect(0, 0, document.getElementById('ansi').width, document.getElementById('ansi').height);
}

function getDisplayWidth() {
    return visibleWidth; // return parseInt(document.getElementById('displaywidth').value);
}
function getDisplayHeight() {
    return visibleHeight; // return parseInt(document.getElementById('displayheight').value);
}
function getTotalDisplayWidth() {
    return totalVisibleWidth; // return parseInt(document.getElementById('displaywidth').value);
}
function getTotalDisplayHeight() {
    return totalVisibleHeight; // return parseInt(document.getElementById('displayheight').value);
}

/** This gets called when the screen size changes **/
window.onresize = function () {
    activateRequestAnimFrame = false;
    drawCharacters = new Array();
    makeCanvasBlack();
    if (resizeTO)
        clearTimeout(this.resizeTO);
    resizeTO = setTimeout(function () {
        resize_canvas();
    }, 250);
}

/** This is getting called whenever the user resizes the canvas, to show always the same amount of characters, just with a different width and height **/
function resize_canvas() {
    console.log("RESIZE CLEAR");
    activateRequestAnimFrame = false;
    // Now set the new canvas dimensions
    console.log("RESIZE SIZE");
    setCanvasSize(document.getElementById("ansi")); // This creates the canvas for us
    makeCanvasBlack(); // codepagedisplay.js
    // Then draw all characters again
    console.log("RESIZE CHARS");

    for (var y = 0; y < screenCharacterArray.length; y++)
    {
        if (typeof (screenCharacterArray[y]) != "undefined") {
            for (var x = 0; x < screenCharacterArray[y].length; x++)
            {
                if (typeof (screenCharacterArray[y][x]) != "undefined")
                {
                    drawCharacters.push(new Array(x, y));
                }
            }
        }
    }
    activateRequestAnimFrame = true;
    console.log("NOW IT SHOULD REDRAW");
}


