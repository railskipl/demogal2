
		jQuery(document).ready(function() { 
			
			// validate all forms
			jQuery("form").validationEngine();
			
			jQuery("#navigation li ul").each(function(index) {
				jQuery(this).parent().find("a:first").click(function(e) {
					e.preventDefault();
					jQuery("#navigation li ul").parent().find("ul").hide();
					jQuery(this).parent().find("ul").show("slow");
				});
			});
		
			jQuery("#navigation .selected").parent().show();
		});
		
		
	// Initialize the plugin with no custom options
		jQuery(function() {
			jQuery("div#makeMeScrollable").smoothDivScroll({});
		});
		
		
		jQuery(document).ready(function() {

		//Default Action
		jQuery(".tab_content").hide(); //Hide all content
		jQuery("ul.tabs li:first").addClass("active").show(); //Activate first tab
		jQuery(".tab_content:first").show(); //Show first tab content
		
		//On Click Event
		jQuery("ul.tabs li").click(function() {
			jQuery("ul.tabs li").removeClass("active"); //Remove any "active" class
			jQuery(this).addClass("active"); //Add "active" class to selected tab
			jQuery(".tab_content").hide(); //Hide all tab content
			var activeTab = jQuery(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
			jQuery(activeTab).fadeIn(); //Fade in the active content
				return false;
			});
		
		});
		
		
			// socialize.js script should only be included once 
			var conf=
			{ 
			  APIKey: '2_AY_h90DSOFy1Rwupb-AENamu3WocYRJ2S4oVLntvwcYgy8-VgiCnBYfo41XzCvK-'
			}
			
			
        
		//Fade Out Messages
		 jQuery(document).ready(function(){
             setTimeout(function(){
                 jQuery("div.errorMsg").fadeOut("slow", function () {
                   jQuery("div.errorMsg").remove();
                 });
    
              }, 2000);
          });


		
		   
		
		function clickIE4(){
			if (event.button==2){
			// alert(message);
			return false;
			}
		}
		
		function clickNS4(e){
		if (document.layers||document.getElementById&&!document.all){
			if (e.which==2||e.which==3){
			 alert(message);
			return false;
			}
		}
		}
		
		if (document.layers){
		document.captureEvents(Event.MOUSEDOWN);
		document.onmousedown=clickNS4;
		}
		else if (document.all&&!document.getElementById){
		document.onmousedown=clickIE4;
		}
		
		document.oncontextmenu=new Function("return false")
	