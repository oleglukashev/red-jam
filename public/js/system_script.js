/* 	function for work with library jGrowl; script and css including in header.php  */
function jGrowl(text,theme,header){
	if(theme=="error")	
		header = "Error!";
	$.jGrowl.defaults.position = 'bottom-left';		/* position of messages: top-left, top-right, bottom-left, bottom-right, center	*/
	$.jGrowl.defaults.check = 1000;					/* time in millisecond with which jGrowl will check posts to be removed from screen	*/
	$.jGrowl.defaults.closer = false;				/* show button 'Close all' 	*/
	$.jGrowl.closerTemplate = "Close all message";	/* message on button 'Close all'	*/
	$.jGrowl(text,{
	theme: 		theme,			/* theme of message. Create in 'bitronic_template/styles.css'	*/
	header: 	header,			/* title of message	*/
	life:		7000,			/* lifetime message in millisecond 	*/
	sticky: 	false,			/* closed only by user 	*/ 
	glue:		'after',		/* where show new message 'after' or 'before' last message 	*/
	//closeTemplate:	'',		/* symbol of button 'close'	*/
	});
}
/*	function for close user menu in header	*/
function yenisite_um_close(){
	if($('ul.user_menu').hasClass('opened')) {
		$('ul.user_menu').removeClass('opened').addClass('closed').fadeOut();
	}
}

function setSortFields(order, by){
	$('#order_field').attr('value', order);
	$('#by_field').attr('value', by);
	document.forms['sort_form'].submit();
	return false;
}

function setViewField(view){
	$('#view_field').attr('value', view);	
	document.forms['view_form'].submit();
	return false;
}

function setQuantity(id, operation){
	var q = $(id).attr('value');
	if(operation == '-' && q > 1)
		q --;
	if(operation == '+' )
		q++;	
	 $(id).attr('value', q);	
	 $('#BasketRefresh').attr('value', 'Y');
	
	document.forms['basket_form'].submit();
}


function setQuantityTable(id, operation){
	var q = $(id).attr('value');
	if(operation == '-' && q > 1)
		q --;
	if(operation == '+' )
		q++;	
	 $(id).attr('value', q);	
}


function setDelete(id){
	$(id).attr('value', 'Y');	
	 $('#BasketRefresh').attr('value', 'Y');
	document.forms['basket_form'].submit();
}

$(function(){
	
	$("#search_select").change(function(){	    
	    var selectVal = $('#search_select :selected').val();	   
		$("#search_form").attr("action",  selectVal);
	});
	
	$(".s_submit").click(function(){
		$("#search_form").submit();
	});
	

	
});

$(function(){
	
	
	$('.call_order button').click(
		function(){
				$('#mask').show();
				$('#add-popup').show();
			
		}
	);
	
		$('.slider #button7').click(function(){
				$('.no-hide ul').each(function(){
						var f_html = $(this).find('li:first');
						$(this).find('li:first').remove();
						f_html.insertAfter($(this).find('li:last'));
							$('.sl_wrapper li').unbind();
							$('.sl_wrapper li').hover(function(){
								$(this).find('.item-popup').show();
								$(this).css({'z-index':50});
							}, function() {
								$(this).find('.item-popup').fadeOut();
								$(this).css({'z-index':1});
							});
							
					});	
	
	$('.sl_wrapper li').attr('class', '');
	
	
		$('.tab_block, sim_item_slider, .no-hide').each(function(){
		var th = $(this);
		var slw = $('.sl_wrapper').width();
		/*th.find('ul li:lt(4)').addClass('showed');*/
		var count = Math.floor( $(".sl_wrapper").width() / 240);
		th.find('ul li:lt('+count+')').addClass('showed');
		$(window).resize(function(){
			th.find("li").removeClass('showed');
			var count = Math.floor( $(".sl_wrapper").width() / 240);
			th.find('ul li:lt('+count+')').addClass('showed');
			
			$('.slider a.next').click(function(){
				th.find('ul').append(th.find('ul li:first'));
				th.find('ul li:lt('+count+')').addClass('showed');
				th.find('ul li:gt('+(count-1)+')').removeClass('showed');
			});
			
			$('.slider a.prev').click(function(){
				th.find('ul').prepend(th.find('ul li:last'));
				th.find('ul li:lt('+count+')').addClass('showed');
				th.find('ul li:gt('+(count-1)+')').removeClass('showed');
			});
		});
	
		$('.slider a.next').click(function(){
			th.find('ul').append(th.find('ul li:first'));
			th.find('ul li:lt('+count+')').addClass('showed');
			th.find('ul li:gt('+(count-1)+')').removeClass('showed');
		});
		
		$('.slider a.prev').click(function(){
			th.find('ul').prepend(th.find('ul li:last'));
			th.find('ul li:lt('+count+')').addClass('showed');
			th.find('ul li:gt('+(count-1)+')').removeClass('showed');
		});
	});
	
	
	
	
	
	
					
			});	
			
			$('.slider #button8').click(function(){				
				$('.no-hide ul').each(function(){
						var f_html = $(this).find('li:last');
						$(this).find('li:last').remove();
						f_html.insertBefore($(this).find('li:first'));
							$('.sl_wrapper li').unbind();
							$('.sl_wrapper li').hover(function(){
								$(this).find('.item-popup').show();
								$(this).css({'z-index':50});
							}, function() {
								$(this).find('.item-popup').fadeOut();
								$(this).css({'z-index':1});
							});
							
					});
		
		$('.sl_wrapper li').attr('class', '');
					
	$('.tab_block, sim_item_slider, .no-hide').each(function(){
		var th = $(this);
		var slw = $('.sl_wrapper').width();
		/*th.find('ul li:lt(4)').addClass('showed');*/
		var count = Math.floor( $(".sl_wrapper").width() / 240);
		th.find('ul li:lt('+count+')').addClass('showed');
		$(window).resize(function(){
			th.find("li").removeClass('showed');
			var count = Math.floor( $(".sl_wrapper").width() / 240);
			th.find('ul li:lt('+count+')').addClass('showed');
			
			$('.slider a.next').click(function(){
				th.find('ul').append(th.find('ul li:first'));
				th.find('ul li:lt('+count+')').addClass('showed');
				th.find('ul li:gt('+(count-1)+')').removeClass('showed');
			});
			
			$('.slider a.prev').click(function(){
				th.find('ul').prepend(th.find('ul li:last'));
				th.find('ul li:lt('+count+')').addClass('showed');
				th.find('ul li:gt('+(count-1)+')').removeClass('showed');
			});
		});
	
		$('.slider a.next').click(function(){
			th.find('ul').append(th.find('ul li:first'));
			th.find('ul li:lt('+count+')').addClass('showed');
			th.find('ul li:gt('+(count-1)+')').removeClass('showed');
		});
		
		$('.slider a.prev').click(function(){
			th.find('ul').prepend(th.find('ul li:last'));
			th.find('ul li:lt('+count+')').addClass('showed');
			th.find('ul li:gt('+(count-1)+')').removeClass('showed');
		});
	});					
					
					
					
			})
			
			
			
			
	});
	
    $(function(){
        var minh = 0;
        $('.catalog-list li').each(function(){
            if(minh==0 || $(this).height() > minh)
                minh = $(this).height();
        });
        $('.catalog-list li').css('height', minh + 'px');
    });	
    
        $(function(){

	$('a[href*="ADD2BASKET"]').find('button').click(function(){
		var par = $(this).parent();
		if(par.attr("href"))
			window.location = par.attr("href");
		else{
			par = $(this).parent().parent();
			window.location = par.attr("href");
		}
		return false;
	});

    });
