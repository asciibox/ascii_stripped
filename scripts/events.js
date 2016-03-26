  function registerEventListeners() {
             
                ansicanvas = document.getElementById('ansi');
                
                ansicanvas.addEventListener('mousedown', function(e) {
                    
						if (singleClick == false)
						{
							 singleClick=true;
							 setTimeout(function() { singleClick = false; }, 300);
						} else {
							showOverlay();
						}

                        var window_innerWidth = (visibleWidth*(canvasCharacterWidth));
                        var window_innerHeight = (visibleHeight*(canvasCharacterHeight));

                        var mouse = getMousePos(ansicanvas, e);
                        var my = mouse.y;                
                        var mx = mouse.x;

                        var myScrollbarY = window_innerHeight-canvasCharacterHeight;

                        if (my>(myScrollbarY)) {
                            movingXStartPos = mx;
                            console.log("Setting movingX to true");
                            movingX=true;
                            movingY=false;
                        }

                        var myScrollbarX =  (visibleWidth*canvasCharacterWidth)-canvasCharacterWidth;

                        if (mx>myScrollbarX) {
                            movingYStartPos = my;
                            console.log("Setting movingY to true");
                            movingY=true;
                            movingX=false;
                        }
                    
                    mouseDown=true;
                    mouseMove(ansicanvas, e);
                    
                }, true);
                
                
              
                
                ansicanvas.addEventListener('mouseleave', function(e) {
                    mouseDown=false;
                });
                
                ansicanvas.addEventListener('mouseup', function(e) {
                   mouseDown=false;
                   if ( (movingX) || (movingY) ) {
                   firstLine=animOffsetY; 
                   leftLine=animOffsetX;
                   movingX=false;
                   movingY=false;
                   }
                });
            
                ansicanvas.addEventListener('mousemove', function(e) {
                  
                   if (movingY==true)
                   {
                       var mouse = getMousePos(ansicanvas, e);
                       var mx = mouse.x;
                       var my = mouse.y;
                       scrollPosY=my;
          
            
                       redrawScreenMouseUpdate();
                   
                   } else
                   if (movingX==true) 
                   {
                       var mouse = getMousePos(ansicanvas, e);
                       var mx = mouse.x;
                       var my = mouse.y;
                       scrollPosX=mx;
                       redrawScreenMouseUpdate();
                   
                   } else
                   
                   if (mouseDown==true) {
                    
                   mouseMove(ansicanvas,e);
                    
                 
                   }
                   
                });

               
        }


		function registerKeyEventListeners() {

				document.body.addEventListener('keydown',
                function(e)
                {
                 
                    var keyCode = e.which;
                  
					if (keyCode == 40) {
                        scrollDown();
						e.preventDefault();
                    } else
                    if (keyCode==38) {
                         scrollUp();
						 e.preventDefault();
                    } else
                    if (keyCode==39) { 
                        scrollRight();
                    } else if (keyCode==37) {
                        scrollLeft();
						e.preventDefault();
                    }
                    e.preventDefault();
                
                },
                false);
}