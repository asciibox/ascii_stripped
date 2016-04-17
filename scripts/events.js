function registerEventListeners() {

    ansicanvas = document.getElementById('ansi');
    var window_innerWidth, window_innerHeight;
	
    document.addEventListener('mousedown', function (e) {
	var gridStartY =(document.getElementById('ansi').height) - Math.floor(canvasCharacterHeight*1.25)+3;
        if (singleClick == false)
        {
            singleClick = true;
            setTimeout(function () {
                singleClick = false;
            }, 300);
        } else {
            if (document.getElementById('overlay').style.display != "inline")
            {
                showOverlay();
            } else {
                hideOverlay();
            }
        }

        window_innerWidth = (visibleWidth * (canvasCharacterWidth));
        window_innerHeight = (visibleHeight * (canvasCharacterHeight));

        var mouse = getMousePos(ansicanvas, e);
        var my = mouse.y;
        var mx = mouse.x;

        var myScrollbarY = window_innerHeight - canvasCharacterHeight;
//console.log("1: "+(my > (window.innerHeight - (4*canvasCharacterHeight))))
//console.log("2: "+(my > (mx > myScrollPosX)))
//console.log("3: "+(my > (mx < ( myScrollPosX + scrollBarWidth))))

        if (my > gridStartY && mx > myScrollPosX && mx < ( myScrollPosX + scrollBarWidth)) {
            movingXStartPos = mx;
			currentScrollPosX=myScrollPosX;
            console.log("Setting movingX to true");
            movingX = true;
            movingY = false;
        }

        var myScrollbarX = (visibleWidth * canvasCharacterWidth) - canvasCharacterWidth;

        if ((mx > myScrollbarX) && (myScrollbarX + (4 * canvasCharacterWidth) > mx) && (my > myScrollPosY) && (my < (scrollBarHeight + myScrollPosY))) {

            movingYStartPos = my-myScrollPosY; // relative position on the scrollbar, i.e. 20 pixel from top of scrollbar
           
            console.log("Setting movingY to true");
            movingY = true;
            movingX = false;
        }

        mouseDown = true;

        mouseMove(ansicanvas, e);

    }, true);

    ansicanvas.addEventListener('wheel', function (e) {

        e.preventDefault();//prevent the default mousewheel scrolling


        //if the delta value is negative, the user is scrolling down
        if (e.deltaY < 0) {
            // scroll down
            if (scrollPosY - 10 > 0)
            {
                scrollPosY = scrollPosY - 10;
                redrawScreenMouseUpdate(); // events.js
            } else if (scrollPosY > 0)
            {
                scrollPosY = 0;
                redrawScreenMouseUpdate(); // events.js
            }



        } else {
            if (scrollPosY + 10 + scrollBarHeight < window_innerHeight)
            {
                scrollPosY = scrollPosY + 10;
                redrawScreenMouseUpdate(); // events.js
            } else if (scrollPosY + scrollBarHeight < window_innerHeight)
            {
                scrollPosY = window_innerHeight - scrollbarHeight;
                redrawScreenMouseUpdate(); // events.js
            }
        }
    });


   /*ansicanvas.addEventListener('mouseleave', function (e) {
        /*mouseDown = false;
        movingX = false;
        movingY = false;
    });*/
    
 

    document.addEventListener('mouseup', function (e) {
        mouseDown = false;
        if ((movingX) || (movingY)) {
            firstLine = animOffsetY;
            leftLine = animOffsetX;
            movingX = false;
            movingY = false;
        }
    });

    ansicanvas.addEventListener('mousemove', function (e) {
        
        if (movingY == true)
        {

            var mouse = getMousePos(ansicanvas, e);
            var mx = mouse.x;
            var my = mouse.y-movingYStartPos;
            scrollPosY = my;
            //this condition is to check weather the Yscroll reached end or not;
            if (scrollBarHeight + my < window_innerHeight)
            {
                if (scrollPosY<=0) {
                scrollPosY=0;
                } else
                    redrawScreenMouseUpdate(); // events.js
            } else
            {

               
                 
                        scrollPosY = window_innerHeight - scrollBarHeight;
                        redrawScreenMouseUpdate(); // events.js
             
                
            }



        } else
        if (movingX == true)
        {
            //console.log("movingX");movingXStartPos//get mouse position on grid touched
            var mouse = getMousePos(ansicanvas, e);
            var mx = mouse.x;
            var my = mouse.y;		
			m_diff = Math.abs(mx-movingXStartPos);
			if(mx > movingXStartPos)		
            myScrollPosX=currentScrollPosX+m_diff;		
			else
			 myScrollPosX=currentScrollPosX-m_diff;			
			scrollPosX=myScrollPosX*(window_innerWidth/scrollBarWidth);
			//console.log("window_innerWidth:"+window_innerWidth+ "scrollBarWidth" +(scrollBarWidth+myScrollPosX))
			if(scrollBarWidth + myScrollPosX <= window_innerWidth)
			{
			if (scrollPosX<0) {
                scrollPosX=0;
                } 
				 redrawScreenMouseUpdate(); // events.js
			}
			else
			{
			console.log("secondelse")
						scrollPosX = (window_innerWidth-(2 * canvasCharacterWidth));
                        redrawScreenMouseUpdate(); // events.js
			}
        }

    });
}

function registerKeyEventListeners() {

    document.body.addEventListener('keydown',
            function (e)
            {

                var keyCode = e.which;

                if (keyCode == 40) {

                    scrollDown();
                    e.preventDefault();
                } else
                if (keyCode == 38) {
                    scrollUp();
                    e.preventDefault();
                } else
                if (keyCode == 39) {
                    scrollRight();
                } else if (keyCode == 37) {
                    scrollLeft();
                    e.preventDefault();
                }


            },
            false);
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

/** This gets called whenever the mouse moves and the left mouse button is getting keeped pressed  **/
function mouseMove(ansicanvas, e) {
    //console.log(e);

    var mouse = getMousePos(ansicanvas, e);
    var mx = mouse.x;
    var my = mouse.y;
}

// This gets called whenever the scrollbar position changes from scrollbar.js, from inside the even listeners
function redrawScreenMouseUpdate() {

    var window_innerWidth = (visibleWidth * (canvasCharacterWidth));
    var window_innerHeight = (visibleHeight * (canvasCharacterHeight));

    visibleXStart = Math.floor((scrollPosX / window_innerWidth) * visibleWidth);
    visibleXStop = visibleXStart + visibleWidth;
    //console.log("visibleXStart: "+visibleXStart+" visibleXStop : "+visibleXStop+ "innerWidth: "+window_innerWidth);

    //console.log("Add an if here!!!");
    //console.log("scrollPosY: "+scrollPosY+" window_innerHeight: "+window_innerHeight+" height: "+height);
    //alert(scrollPosY)

    visibleYStart = Math.floor((scrollPosY / window_innerHeight) * height);
    var visibleYStop = visibleYStart + visibleHeight;
    animOffsetX = visibleXStart;
    firstLine = visibleYStart;
    animOffsetY = visibleYStart;
    leftLine = visibleXStart;

    doRedraw();

}