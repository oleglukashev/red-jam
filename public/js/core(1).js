$(document).ready(function(){
//empty links
	$('a[href=#]').click(function(){
		return false;
	});
	
    //select
	$('#search_field').click(function(){
		$(this).parent().find('.similar_items').slideToggle(200);
		$(this).toggleClass('active');
		$(this).val('');
	});
	
/*BASKET
------------------------------------------------*/
	$(window).scroll(function(){
		if($(window).scrollTop() >= 100){
			$('.basket-box').addClass('scrollBasket');
		}else{
			$('.basket-box').removeClass('scrollBasket');
		}
	});
	
	
	
/*INPUTS, SELECTS
-------------------------------------------------*/
    $("#search_select, .toggle-list, .param_block select, .select, .typeselect").selectBox();
    //$(".show_filter select").selectBox();
	
    $("input.checkbox, input.radio").uniform();
	
/*SEARCH
-------------------------------------------------*/
	
	$('#send-form input.text').focus(function(){
		$(this).val('');
	});
/* ENTER, LOGIN
---------------------------------------------------*/
	$('a.enter').click(function(){
		//$(this).hide();
		/*-РЈР±СЂР°С‚СЊ РЅРёР¶РµСЃРґРµР»СѓСЋС‰СѓСЋ СЃС‚СЂРѕРєСѓ, С‚.Рє. РѕРЅР° РґР»СЏ РґРµР� РѕРЅСЃС‚СЂР°С†РёРё Р±Р»РѕРєР°------------------------------------------------------!!!!!*/
		$('div.uid').fadeIn();
		/**/
		$('#login-popup, #mask').show();
	});


	$('a.uid').click(function(){
		if($('.user_menu').hasClass('closed')) {
			$('.basket-popup').removeClass('opened').addClass('closed').fadeOut();
			$('.user_menu').removeClass('closed').addClass('opened').fadeIn();
		} else {
			$('.user_menu').removeClass('opened').addClass('closed').fadeOut();
		};
	});
	
	/*----FOR CLOSE USER MENU---*/
	//ON PUSH ESC
	$(document).keydown(function(eventObject){
		//27 - ASCII code of button 'ESC'
		if(eventObject.which==27)
			yenisite_um_close();
	});
	//ON CLICK OUTSIDE USER MENU
	var onUserMenu;
	$('div.user').mouseover(function(){onUserMenu=true;});
	$('div.user').mouseout(function(){onUserMenu=false;});
	
		// this code need for elements which changes during work page
		$('#fixbody a:not(div.user a)').on('click',function(){				
			if(onUserMenu==false)
				yenisite_um_close();
		});
		
	$(document).on('click',function(){
		if(onUserMenu==false)
			yenisite_um_close();
	});
	/*   -------------------------------------------------------   */
	
/*MASK
------------------------------*/
	$('#mask, a.close').click(function(){
		$('#mask, .popup, #pic_popup').hide();
	});
	/*----FOR CLOSE POPUP WINDOWS---*/
	//ON PUSH ESC
	$(document).keydown(function(eventObject){
		//27 - ASCII code of button 'ESC'
		if(eventObject.which==27)
		{		
			$('#mask, .popup, #pic_popup').hide();
		}
	});



	/*BASKET POPUP
-----------------------------*/
	$(".count a.count_link").click(function(){
		if($('#bag-popup').hasClass('closed')) {
			$('.basket-popup').removeClass('opened').addClass('closed');
			$('#bag-popup').removeClass('closed').addClass('opened');
			$('#bag-popup').parent().parent().addClass('up');
			/*$('#mask').show().addClass('glass');*/
			/*basket resize*/
			var hw = $(window).height();
			var ht = $('#bag-popup .bask_wr table').height();
			if(ht > (hw-200)) {
				$('.count .bask_wr').css('height', hw-300).addClass('hh');
			};
			$(window).resize(function(){
				var hw = $(window).height();
				var ht = $('#bag-popup .bask_wr table').height();
				if(ht > (hw-200)) {
					$('.count .bask_wr').css('height', hw-300).addClass('hh');
				};
			});
		}
		else {
			$('#bag-popup').removeClass('opened').addClass('closed');
			/*$('#mask').show().removeClass('glass');*/
			
		}
	});
	
	$(".compare a.compare_link").click(function(){
		if($('#compare-popup').hasClass('closed')) {
			$('.basket-popup').removeClass('opened').addClass('closed');
			$('#compare-popup').removeClass('closed').addClass('opened');
			/*basket resize*/
			var hw = $(window).height();
			var ht = $('#compare-popup .bask_wr table').height();
			if(ht > (hw-200)) {
				$('.compare .bask_wr').css('height', hw-200).addClass('hh');
			};
			$(window).resize(function(){
				var hw = $(window).height();
				var ht = $('#compare-popup .bask_wr table').height();
				if(ht > (hw-200)) {
					$('.compare .bask_wr').css('height', hw-200).addClass('hh');
				};
			});

		}
		else {;
			$('#compare-popup').removeClass('opened').addClass('closed');
			
		}
	});
	
	var ico = 0;
	
	$(".item_gal a, .item_detail_pic a").click(function(){
		$('#mask, #pic_popup').show();
		$('.pop_img img').attr('src', $(this).attr('href'));
		$('.pop_descr').html($(this).find('img').attr('alt'));

		ico = parseInt($(this).attr('class').replace('ico_',''));
		
		return false;
	});
	
	$('#pic_popup .next').click(function(){
		ico = ico+1;
		if($('.ico_'+ico).length){
			$('.pop_img img').attr('src', $('.ico_'+ico).attr('href'));
			$('.pop_descr').html( $('.ico_'+ico).find('img').attr('alt'));
		}
		else ico = ico-1;			
	});
	
	$('#pic_popup .prev').click(function(){
		ico = ico-1;
		if(ico < 0) {ico =0; return;}		
		
		$('.pop_img img').attr('src', $('.ico_'+ico).attr('href'));
		$('.pop_descr').html( $('.ico_'+ico).find('img').attr('alt'));
		
	});
	

	
/*BASKET DELETE
------------------------------*/
	$('#compare-popup a.delete').click(function(){
		$(this).parent().parent().hide();
		var hw = $(window).height();
		var ht = $('#compare-popup .bask_wr table').height();
		if(ht < (hw-200)) {
			$('.compare .bask_wr').css('height', 'auto');
		};
	});
	
	$('#bag-popup a.delete').click(function(){
		$(this).parent().parent().hide();
		var hw = $(window).height();
		var ht = $('#bag-popup .bask_wr table').height();
		if(ht < (hw-200)) {
			$('.count .bask_wr').css('height', 'auto');
		};
	});
	
/*SLIDER
---------------------------------------------------------*/
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
	
/*		$('.sim_item_slider .slider li:lt(4)').addClass('showed');
		$('.slider a.next').click(function(){
			$('.sim_item_slider .slider ul').append($('.sim_item_slider .slider ul li:first'));
			$('.sim_item_slider .slider ul li:lt(4)').addClass('showed');
			$('.sim_item_slider .slider ul li:gt(3)').removeClass('showed');
		});
		
		$('.slider a.prev').click(function(){
			$('.sim_item_slider .slider ul').prepend($('.sim_item_slider .slider ul li:last'));
			$('.sim_item_slider .slider ul li:lt(4)').addClass('showed');
			$('.sim_item_slider .slider ul li:gt(3)').removeClass('showed');
		});*/
/*slider popup
-------------------------------------------------------*/
	$('.sl_wrapper li, .catalog-list li').hover(function(){
		$(this).find('.item-popup').show();
		$(this).css({'z-index': 50});
		
		$(this).find('.item-popup').addClass('item-hover');
	}, function() {
		var openedMenu = $(this).find('.selectBox-menuShowing');
		
		if ( openedMenu.length != 1 ) {

			$(this).find('.item-popup').fadeOut();
			$(this).css({'z-index': 1});
			
			$(this).find('.item-popup').removeClass('item-hover');
		}
	});

/*SLIDER
--------------------------------------------------------*/
	/*var slw = $('.sl_wrapper').width();
	$('.sl_wrapper li').css({width : slw/4});
	$(window).resize(function(){
		var slw = $('.sl_wrapper').width();
		$('.sl_wrapper li').css({width : slw/4});
	});*/

/*TV
------------------------------------------------------*/
	$('.tv_menu a').each(function(){
	 if($(this).text().length > 20)
	  $(this).parent().addClass('wide');
	});

	
	var tabContainers = $('div.tv_wrapper > div.tv_tab');
	tabContainers.hide().filter(':first').show();
	
	var time = 1000;
	$('.tab_nav a').click(function () {
		
			/* tabContainers.animate({opacity: "hide"},{duration:time,complete:function(){alert("Animate complete");}}) */
			/* tabContainers.filter(this.hash).animate({opacity: "show"}, time); */
			
			tabContainers.fadeOut(time).delay(time).filter(this.hash).fadeIn(time);
			$('.tab_nav a').removeClass('active');
			$(this).addClass('active');
			
			$('.tab_nav a[href='+$(this).attr("href")+']').addClass('active');
			
			return false;
	}).filter(':first').click();
	
	var useAuto = $('#use').attr("value");
	var delayAuto = $('#delay').attr("value");

	if (useAuto=="Y"){
	var i = 0;
	setInterval(function() {
		
		i=i+1;
		$('.tab_nav a').eq(i).click();
		if (i==$('.tv_pager ul.tab_nav li a').length){i=0;};
		
	}, 1000*delayAuto);};
	
	
/*ALT POPUP
--------------------------------------------------------*/
	$('.sl_img').append('<div class=img_popup><div class=top_line></div><div class=cont></div></div>');
	$('.item-popup .sl_img img').hover(function(){
		$(this).parent().find('div.img_popup .cont').html($(this).attr('alt'));
		$(this).parent().find('.img_popup').show();
	}, function(){
		$('.sl_img .img_popup').fadeOut();
		});
		
/*BASKET ADD LABEL
------------------------------------------------*/
	$('.add_to_basket').click(function(){
		$('#add_message').animate({ right : '0'}, 500).delay(2000).animate({ right : '-200'}, 800);
	});
	
	$('#add_message').click(function(){
		$('#add_message').animate({ right : '-200'}, 800);
	});
	
/*MARK
-------------------------------------------------*/
	$('.catalog-list li, .catalog-list-view li, .item_detail_pic').each(function(){
		var mark = $(this).find('.mark').length;
		if(mark > 1) {
			$(this).find('.mark:eq(1)').css({'top': 30});
			$(this).find('.mark:eq(2)').css({'top': 60});
			$(this).find('.mark:eq(3)').css({'top': 90});
			$(this).find('.mark:eq(4)').css({'top': 120});
		}
	});


/*ITEM DESCR TABS
----------------------------------------------------*/
	$('.tab_block:eq(0)').show();

	$('.slider_cat li:eq(0), .slider_cat li:eq(0) a.main').click(function(){		
		$('.slider_cat li').removeClass('active');
		$('.slider_cat li:eq(0)').addClass('active');
		
/*$('.tab_block').each(function(){
				if(!$(this).hasClass('no-hide'))
					$(this).hide();
		});*/
		$('.tab_block').hide();
		
		
		$('.tab_block:eq(0)').show();
	});
	
	$('.slider_cat li:eq(1), .slider_cat li:eq(1) a.main').click(function(){
		$('.slider_cat li').removeClass('active');
		$('.slider_cat li:eq(1)').addClass('active');
		/*$('.tab_block').each(function(){
				if(!$(this).hasClass('no-hide'))
					$(this).hide();
		});*/
		$('.tab_block').hide();
		$('.tab_block:eq(1)').show();
	});
	
	$('.slider_cat li:eq(2), .slider_cat li:eq(2) a.main').click(function(){
		$('.slider_cat li').removeClass('active');
		$('.slider_cat li:eq(2)').addClass('active');
	/*$('.tab_block').each(function(){
				if(!$(this).hasClass('no-hide'))
					$(this).hide();
		});*/
		$('.tab_block').hide();
		$('.tab_block:eq(2)').show();
	});
	
	$('.slider_cat li:eq(3), .slider_cat li:eq(3) a.main').click(function(){
		$('.slider_cat li').removeClass('active');
		$('.slider_cat li:eq(3)').addClass('active');
	/*$('.tab_block').each(function(){
				if(!$(this).hasClass('no-hide'))
					$(this).hide();
		});*/
		$('.tab_block').hide();
		$('.tab_block:eq(3)').show();
	});
	
/*CALENDAR
--------------------------------------------------*/
	/*$('.calc').datepicker({
		firstDay: 1
	});*/

/*RESIZE ORG_MENU
--------------------------------------------------*/
	$(window).resize(function(){
		var orw = $('.ord_menu').width;
		if(orw<1000) {
			$('.ord_menu li a').css({'PaddingLeft' : 10});
		};
	});
/*SLIDER SELECTOR
----------------------------------------------------*/
		/*$("#limit").slider({
			range: true,
			min: 0,
			max: 500,
			values: [75, 300],
			slide: function(event, ui) {
				$("#amount").val('' + ui.values[0] + ' ' + ui.values[1]);
			}
		});
		
		
		if($("#amount").length > 0)
			$("#amount").attr("value", '' + $("#limit").slider("values", 0) + ' ' + $("#limit").slider("values", 1));*/
		

});

