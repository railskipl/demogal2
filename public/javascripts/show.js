jQuery(document).ready(function(){

  if (jQuery("#product_size").val() != undefined)
  {
    setPrice(jQuery("#product_size").val());
    jQuery("#product_size").change(function(){
      setPrice(jQuery(this).val());
    });
  }

	jQuery("#zoom").lightBox();

	jQuery(".sub_menu a").click(function(e) {
		e.preventDefault();
		var id = jQuery(this).attr("name");
		jQuery(".sub_menu a").removeClass("selected");
		jQuery(this).addClass("selected");
		jQuery(".container").hide();
		jQuery("#"+id).show();
		return false;
	});

	jQuery(".carousel").jCarouselLite({
		btnNext: ".next",
		btnPrev: ".prev",
		vertical: true,
		scroll: 1,
		circular: false
	});

	jQuery("#send_to_friend").click(function() {
		var title = jQuery(this).attr("title");
		jQuery.ajax({
		  type:'GET',
		  url: jQuery(this).attr('href'),
		  success:function(data) {
			jQuery.openWindow(520, 400, title, data);
		  }
		});
		return false;
	});

	jQuery("#gift_certificate").click(function() {
    var title = jQuery(this).attr("title");
		jQuery.ajax({
		  type:'GET',
		  url: jQuery(this).attr('href'),
		  success:function(data) {
			jQuery.openWindow(500, 530, title, data);
		  }
		});
		return false;
	});

  jQuery('#product_frame').click(function() {
    var price = parseFloat(jQuery('#product_price').val());
    var frame = parseFloat(jQuery('#product_frame_price').val());
    if (jQuery(this).attr('checked'))
      price += frame;
    else
      price -= frame;
    jQuery('#show_price').html(formatCurrency(price));
    jQuery('#product_price').val(price);
  });

  jQuery('#product_matt').click(function() {
    var price = parseFloat(jQuery('#product_price').val());
    var matt  = parseFloat(jQuery('#product_matt_price').val());
    if (jQuery(this).attr('checked'))
      price += matt;
    else
      price -= matt;
    jQuery('#show_price').html(formatCurrency(price));
    jQuery('#product_price').val(price);
  });
});


function formatCurrency(num) {
  num = num.toString().replace(/\jQuery|\,/g,'');
  if(isNaN(num))
    num = "0";
  sign = (num == (num = Math.abs(num)));
  num = Math.floor(num*100+0.50000000001);
  cents = num%100;
  num = Math.floor(num/100).toString();
  if(cents<10)
    cents = "0" + cents;
  for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
    num = num.substring(0,num.length-(4*i+3))+','+
  num.substring(num.length-(4*i+3));
  return (((sign)?'':'-') + 'jQuery' + num + '.' + cents);
}

function setPrice(val)
{
  price = parseFloat(prices[val]);

  if (jQuery('#product_matt').attr('checked'))
    price += parseFloat(jQuery('#product_matt_price').val());
  if (jQuery('#product_frame').attr('checked'))
    price += parseFloat(jQuery('#product_frame_price').val());

  jQuery('#show_price').html(formatCurrency(price));
  jQuery('#product_price').val(price);
}