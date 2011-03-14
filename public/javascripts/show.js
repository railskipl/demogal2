$(document).ready(function(){

  if ($("#product_size").val() != undefined)
  {
    setPrice($("#product_size").val());
    $("#product_size").change(function(){
      setPrice($(this).val());
    });
  }

	$("#zoom").lightBox();

	$(".sub_menu a").click(function(e) {
		e.preventDefault();
		var id = $(this).attr("name");
		$(".sub_menu a").removeClass("selected");
		$(this).addClass("selected");
		$(".container").hide();
		$("#"+id).show();
		return false;
	});

	$(".carousel").jCarouselLite({
		btnNext: ".next",
		btnPrev: ".prev",
		vertical: true,
		scroll: 1,
		circular: false
	});

	$("#send_to_friend").click(function() {
		var title = $(this).attr("title");
		$.ajax({
		  type:'GET',
		  url: $(this).attr('href'),
		  success:function(data) {
			$.openWindow(520, 400, title, data);
		  }
		});
		return false;
	});

	$("#gift_certificate").click(function() {
    var title = $(this).attr("title");
		$.ajax({
		  type:'GET',
		  url: $(this).attr('href'),
		  success:function(data) {
			$.openWindow(500, 530, title, data);
		  }
		});
		return false;
	});

  $('#product_frame').click(function() {
    var price = parseFloat($('#product_price').val());
    var frame = parseFloat($('#product_frame_price').val());
    if ($(this).attr('checked'))
      price += frame;
    else
      price -= frame;
    $('#show_price').html(formatCurrency(price));
    $('#product_price').val(price);
  });

  $('#product_matt').click(function() {
    var price = parseFloat($('#product_price').val());
    var matt  = parseFloat($('#product_matt_price').val());
    if ($(this).attr('checked'))
      price += matt;
    else
      price -= matt;
    $('#show_price').html(formatCurrency(price));
    $('#product_price').val(price);
  });
});


function formatCurrency(num) {
  num = num.toString().replace(/\$|\,/g,'');
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
  return (((sign)?'':'-') + '$' + num + '.' + cents);
}

function setPrice(val)
{
  price = parseFloat(prices[val]);

  if ($('#product_matt').attr('checked'))
    price += parseFloat($('#product_matt_price').val());
  if ($('#product_frame').attr('checked'))
    price += parseFloat($('#product_frame_price').val());

  $('#show_price').html(formatCurrency(price));
  $('#product_price').val(price);
}