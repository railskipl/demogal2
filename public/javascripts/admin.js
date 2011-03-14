// Function for easily submitting forms with ajax.
// The action being submitted to should return javascript (I.e. create.js.erb / update.js.erb)
// Just add a selector to the page like jQuery("new_comment").submitWithAjax();
jQuery.fn.submitWithAjax = function() {
	this.submit(function() {
		jQuery.post(jQuery(this).attr("action"), jQuery(this).serialize(), null, "script");
		return false;
	});
}

// makes sure our ajax requests actually look like ajax requests to the server
jQuery.ajaxSetup({
  'beforeSend': function(xhr) {xhr.setRequestHeader("Accept", "text/javascript")}
});

jQuery(document).ready(function() {

	// validate all forms
	jQuery("form").validationEngine();
	
	jQuery("a[rel='colorbox']").colorbox();
	jQuery("a[rel='colorbox-frame']").colorbox({iframe:true, innerWidth:660, innerHeight:600});
	
	jQuery('a.delete').live('click', function(event) {
		if ( confirm("Are you sure you want to delete this record?") ) {
			// put together the matching for related links
			href_match = this.href.substring(this.href.length - 12);
			jQuery.post(this.href, {_method:"delete", authenticity_token:AUTH_TOKEN}, function(data) {
				// inform the user of status via gritter (growl)
        jQuery.gritter.add({
      		title: data.title,
      		text: data.message,
      		image: '/images/icons/notice.png',
      		time: 3000
      	});
				// look for any related links, like edit, view etc. and remove them
				jQuery("a[href*='" + href_match + "']").each(function() { 
					// change the link to text by adding the text we want and removing the link
					jQuery(this).after("x");
					jQuery(this).remove();
				});
   	  }, "json");
		}
		return false;
	});
	
	jQuery('a.delete-no-conf').live('click', function(event) {
		href_match = this.href.substring(this.href.length - 12);
		jQuery.post(this.href, {_method:"delete", authenticity_token:AUTH_TOKEN}, function(data) {
			// not going to message the user, gets cluttered
  	  // look for any related links, like edit, view etc. and remove them
			jQuery("a[href*='" + href_match + "']").each(function() { 
				// change the link to text by adding the text we want and removing the link
				jQuery(this).after("x");
				jQuery(this).remove();
			});
		}, "json");
		return false;
	});
	
});