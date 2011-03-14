/*
 * Inline Form Validation Engine 1.6.3, jQuery plugin
 * 
 * Copyright(c) 2009, Cedric Dugas
 * http://www.position-relative.net
 *	
 * Form validation engine allowing custom regex rules to be added.
 * Thanks to Francois Duquette
 * Licenced under the MIT Licence
 */
 
(function(jQuery) {
	
	jQuery.fn.validationEngine = function(settings) {

	if(jQuery.validationEngineLanguage){				// IS THERE A LANGUAGE LOCALISATION ?
		allRules = jQuery.validationEngineLanguage.allRules;
	}else{
		jQuery.validationEngine.debug("Validation engine rules are not loaded check your external file");
	}
 	settings = jQuery.extend({
		allrules:allRules,
		validationEventTriggers:"focusout",					
		inlineValidation: true,	
		returnIsValid:false,
		liveEvent:false,
		unbindEngine:true,
		ajaxSubmit: false,
		scroll:true,
		promptPosition: "topRight",	// OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
		success : false,
		beforeSuccess :  function() {},
		failure : function() {}
	}, settings);	
	jQuery.validationEngine.settings = settings;
	jQuery.validationEngine.ajaxValidArray = new Array();	// ARRAY FOR AJAX: VALIDATION MEMORY 
	
	if(settings.inlineValidation == true){ 		// Validating Inline ?
		if(!settings.returnIsValid){					// NEEDED FOR THE SETTING returnIsValid
			allowReturnIsvalid = false;
			if(settings.liveEvent){						// LIVE event, vast performance improvement over BIND
				jQuery(this).find("[class*=validate][type!=checkbox]").live(settings.validationEventTriggers, function(caller){ _inlinEvent(this);})
				jQuery(this).find("[class*=validate][type=checkbox]").live("click", function(caller){ _inlinEvent(this); })
			}else{
				jQuery(this).find("[class*=validate]").not("[type=checkbox]").bind(settings.validationEventTriggers, function(caller){ _inlinEvent(this); })
				jQuery(this).find("[class*=validate][type=checkbox]").bind("click", function(caller){ _inlinEvent(this); })
			}
			firstvalid = false;
		}
			function _inlinEvent(caller){
				jQuery.validationEngine.settings = settings;
				if(jQuery.validationEngine.intercept == false || !jQuery.validationEngine.intercept){		// STOP INLINE VALIDATION THIS TIME ONLY
					jQuery.validationEngine.onSubmitValid=false;
					jQuery.validationEngine.loadValidation(caller); 
				}else{
					jQuery.validationEngine.intercept = false;
				}
			}
	}
	if (settings.returnIsValid){		// Do validation and return true or false, it bypass everything;
		if (jQuery.validationEngine.submitValidation(this,settings)){
			return false;
		}else{
			return true;
		}
	}
	jQuery(this).bind("submit", function(caller){   // ON FORM SUBMIT, CONTROL AJAX FUNCTION IF SPECIFIED ON DOCUMENT READY
		jQuery.validationEngine.onSubmitValid = true;
		jQuery.validationEngine.settings = settings;
		if(jQuery.validationEngine.submitValidation(this,settings) == false){
			if(jQuery.validationEngine.submitForm(this,settings) == true) {return false;}
		}else{
			settings.failure && settings.failure(); 
			return false;
		}		
	})
};	
jQuery.validationEngine = {
	defaultSetting : function(caller) {		// NOT GENERALLY USED, NEEDED FOR THE API, DO NOT TOUCH
		if(jQuery.validationEngineLanguage){				
			allRules = jQuery.validationEngineLanguage.allRules;
		}else{
			jQuery.validationEngine.debug("Validation engine rules are not loaded check your external file");
		}	
		settings = {
			allrules:allRules,
			validationEventTriggers:"blur",					
			inlineValidation: true,	
			returnIsValid:false,
			scroll:true,
			unbindEngine:true,
			ajaxSubmit: false,
			promptPosition: "topRight",	// OPENNING BOX POSITION, IMPLEMENTED: topLeft, topRight, bottomLeft, centerRight, bottomRight
			success : false,
			failure : function() {}
		}	
		jQuery.validationEngine.settings = settings;
	},
	loadValidation : function(caller) {		// GET VALIDATIONS TO BE EXECUTED
		if(!jQuery.validationEngine.settings){
			jQuery.validationEngine.defaultSetting()
		}
		rulesParsing = jQuery(caller).attr('class');
		rulesRegExp = /\[(.*)\]/;
		getRules = rulesRegExp.exec(rulesParsing);
		str = getRules[1];
		pattern = /\[|,|\]/;
		result= str.split(pattern);	
		var validateCalll = jQuery.validationEngine.validateCall(caller,result)
		return validateCalll;
	},
	validateCall : function(caller,rules) {	// EXECUTE VALIDATION REQUIRED BY THE USER FOR THIS FIELD
		var promptText =""	
		
		if(!jQuery(caller).attr("id")) { jQuery.validationEngine.debug("This field have no ID attribut( name & class displayed): "+jQuery(caller).attr("name")+" "+jQuery(caller).attr("class")) }

		caller = caller;
		ajaxValidate = false;
		var callerName = jQuery(caller).attr("name");
		jQuery.validationEngine.isError = false;
		jQuery.validationEngine.showTriangle = true;
		callerType = jQuery(caller).attr("type");

		for (i=0; i<rules.length;i++){
			switch (rules[i]){
			case "optional": 
				if(!jQuery(caller).val()){
					jQuery.validationEngine.closePrompt(caller);
					return jQuery.validationEngine.isError;
				}
			break;
			case "required": 
				_required(caller,rules);
			break;
			case "custom": 
				 _customRegex(caller,rules,i);
			break;
			case "exemptString": 
				 _exemptString(caller,rules,i);
			break;
			case "ajax": 
				if(!jQuery.validationEngine.onSubmitValid){
					_ajax(caller,rules,i);	
				};
			break;
			case "length": 
				 _length(caller,rules,i);
			break;
			case "maxCheckbox": 
				_maxCheckbox(caller,rules,i);
			 	groupname = jQuery(caller).attr("name");
			 	caller = jQuery("input[name='"+groupname+"']");
			break;
			case "minCheckbox": 
				_minCheckbox(caller,rules,i);
				groupname = jQuery(caller).attr("name");
			 	caller = jQuery("input[name='"+groupname+"']");
			break;
			case "confirm": 
				 _confirm(caller,rules,i);
			break;
			default :;
			};
		};
		radioHack();
		if (jQuery.validationEngine.isError == true){
			linkTofield = jQuery.validationEngine.linkTofield(caller);
			
			(jQuery("div."+linkTofield).size() ==0) ? jQuery.validationEngine.buildPrompt(caller,promptText,"error")	: jQuery.validationEngine.updatePromptText(caller,promptText);
		}else{ jQuery.validationEngine.closePrompt(caller);}			
		/* UNFORTUNATE RADIO AND CHECKBOX GROUP HACKS */
		/* As my validation is looping input with id's we need a hack for my validation to understand to group these inputs */
		function radioHack(){
	      if(jQuery("input[name='"+callerName+"']").size()> 1 && (callerType == "radio" || callerType == "checkbox")) {        // Hack for radio/checkbox group button, the validation go the first radio/checkbox of the group
	          caller = jQuery("input[name='"+callerName+"'][type!=hidden]:first");     
	          jQuery.validationEngine.showTriangle = false;
	      }      
	    }
		/* VALIDATION FUNCTIONS */
		function _required(caller,rules){   // VALIDATE BLANK FIELD
			callerType = jQuery(caller).attr("type");
			if (callerType == "text" || callerType == "password" || callerType == "textarea"){
								
				if(!jQuery(caller).val()){
					jQuery.validationEngine.isError = true;
					promptText += jQuery.validationEngine.settings.allrules[rules[i]].alertText+"<br />";
				}	
			}	
			if (callerType == "radio" || callerType == "checkbox" ){
				callerName = jQuery(caller).attr("name");
		
				if(jQuery("input[name='"+callerName+"']:checked").size() == 0) {
					jQuery.validationEngine.isError = true;
					if(jQuery("input[name='"+callerName+"']").size() ==1) {
						promptText += jQuery.validationEngine.settings.allrules[rules[i]].alertTextCheckboxe+"<br />"; 
					}else{
						 promptText += jQuery.validationEngine.settings.allrules[rules[i]].alertTextCheckboxMultiple+"<br />";
					}	
				}
			}	
			if (callerType == "select-one") { // added by paul@kinetek.net for select boxes, Thank you		
				if(!jQuery(caller).val()) {
					jQuery.validationEngine.isError = true;
					promptText += jQuery.validationEngine.settings.allrules[rules[i]].alertText+"<br />";
				}
			}
			if (callerType == "select-multiple") { // added by paul@kinetek.net for select boxes, Thank you	
				if(!jQuery(caller).find("option:selected").val()) {
					jQuery.validationEngine.isError = true;
					promptText += jQuery.validationEngine.settings.allrules[rules[i]].alertText+"<br />";
				}
			}
		}
		function _customRegex(caller,rules,position){		 // VALIDATE REGEX RULES
			customRule = rules[position+1];
			pattern = eval(jQuery.validationEngine.settings.allrules[customRule].regex);
			
			if(!pattern.test(jQuery(caller).attr('value'))){
				jQuery.validationEngine.isError = true;
				promptText += jQuery.validationEngine.settings.allrules[customRule].alertText+"<br />";
			}
		}
		function _exemptString(caller,rules,position){		 // VALIDATE REGEX RULES
			customString = rules[position+1];
			if(customString == jQuery(caller).attr('value')){
				jQuery.validationEngine.isError = true;
				promptText += jQuery.validationEngine.settings.allrules['required'].alertText+"<br />";
			}
		}
		function _ajax(caller,rules,position){				 // VALIDATE AJAX RULES
			
			customAjaxRule = rules[position+1];
			postfile = jQuery.validationEngine.settings.allrules[customAjaxRule].file;
			fieldValue = jQuery(caller).val();
			ajaxCaller = caller;
			fieldId = jQuery(caller).attr("id");
			ajaxValidate = true;
			ajaxisError = jQuery.validationEngine.isError;
			
			if(!jQuery.validationEngine.settings.allrules[customAjaxRule].extraData){
				extraData = jQuery.validationEngine.settings.allrules[customAjaxRule].extraData;
			}else{
				extraData = "";
			}
			/* AJAX VALIDATION HAS ITS OWN UPDATE AND BUILD UNLIKE OTHER RULES */	
			if(!ajaxisError){
				jQuery.ajax({
				   	type: "POST",
				   	url: postfile,
				   	async: true,
				   	data: "validateValue="+fieldValue+"&validateId="+fieldId+"&validateError="+customAjaxRule+extraData,
				   	beforeSend: function(){		// BUILD A LOADING PROMPT IF LOAD TEXT EXIST		   			
				   		if(jQuery.validationEngine.settings.allrules[customAjaxRule].alertTextLoad){
				   		
				   			if(!jQuery("div."+fieldId+"formError")[0]){				   				
	 			 				return jQuery.validationEngine.buildPrompt(ajaxCaller,jQuery.validationEngine.settings.allrules[customAjaxRule].alertTextLoad,"load");
	 			 			}else{
	 			 				jQuery.validationEngine.updatePromptText(ajaxCaller,jQuery.validationEngine.settings.allrules[customAjaxRule].alertTextLoad,"load");
	 			 			}
			   			}
			  	 	},
			  	 	error: function(data,transport){ jQuery.validationEngine.debug("error in the ajax: "+data.status+" "+transport) },
					success: function(data){					// GET SUCCESS DATA RETURN JSON
						data = eval( "("+data+")");				// GET JSON DATA FROM PHP AND PARSE IT
						ajaxisError = data.jsonValidateReturn[2];
						customAjaxRule = data.jsonValidateReturn[1];
						ajaxCaller = jQuery("#"+data.jsonValidateReturn[0])[0];
						fieldId = ajaxCaller;
						ajaxErrorLength = jQuery.validationEngine.ajaxValidArray.length;
						existInarray = false;
						
			 			 if(ajaxisError == "false"){			// DATA FALSE UPDATE PROMPT WITH ERROR;
			 			 	
			 			 	_checkInArray(false)				// Check if ajax validation alreay used on this field
			 			 	
			 			 	if(!existInarray){		 			// Add ajax error to stop submit		 		
				 			 	jQuery.validationEngine.ajaxValidArray[ajaxErrorLength] =  new Array(2);
				 			 	jQuery.validationEngine.ajaxValidArray[ajaxErrorLength][0] = fieldId;
				 			 	jQuery.validationEngine.ajaxValidArray[ajaxErrorLength][1] = false;
				 			 	existInarray = false;
			 			 	}
				
			 			 	jQuery.validationEngine.ajaxValid = false;
							promptText += jQuery.validationEngine.settings.allrules[customAjaxRule].alertText+"<br />";
							jQuery.validationEngine.updatePromptText(ajaxCaller,promptText,"",true);				
						 }else{	 
						 	_checkInArray(true);
						 	jQuery.validationEngine.ajaxValid = true; 						   
	 			 			if(jQuery.validationEngine.settings.allrules[customAjaxRule].alertTextOk){	// NO OK TEXT MEAN CLOSE PROMPT	 			
	 			 				 				jQuery.validationEngine.updatePromptText(ajaxCaller,jQuery.validationEngine.settings.allrules[customAjaxRule].alertTextOk,"pass",true);
 			 				}else{
				 			 	ajaxValidate = false;		 	
				 			 	jQuery.validationEngine.closePrompt(ajaxCaller);
 			 				}		
			 			 }
			 			function  _checkInArray(validate){
			 				for(x=0;x<ajaxErrorLength;x++){
			 			 		if(jQuery.validationEngine.ajaxValidArray[x][0] == fieldId){
			 			 			jQuery.validationEngine.ajaxValidArray[x][1] = validate;
			 			 			existInarray = true;
			 			 		
			 			 		}
			 			 	}
			 			}
			 		}				
				});
			}
		}
		function _confirm(caller,rules,position){		 // VALIDATE FIELD MATCH
			confirmField = rules[position+1];
			
			if(jQuery(caller).attr('value') != jQuery("#"+confirmField).attr('value')){
				jQuery.validationEngine.isError = true;
				promptText += jQuery.validationEngine.settings.allrules["confirm"].alertText+"<br />";
			}
		}
		function _length(caller,rules,position){    	  // VALIDATE LENGTH
		
			startLength = eval(rules[position+1]);
			endLength = eval(rules[position+2]);
			feildLength = jQuery(caller).attr('value').length;

			if(feildLength<startLength || feildLength>endLength){
				jQuery.validationEngine.isError = true;
				promptText += jQuery.validationEngine.settings.allrules["length"].alertText+startLength+jQuery.validationEngine.settings.allrules["length"].alertText2+endLength+jQuery.validationEngine.settings.allrules["length"].alertText3+"<br />"
			}
		}
		function _maxCheckbox(caller,rules,position){  	  // VALIDATE CHECKBOX NUMBER
		
			nbCheck = eval(rules[position+1]);
			groupname = jQuery(caller).attr("name");
			groupSize = jQuery("input[name='"+groupname+"']:checked").size();
			if(groupSize > nbCheck){	
				jQuery.validationEngine.showTriangle = false;
				jQuery.validationEngine.isError = true;
				promptText += jQuery.validationEngine.settings.allrules["maxCheckbox"].alertText+"<br />";
			}
		}
		function _minCheckbox(caller,rules,position){  	  // VALIDATE CHECKBOX NUMBER
		
			nbCheck = eval(rules[position+1]);
			groupname = jQuery(caller).attr("name");
			groupSize = jQuery("input[name='"+groupname+"']:checked").size();
			if(groupSize < nbCheck){	
			
				jQuery.validationEngine.isError = true;
				jQuery.validationEngine.showTriangle = false;
				promptText += jQuery.validationEngine.settings.allrules["minCheckbox"].alertText+" "+nbCheck+" "+jQuery.validationEngine.settings.allrules["minCheckbox"].alertText2+"<br />";
			}
		}
		return(jQuery.validationEngine.isError) ? jQuery.validationEngine.isError : false;
	},
	submitForm : function(caller){
		if(jQuery.validationEngine.settings.ajaxSubmit){		
			if(jQuery.validationEngine.settings.ajaxSubmitExtraData){
				extraData = jQuery.validationEngine.settings.ajaxSubmitExtraData;
			}else{
				extraData = "";
			}
			jQuery.ajax({
			   	type: "POST",
			   	url: jQuery.validationEngine.settings.ajaxSubmitFile,
			   	async: true,
			   	data: jQuery(caller).serialize()+"&"+extraData,
			   	error: function(data,transport){ jQuery.validationEngine.debug("error in the ajax: "+data.status+" "+transport) },
			   	success: function(data){
			   		if(data == "true"){			// EVERYTING IS FINE, SHOW SUCCESS MESSAGE
			   			jQuery(caller).css("opacity",1)
			   			jQuery(caller).animate({opacity: 0, height: 0}, function(){
			   				jQuery(caller).css("display","none");
			   				jQuery(caller).before("<div class='ajaxSubmit'>"+jQuery.validationEngine.settings.ajaxSubmitMessage+"</div>");
			   				jQuery.validationEngine.closePrompt(".formError",true); 	
			   				jQuery(".ajaxSubmit").show("slow");
			   				if (jQuery.validationEngine.settings.success){	// AJAX SUCCESS, STOP THE LOCATION UPDATE
								jQuery.validationEngine.settings.success && jQuery.validationEngine.settings.success(); 
								return false;
							}
			   			})
		   			}else{						// HOUSTON WE GOT A PROBLEM (SOMETING IS NOT VALIDATING)
			   			data = eval( "("+data+")");	
			   			if(!data.jsonValidateReturn){
			   				 jQuery.validationEngine.debug("you are not going into the success fonction and jsonValidateReturn return nothing");
			   			}
			   			errorNumber = data.jsonValidateReturn.length	
			   			for(index=0; index<errorNumber; index++){	
			   				fieldId = data.jsonValidateReturn[index][0];
			   				promptError = data.jsonValidateReturn[index][1];
			   				type = data.jsonValidateReturn[index][2];
			   				jQuery.validationEngine.buildPrompt(fieldId,promptError,type);
		   				}
	   				}
   				}
			})	
			return true;
		}
		// LOOK FOR BEFORE SUCCESS METHOD		
			if(!jQuery.validationEngine.settings.beforeSuccess()){
				if (jQuery.validationEngine.settings.success){	// AJAX SUCCESS, STOP THE LOCATION UPDATE
					if(jQuery.validationEngine.settings.unbindEngine){ jQuery(caller).unbind("submit") }
					jQuery.validationEngine.settings.success && jQuery.validationEngine.settings.success(); 
					return true;
				}
			}else{
				return true;
			} 
		return false;
	},
	buildPrompt : function(caller,promptText,type,ajaxed) {			// ERROR PROMPT CREATION AND DISPLAY WHEN AN ERROR OCCUR
		if(!jQuery.validationEngine.settings){
			jQuery.validationEngine.defaultSetting()
		}
		deleteItself = "." + jQuery(caller).attr("id") + "formError"
	
		if(jQuery(deleteItself)[0]){
			jQuery(deleteItself).stop();
			jQuery(deleteItself).remove();
		}
		var divFormError = document.createElement('div');
		var formErrorContent = document.createElement('div');
		linkTofield = jQuery.validationEngine.linkTofield(caller)
		jQuery(divFormError).addClass("formError")
		
		if(type == "pass"){ jQuery(divFormError).addClass("greenPopup") }
		if(type == "load"){ jQuery(divFormError).addClass("blackPopup") }
		if(ajaxed){ jQuery(divFormError).addClass("ajaxed") }
		
		jQuery(divFormError).addClass(linkTofield);
		jQuery(formErrorContent).addClass("formErrorContent");
		
		jQuery("body").append(divFormError);
		jQuery(divFormError).append(formErrorContent);
			
		if(jQuery.validationEngine.showTriangle != false){		// NO TRIANGLE ON MAX CHECKBOX AND RADIO
			var arrow = document.createElement('div');
			jQuery(arrow).addClass("formErrorArrow");
			jQuery(divFormError).append(arrow);
			if(jQuery.validationEngine.settings.promptPosition == "bottomLeft" || jQuery.validationEngine.settings.promptPosition == "bottomRight"){
			jQuery(arrow).addClass("formErrorArrowBottom")
			jQuery(arrow).html('<div class="line1"><!-- --></div><div class="line2"><!-- --></div><div class="line3"><!-- --></div><div class="line4"><!-- --></div><div class="line5"><!-- --></div><div class="line6"><!-- --></div><div class="line7"><!-- --></div><div class="line8"><!-- --></div><div class="line9"><!-- --></div><div class="line10"><!-- --></div>');
		}
			if(jQuery.validationEngine.settings.promptPosition == "topLeft" || jQuery.validationEngine.settings.promptPosition == "topRight"){
				jQuery(divFormError).append(arrow);
				jQuery(arrow).html('<div class="line10"><!-- --></div><div class="line9"><!-- --></div><div class="line8"><!-- --></div><div class="line7"><!-- --></div><div class="line6"><!-- --></div><div class="line5"><!-- --></div><div class="line4"><!-- --></div><div class="line3"><!-- --></div><div class="line2"><!-- --></div><div class="line1"><!-- --></div>');
			}
		}
		jQuery(formErrorContent).html(promptText)
	
		callerTopPosition = jQuery(caller).offset().top;
		callerleftPosition = jQuery(caller).offset().left;
		callerWidth =  jQuery(caller).width();
		inputHeight = jQuery(divFormError).height();
	
		/* POSITIONNING */
		if(jQuery.validationEngine.settings.promptPosition == "topRight"){callerleftPosition +=  callerWidth -30; callerTopPosition += -inputHeight -10; }
		if(jQuery.validationEngine.settings.promptPosition == "topLeft"){ callerTopPosition += -inputHeight -10; }
		
		if(jQuery.validationEngine.settings.promptPosition == "centerRight"){ callerleftPosition +=  callerWidth +13; }
		
		if(jQuery.validationEngine.settings.promptPosition == "bottomLeft"){
			callerHeight =  jQuery(caller).height();
			callerleftPosition = callerleftPosition;
			callerTopPosition = callerTopPosition + callerHeight + 15;
		}
		if(jQuery.validationEngine.settings.promptPosition == "bottomRight"){
			callerHeight =  jQuery(caller).height();
			callerleftPosition +=  callerWidth -30;
			callerTopPosition +=  callerHeight + 15;
		}
		jQuery(divFormError).css({
			top:callerTopPosition,
			left:callerleftPosition,
			opacity:0
		})
		return jQuery(divFormError).animate({"opacity":0.87},function(){return true;});	
	},
	updatePromptText : function(caller,promptText,type,ajaxed) {	// UPDATE TEXT ERROR IF AN ERROR IS ALREADY DISPLAYED
		
		linkTofield = jQuery.validationEngine.linkTofield(caller);
		var updateThisPrompt =  "."+linkTofield;
		
		if(type == "pass") { jQuery(updateThisPrompt).addClass("greenPopup") }else{ jQuery(updateThisPrompt).removeClass("greenPopup")};
		if(type == "load") { jQuery(updateThisPrompt).addClass("blackPopup") }else{ jQuery(updateThisPrompt).removeClass("blackPopup")};
		if(ajaxed) { jQuery(updateThisPrompt).addClass("ajaxed") }else{ jQuery(updateThisPrompt).removeClass("ajaxed")};
	
		jQuery(updateThisPrompt).find(".formErrorContent").html(promptText);
		callerTopPosition  = jQuery(caller).offset().top;
		inputHeight = jQuery(updateThisPrompt).height();
		
		if(jQuery.validationEngine.settings.promptPosition == "bottomLeft" || jQuery.validationEngine.settings.promptPosition == "bottomRight"){
			callerHeight =  jQuery(caller).height();
			callerTopPosition =  callerTopPosition + callerHeight + 15;
		}
		if(jQuery.validationEngine.settings.promptPosition == "centerRight"){  callerleftPosition +=  callerWidth +13;}
		if(jQuery.validationEngine.settings.promptPosition == "topLeft" || jQuery.validationEngine.settings.promptPosition == "topRight"){
			callerTopPosition = callerTopPosition  -inputHeight -10;
		}
		jQuery(updateThisPrompt).animate({ top:callerTopPosition });
	},
	linkTofield : function(caller){
		linkTofield = jQuery(caller).attr("id") + "formError";
		linkTofield = linkTofield.replace(/\[/g,""); 
		linkTofield = linkTofield.replace(/\]/g,"");
		return linkTofield;
	},
	closePrompt : function(caller,outside) {						// CLOSE PROMPT WHEN ERROR CORRECTED
		if(!jQuery.validationEngine.settings){
			jQuery.validationEngine.defaultSetting()
		}
		if(outside){
			jQuery(caller).fadeTo("fast",0,function(){
				jQuery(caller).remove();
			});
			return false;
		}
		if(typeof(ajaxValidate)=='undefined'){ajaxValidate = false}
		if(!ajaxValidate){
			linkTofield = jQuery.validationEngine.linkTofield(caller);
			closingPrompt = "."+linkTofield;
			jQuery(closingPrompt).fadeTo("fast",0,function(){
				jQuery(closingPrompt).remove();
			});
		}
	},
	debug : function(error) {
		if(!jQuery("#debugMode")[0]){
			jQuery("body").append("<div id='debugMode'><div class='debugError'><strong>This is a debug mode, you got a problem with your form, it will try to help you, refresh when you think you nailed down the problem</strong></div></div>");
		}
		jQuery(".debugError").append("<div class='debugerror'>"+error+"</div>");
	},			
	submitValidation : function(caller) {					// FORM SUBMIT VALIDATION LOOPING INLINE VALIDATION
		var stopForm = false;
		jQuery.validationEngine.ajaxValid = true;
		jQuery(caller).find(".formError").remove();
		var toValidateSize = jQuery(caller).find("[class*=validate]").size();
		
		jQuery(caller).find("[class*=validate]").each(function(){
			linkTofield = jQuery.validationEngine.linkTofield(this);
			
			if(!jQuery("."+linkTofield).hasClass("ajaxed")){	// DO NOT UPDATE ALREADY AJAXED FIELDS (only happen if no normal errors, don't worry)
				var validationPass = jQuery.validationEngine.loadValidation(this);
				return(validationPass) ? stopForm = true : "";					
			};
		});
		ajaxErrorLength = jQuery.validationEngine.ajaxValidArray.length;		// LOOK IF SOME AJAX IS NOT VALIDATE
		for(x=0;x<ajaxErrorLength;x++){
	 		if(jQuery.validationEngine.ajaxValidArray[x][1] == false){
	 			jQuery.validationEngine.ajaxValid = false;
 			}
 		}
		if(stopForm || !jQuery.validationEngine.ajaxValid){		// GET IF THERE IS AN ERROR OR NOT FROM THIS VALIDATION FUNCTIONS
			if(jQuery.validationEngine.settings.scroll){
				destination = jQuery(".formError:not('.greenPopup'):first").offset().top;
				jQuery(".formError:not('.greenPopup')").each(function(){
					testDestination = jQuery(this).offset().top;
					if(destination>testDestination){
						destination = jQuery(this).offset().top;
					}
				})
				jQuery("html:not(:animated),body:not(:animated)").animate({ scrollTop: destination}, 1100);
			}
			return true;
		}else{
			return false;
		}
	}
}
})(jQuery);