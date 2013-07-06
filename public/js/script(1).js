function yenisite_settings_close(){
	if($("#ys-bitronic-settings").css("bottom") == "-10px")
					   $("#ys-bitronic-settings").animate({bottom: '-360px'});
}

$(document).ready(
        function(){
            $(".selectBox").selectBox();
            $("body").append($("#ys-bitronic-settings"));
            $("#ys-a-settings").click(function(){
                if($("#ys-bitronic-settings").css("bottom") != "-10px")
                   $("#ys-bitronic-settings").animate({bottom: '-10px'});
                else
                    $("#ys-bitronic-settings").animate({bottom: '-360px'});
            });
			
			/*----FOR CLOSE POPUP WINDOWS---*/
			//ON PUSH ESC
			$(document).keydown(function(eventObject){
				//27 - ASCII code of button 'ESC'
				if(eventObject.which==27)
				{		
					yenisite_settings_close();
				}
			});
			//ON CLICK OUTSIDE SETTINGS WINDOW
			var onSettings;
			$('#ys-bitronic-settings').add('ul.selectBox-dropdown-menu').mouseover(function(){onSettings=true;});
			$('#ys-bitronic-settings').add('ul.selectBox-dropdown-menu').mouseout(function(){onSettings=false;});
			
				// this code need for elements which changes during work page
				$('#fixbody a:not(#ys-bitronic-settings a)').on('click',function(){
					if(onSettings==false)
						yenisite_settings_close();
				});
			
			$(document).on('click',function(){
				if(onSettings==false)
					yenisite_settings_close();
			});
			/*   -------------------------------------------------------   */
		
		}
    );
