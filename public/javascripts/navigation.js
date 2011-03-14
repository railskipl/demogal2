
		$(document).ready(function() { 
			$("#navigation li ul").each(function(index) {
				$(this).parent().find("a:first").click(function(e) {
					e.preventDefault();
					$("#navigation li ul").parent().find("ul").hide();
					$(this).parent().find("ul").show("slow");
				});
			});
		
			$("#navigation .selected").parent().show();
		});

	// Initialize the plugin with no custom options
		$(function() {
			$("div#makeMeScrollable").smoothDivScroll({});
		});
		
		
		$(document).ready(function() {

		//Default Action
		$(".tab_content").hide(); //Hide all content
		$("ul.tabs li:first").addClass("active").show(); //Activate first tab
		$(".tab_content:first").show(); //Show first tab content
		
		//On Click Event
		$("ul.tabs li").click(function() {
			$("ul.tabs li").removeClass("active"); //Remove any "active" class
			$(this).addClass("active"); //Add "active" class to selected tab
			$(".tab_content").hide(); //Hide all tab content
			var activeTab = $(this).find("a").attr("href"); //Find the rel attribute value to identify the active tab + content
			$(activeTab).fadeIn(); //Fade in the active content
				return false;
			});
		
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
	