function yenisite_bs_close(){
	if($('#yen-bs-bag-popup').hasClass('yen-bs-opened')) {
		$('#yen-bs-bag-popup').removeClass('yen-bs-opened').addClass('yen-bs-closed');
	}
}

$(document).ready(function(){
	$(".yen-bs-count a.yen-bs-count_link").unbind('click');
	$(window).resize(function(){
				var hw = $(window).height();
				var ht = $('#yen-bs-bag-popup .yen-bs-bask_wr table').height();
				if(ht > (hw-200)) {
					$('.yen-bs-count .yen-bs-bask_wr').css('height', hw-300).addClass('yen-bs-hh');
				};
			});
	$(".yen-bs-count a.yen-bs-count_link").click(function(){
		if($('#yen-bs-bag-popup').hasClass('yen-bs-closed')) {
			$('.yen-bs-basket-popup').removeClass('yen-bs-opened').addClass('yen-bs-closed');
			$('#yen-bs-bag-popup').removeClass('yen-bs-closed').addClass('yen-bs-opened');
			// $('#yen-bs-bag-popup').parent().parent().addClass('yen-bs-up');
			var hw = $(window).height();
			var ht = $('#yen-bs-bag-popup .yen-bs-bask_wr table').height();
			if(ht > (hw-200)) {
				$('.yen-bs-count .yen-bs-bask_wr').css('height', hw-300).addClass('yen-bs-hh');
			};
		}
		else {
			$('#yen-bs-bag-popup').removeClass('yen-bs-opened').addClass('yen-bs-closed');
		}
	});
	$(".yen-bs-q").focus(function(){
		$('#'+$(this).attr('id').replace('YS_BS_QUANTITY_', 'YS_BS_OLD_Q_')).val($(this).val());
		$(this).select() ;
	});
	$(document).keydown(function(eventObject){
		if(eventObject.which==27)
			yenisite_bs_close();
	});

	var onBasket;
	$('.yen-bs-box').mouseover(function(){onBasket=true;});
	$('.yen-bs-box').mouseout(function(){onBasket=false;});
		
		$('#fixbody a:not(.yen-bs-box a)').on('click',function(){	
			if(onBasket==false)	
				yenisite_bs_close();
		});
		
	$(document).on('click',function(){
		if(onBasket==false)
			yenisite_bs_close();
	});

});

function yenisite_number_format (number, decimals, dec_point, thousands_sep) {
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

function yenisite_declOfNum(number, titles)
{
	var index = 0;
	var cases = [ 2, 0, 1, 1, 1, 2 ];
	if(number % 100 > 4 && number % 100 < 20)
		index = 2; 
	else
		index = cases[Math.min(number%10, 5)];
	return titles[index];
}

function yenisite_set_quantity(id, sign, url, titles, control_quantity, product_id, quantity_logic, err3)
{
	var current_quantity = 0;
	var price = 0;
	var old_total_sum =0;
	var total_sum = 0;
	var new_quantity = 0;
	var id_basket_element = '';
	var delta_quantity = 0;
	var str_total_sum = '';
	if(sign != 'c')
		current_quantity = $('#YS_BS_QUANTITY_'+id).val();
	else
		current_quantity = $('#YS_BS_OLD_Q_'+id).val();
	price = $('#YS_BS_PRICE_'+id).val();
	total_sum = $('#yen-bs-all-sum').val(); 
	old_totla_sum = total_sum; 
	total_sum = total_sum - price * current_quantity ;
	old_quantity = current_quantity ;
	if(Number(current_quantity) >= 0){
		switch(sign){
			case 'p':
				delta_quantity = 1;
			break;
			case 'm':
				delta_quantity = -1;
			break;
			case 'd':
				delta_quantity = 0;
				current_quantity = 0; 
			break; 
			case 'c':
				delta_quantity = 0 ;
				current_quantity = $('#YS_BS_QUANTITY_'+id).val();
			break;
			default:
				delta_quantity = 0;
			break;
		}
	
		new_quantity = Number(current_quantity) + Number(delta_quantity);
		id_basket_element = $('#YS_BS_QUANTITY_'+id).attr('name');
		id_basket_element = id_basket_element.replace('YS_BS_QUANTITY_', '');
		$.post(url, {id_basket_element: id_basket_element, new_quantity: new_quantity, action: 'setQuantity', control_quantity: control_quantity, product_id:product_id},
		function(data) {
			data = $.trim(data) ;
			new_quantity = Number(data); 
			if(!isNaN(new_quantity))
			{
				if(quantity_logic == 'q_products')
				{
					var product_count = Number($('#YS_BS_COUNT_PRODUCT').html()) + Number(delta_quantity) ;
					$('#YS_BS_COUNT_PRODUCT').html(product_count);
					$('#YS_BS_COUNT_STRING').html(yenisite_declOfNum(product_count, titles));
				}
				$('#YS_BS_QUANTITY_'+id).val(new_quantity);
				total_sum += price * new_quantity ;
				if(total_sum < 0 || isNaN(total_sum))
					total_sum = 0;
				$('#yen-bs-all-sum').val(total_sum);
				str_total_sum = yenisite_number_format(total_sum, 2, '.', ' ') ;
				$('#YS_BS_TOTALSUM_TOP').html(str_total_sum);
				$('#YS_BS_TOTALSUM').html(str_total_sum);
			}
			else
			{
				if(data == 'del')
				{
					if(total_sum < 0 || isNaN(total_sum))
						total_sum = 0;
					$('#yen-bs-all-sum').val(total_sum); 
					str_total_sum = yenisite_number_format(total_sum, 2, '.', ' ') ;
					$('#YS_BS_TOTALSUM_TOP').html(str_total_sum);
					$('#YS_BS_TOTALSUM').html(str_total_sum);
					$('#YS_BS_ROW_'+id).remove();
					var product_count ;
					if(quantity_logic == 'q_products') {
						product_count = Number($('#YS_BS_COUNT_PRODUCT').html()) - Number(old_quantity) ;
					}
					else {
						product_count = Number($('#YS_BS_COUNT_PRODUCT').html())-1;
					}
					$('#YS_BS_COUNT_PRODUCT').html(product_count);
					$('#YS_BS_COUNT_STRING').html(yenisite_declOfNum(product_count, titles));
				}
				else if(data == 'err3')
				{
					var err_txt = err3.replace('#NUM#', old_quantity);
					jGrowl(err_txt);
				}
			}
		});			
	}
}