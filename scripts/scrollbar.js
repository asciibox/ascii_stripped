/* The MIT License (MIT)
 *
 * Copyright (c) 2015 Oliver Bachmann, Karlsruhe, Germany
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/** This contains the position of the scrollbars as real coordinate values in scrollPosY and scrollPosX as well as functionality to redraw the scrollbars.
    Functionality for listening to the scrollbar is in app.js in initansicanvas() **/

var scrollPosY = 0;
var scrollPosX = 0;


	// This is a handy function to draw a certain line Y starting at X = 0 going up to how many x characters are inside the y index/coordinate **/
	function drawLine(fromRealY, toCursorY) {
		
       for (var x = 0; x < screenCharacterArray[fromRealY].length; x++) {
           var charArray = screenCharacterArray[fromRealY][x];
           asciiCode=179;//charArray[0];
           foreground=charArray[1];
           background=charArray[2];
           codepage.drawChar(ctx, asciiCode, foreground, background, x, toCursorY, false, false); // do not store
       }
   }
   
   /** This is used when scrolling horizontally **/
   function drawVerticalLine(fromRealX, toCursorX) {
       for (var y = 0; y < screenCharacterArray.length; y++) {
           var charArray = screenCharacterArray[y][fromRealX];
           asciiCode=charArray[0];
           foreground=charArray[1];
           background=charArray[2];
           codepage.drawChar(ctx, asciiCode, foreground, background, toCursorX, y, false, false); // do not store
       }
   };

   /** This are global variables. When they get set somewhere, i.e. when scrolling occurs, this gets called. This behaves very much like a setTimeout, so the other functions hopefully are not lacking timeouts **/
    function scrollDown() { // Scrolling down means the scrollbar scrolls down. The canvas moves up.
	    if (firstLine<totalVisibleHeight)
	    {
			firstLine++;
			visibleYStart++;
			doRedraw(); // app.js
			updateScrollbarY(true,0); // Show a part of the scrollbar again, scrollbar.js
        }
    }

    function scrollUp() { // Scrolling up means the scrollbar scrolls up. The canvas moves down.
    	if (firstLine>0)
		{
			firstLine--;
			visibleYStart--;
			doRedraw(); // app.js
			updateScrollbarY(true,0); // Show a part of the scrollbar again, scrollbar.js
		}
    }

    function scrollLeft() {
		if (leftLine>0)
		{
			leftLine--;
			visibleXStart--;
			doRedraw(); // app.js
			updateScrollbarX(true,0); // Show a part of the scrollbar again, scrollbar.js
        }
    }

    function scrollRight() { // Scrolling right means the scrollbar moves the the right. The canvas moves to the left side.
	    if (leftLine<totalVisibleWidth)
	    {
			leftLine++;
			visibleXStart++;
			doRedraw(); // app.js
			updateScrollbarX(true,0); // Show a part of the scrollbar again, scrollbar.js
		}
	}
  
  /** This redraws the vertial scrollbar **/
  function updateScrollbarY(drawTopBlackside, offsetY) {
      
       if (typeof(offsetY)=="undefined") offsetY=0;
       
       var myScrollPosX = (visibleWidth*canvasCharacterWidth)-parseInt(canvasCharacterWidth)-5;
       
       var window_innerHeight = (visibleHeight*(canvasCharacterHeight));
       var scrollBarHeight = (visibleHeight/totalVisibleHeight)*window_innerHeight;
    
	console.log("firstLine:"+firstLine+" totalVisibleHeight:"+totalVisibleHeight+" visibleHeight: "+visibleHeight+" window_innerHeight:"+window_innerHeight);
        myScrollPosY = (firstLine / totalVisibleHeight)*window_innerHeight-1;
        console.log("myScrollPosY:"+myScrollPosY);
       if (myScrollPosY+offsetY<0) {
           myScrollPosY = -offsetY; 
       } else
       if (scrollBarHeight+myScrollPosY+offsetY>window_innerHeight) {
           myScrollPosY = window_innerHeight-scrollBarHeight-offsetY; // Since we offsetY again
       } 
                
       var context = document.getElementById("ansi").getContext("2d");
       
	   // Also draw the black region because it might have changed on top of the scrollbar
       if ( (drawTopBlackside==1) || (drawTopBlackside==2) ) {
            context.beginPath();
            context.rect(myScrollPosX+1, 0, 2*canvasCharacterWidth, myScrollPosY+offsetY);
            context.fillStyle = 'black';
            context.fill();
            context.lineWidth = 7;
            context.strokeStyle = 'black';
            context.stroke();
       }
       
       context.beginPath();
       context.rect(myScrollPosX+1, myScrollPosY+offsetY, 2*canvasCharacterWidth, scrollBarHeight);
       context.fillStyle = 'yellow';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       
	   // We can also do this afterwards
        if ( (drawTopBlackside==0) || (drawTopBlackside==2) ) {
            context.beginPath();
            context.rect(myScrollPosX+1, myScrollPosY+scrollBarHeight+offsetY, 2*canvasCharacterWidth, window_innerHeight-(myScrollPosY+scrollBarHeight));
            context.fillStyle = 'black';
            context.fill();
            context.lineWidth = 7;
            context.strokeStyle = 'black';
            context.stroke();
       }
       //scrollPosY = myScrollPosY+offsetY;
       
   }
   
   /** This redraws the horizontal scrollbar **/
   function updateScrollbarX(drawLeftBlackside, offsetX) {
       
       if (typeof(offsetX)=="undefined") offsetX=0;
       
       var window_innerWidth = ((visibleWidth)*(canvasCharacterWidth));
       
       var myScrollPosX = (leftLine / (totalVisibleWidth-1))*window_innerWidth;
       
       var scrollBarWidth = (visibleWidth/totalVisibleWidth)*window_innerWidth;
	   console.log("visibleWidth:"+visibleWidth+" totalVisibleWidth: "+totalVisibleWidth+" window_innerWidth: "+window_innerWidth);
       if (myScrollPosX+offsetX+scrollBarWidth>window_innerWidth) {
           myScrollPosX=window_innerWidth-offsetX-scrollBarWidth;
       } else
       if (myScrollPosX+offsetX<0) {
           myScrollPosX = -offsetX;
       }
       
       var myScrollPosY = (visibleHeight-1  ) * parseInt(canvasCharacterHeight)-3;
       
       var context = document.getElementById("ansi").getContext("2d");
       
       if ( (drawLeftBlackside==1) || (drawLeftBlackside==2) ) {
       // Black part to the left
       context.beginPath();
       context.rect(0, myScrollPosY, myScrollPosX+offsetX, canvasCharacterHeight*2);
       context.fillStyle = 'black';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       }
       
       // Yellow part
       context.beginPath();
       context.rect(myScrollPosX+1+offsetX, myScrollPosY+1, scrollBarWidth, canvasCharacterHeight*2);
       context.fillStyle = 'yellow';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       
       if ( (drawLeftBlackside==0) || (drawLeftBlackside==2) ) {
       // Black part to the right
       context.beginPath();
       context.rect(myScrollPosX+scrollBarWidth+offsetX, myScrollPosY, window_innerWidth-myScrollPosX, canvasCharacterHeight*2);
       context.fillStyle = 'black';
       context.fill();
       context.lineWidth = 7;
       context.strokeStyle = 'black';
       context.stroke();
       }
      // scrollPosX = myScrollPosX + offsetX;
   }
   