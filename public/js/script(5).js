/*---------------------------------------------------
Number of links in a section
param - ul or li
---------------------------------------------------*/
function num_in_razd(a) {
	return a.find('li').size(); // + 1
}

/*---------------------------------------------------
If li is section
param - li
---------------------------------------------------*/
function ifRazd(li) {
	if (li.children('ul').length != 0) {
		return true;
	}

	return false;
}

/*----------------------------------------------------------
Build the map of <ul>
param 	- ul
result	- array: [0, 1, 2, 1, ...]
	If 0 - first level of ul, 1 - second level of ul, etc.
----------------------------------------------------------*/
function mapOfUl(ul) {
	var map = [];
	var k = 0;
	ul.find('li').each(function() {
		k = $(this).parentsUntil('.subnav').length;
		switch(k) {
			case 1:
				map.push(0);
			break;
			
			case 3:
				map.push(1);
			break;
			
			case 5:
				map.push(2);
			break;
			
			case 7:
				map.push(3);
			break;
			
			case 9:
				map.push(4);
			break;
			
			case 11:
				map.push(5);
			break;
		}
	});
	return map;
}

/*-------------------------------------------------------------------------------
How many elements "num" are consecutive beggining with number "k" in array "map"
-------------------------------------------------------------------------------*/
function dop(map, k, num) {
	var kol = 0;
	for(var i = k; i < map.length; i++) {
		if (map[i] == num) {
			kol++;
		} else {
			break;
		}
	}
	
	return kol;
}

/*---------------------------------------------------
For example:
input: 	[1, 1, 2, 3, 3]
output:	[0, 1, 2, 2, 3, 4]
---------------------------------------------------*/
function indices(map) {
	var k = 0;
	var arr = [];
	
	for(var i = 0; i < map.length; i++) {
		if (map[i] != 0) {
			arr.push(i);
			k = dop(map, i, map[i]);
			arr.push(i+k-1);
			i += k-1;
			continue;
		}
	}
	
	return arr;
}

/*---------------------------------------------------
	Calculate number of columns, hS_new
	
	flag: 	1 - if .subnav contains section
			0 - if not contains
---------------------------------------------------*/
function calculate(subnav, flag, sIndex) {
	if (flag) {
		num_columns_old = num_columns[sIndex];
		num_columns[sIndex] = Math.ceil(h / hX);
		hS_new = hX;
		
		if (num_columns[sIndex] > 1) upd[sIndex] = 1;

		if ( subnav.offset().left < 0 || num_columns[sIndex] > colX || ( $(window).width() - liOffset - subnav.width() ) < -10 ) {
			num_columns_old = num_columns[sIndex];
			num_columns[sIndex] = Math.ceil(h / hY);
			hS_new = hY;
			
			if ( subnav.offset().left < 0 || num_columns[sIndex] > colY || ( $(window).width() - liOffset - subnav.width() ) < -10 ) {
				num_columns_old = num_columns[sIndex];
				num_columns[sIndex] = Math.ceil(h / hZ);
				hS_new = hZ;
			}
		}

		if (num_columns_old != num_columns[sIndex]) {
			upd[sIndex] = 1;
		}
		
	} else {
		num_li_in_column = Math.floor(hX / h_li);
		num_columns_old = num_columns[sIndex];
		num_columns[sIndex] = Math.ceil(kol / num_li_in_column);
		
		if (num_columns[sIndex] > 1) upd[sIndex] = 1;

		if ( subnav.offset().left < 0 || num_columns[sIndex] > colX || ( $(window).width() - liOffset - subnav.width() ) < -10 ) {
			num_columns_old = num_columns[sIndex];
			num_columns[sIndex] = Math.ceil(h / hY);
			num_li_in_column = Math.floor(hY / h_li);
		
			if (num_li_in_column * num_columns[sIndex] < kol) {
				num_columns_old = num_columns[sIndex];
				num_columns[sIndex] = Math.ceil(kol / num_li_in_column);
			}

			if (subnav.offset().left < 0 || num_columns[sIndex] > colY || ( $(window).width() - liOffset - $(this).width() ) < -10 ) {
				num_columns_old = num_columns[sIndex];
				num_columns[sIndex] = Math.ceil(h / hZ);
				num_li_in_column = Math.floor(hZ / h_li);

				if (num_li_in_column * num_columns[sIndex] < kol) {
					num_columns_old = num_columns[sIndex];
					num_columns[sIndex] = Math.ceil(kol / num_li_in_column);
				}
			}
		}
		
		if (num_columns_old != num_columns[sIndex]) {
			upd[sIndex] = 1;
		}
		
		if (num_columns[sIndex] == 1) {
			upd[sIndex] = 0;
		}
	}
}

/*---------------------------------------------------
	Build .subnav
	
	flag: 	1 - if .subnav contains section
			0 - if not contains
	
	sIndex:	current .subnav index
---------------------------------------------------*/
function build(subnav, flag, sIndex) {

	if (upd[sIndex] == 1 && ifResize) {
		subnav.children('ul').remove();
		subnav.html(snav[sIndex]);
		subnav.children('li').wrapAll('<ul></ul>');
	}

	if (h > hX && upd[sIndex]) {
		if (subnav.children('ul').length == 1) {

			for(var i = 0; i < num_columns[sIndex]-1; i++) {
				subnav.children('ul:last').after("<ul></ul>");
			}
			subnav.find('ul.ul_last').removeClass();
			subnav.find('ul:last').addClass('ul_last');
			subnav.find('ul:first').attr('style', '');

			if (flag) {
				var nums = [];
				var k = 0;
				var number = 0;
				var perenos = [];
				var ost = 0;	// How many remain
				var flagP = 0;	// Overflow of column
				var fl = 0;
				var kolLiInRazd = 0; // How many <li> in section in one <ul>
		
				for(var i = 0; i < num_columns[sIndex]-1; i++) {
					var hh = 0;
					var per = 0;
					while(hh < hS_new) {
						var n = 0;
						if (ost > 0 && !flagP) {
							hh += h_li_in_razd * ost;
							k += ost;
							ost = 0;
						}

						if (flagP) {
							k += kolLiInRazd;
							per = ost - kolLiInRazd;
							ost -= kolLiInRazd;
							flagP = 0;
							number++;
							break;
						}
						var li_i = subnav.find('ul:first').children('li').eq(number); // go from menu items

						if ( ifRazd(li_i) ) {
							hh += h_li;
							n = Math.ceil( (hS_new - hh) / h_li_in_razd ); // How much more fit

							per = num_in_razd(li_i) - n;

							ost = per;

							if( n > num_in_razd(li_i) ) {
								n = num_in_razd(li_i);

								hh += n*h_li_in_razd;
								number++;
								k += n+1;

								continue;
							}

							if ( per*h_li_in_razd > hS_new ) {
								flagP = 1;
								kolLiInRazd = Math.ceil( hS_new / h_li_in_razd );
								per = kolLiInRazd;
								hh += n*h_li_in_razd;
								k += (n+1);
								fl = 1;

								break;
							}

							hh += n*h_li_in_razd;
							k += n+1;
							number++;

							if ( hh < hS_new ) {
								continue;
							}

							break;
						} else {
							hh += h_li;
						}
						
						number++;
						k++;
					} // while(hh < hS_new)
					nums.push(k);

					if (per < 0) {
						perenos.push(0);
					} else {
						perenos.push(per);
					}
				} // for(var i = 0; i < num_columns-1; i++)

				var map = mapOfUl( subnav.find('ul:first') );

				var dop_li;
				for(var i = num_columns[sIndex]-1; i > 0 ; i--) {
					dop_li = subnav.find('ul:first').find('li').slice(nums[i-1]);
					subnav.children('ul').eq(i).html(dop_li);
				}
		
				var ck = 0;
				var kl = 0;
				var mapUl = [];
				for(var i = 0; i < num_columns[sIndex]; i++) {
					kl = subnav.children('ul').eq(i).find('li').length;
		
					if ( i == 0 ) {
						mapUl[i] = map.slice(0, kl);
					} else {
						mapUl[i] = map.slice(ck, ck+kl);
					}
					ck += kl;
				}
		
				var ind = [];
				var sum; // Total number of add <ul> in one column
				for(var i = 0; i < num_columns[sIndex]; i++) {
					ind  = indices(mapUl[i]);
					sum = 0;
					var len = ind.length / 2;
					for(var j = 0; j < len; j++) {
						for(var k = 0; k < mapUl[i][ind[j*2]]; k++) {
							if (i) {
								subnav.children('ul').eq(i).find('li').slice(
									ind[j*2] + sum,
									ind[j*2+1] + sum + 1).wrapAll('<li><ul></ul></li>');
								sum++;
							}
						}
					}
				}

				if (subnav.find('ul:last').children('li').length == 0) {
					subnav.children('ul').slice(-2).addClass('ul_last');
					subnav.find('ul:last').slice(-1).remove();
				}

				upd[sIndex] = 0;
			} // flag
			else {
				var dop_li;
				for(var i = num_columns[sIndex]-1, k = 0; i > 0 ; i--, k++) {
					dop_li = subnav.find('ul:first').children('li').slice(num_li_in_column*i);
					subnav.children('ul').eq(i).html(dop_li);
				}
				
				upd[sIndex] = 0;
			}
		} // subnav.children('ul').length == 1
	} // h > hX && upd
	
	ifResize = 0;
}

//--------------------------------------------------------------------------
var num_columns = [];			// number of columns
var hX = 400;
var hY = 550;
var hZ = 850;
var colX = 3;
var colY = 4;
//var colZ = 5;

var hS_new = 0;

var upd = []; 		// whether to rebuild
var ifResize  = 0;	// Happend resize window is true
var ifCount  = 1;	// Whether to recalculate parameters of menu

var kol;				// total number of <li> in .subnav
var h;					// height of .subnav
var h_li_in_razd = 18;		// height of <li> in section
var h_li = 26;				// height of <li> without section
var num_li_in_column;	// total number of <li> in column
var num_columns_old;	// previous value of num_columns
var num_li_razd = 0;	// total number of <li> in section

var subnav_h = [];		// heigth of .subnav
var snav = [];			// <ul> in .subnav

var liOffset = 0;
//--------------------------------------------------------------------------

$(document).ready(function() {
    /*NAVIGATOR RESIZE
    ----------------------------------------------------------------------*/
		//$(this).find('.subnav').find('ul:last').addClass('ul_last');
        var navig = $("ul#navigator li").not("li li").size();
        var w_box = $('ul#navigator').width() - 20;
        $("div.subnav > ul > li").css('min-width', w_box / navig);
        $(window).resize(function() {
            var navig = $("ul#navigator li").not("li li").size();
            var w_box = $('ul#navigator').width() - 20;
            $("div.subnav > ul > li").css('min-width', w_box / navig);
			ifResize  = 1;
        });
		
	/*NAV HOVER
    ----------------------------------------------------------------------*/
		
		$('#navigator').children('li').each(function() {
			$(this).addClass('hover');
			subnav_h.push( $(this).children('.subnav').height() );
			$(this).removeClass('hover');
		});
		
		$('#navigator').children('li').each(function() {
			snav.push( $(this).children('.subnav').children('ul:first').html() );
		});
		
		$('nav li').hover(function() {
	        $(this).addClass('hover').prev('li').addClass('clean');
	        
	        var li = $(this);
		
			$(this).find('.subnav').each(function() {
				
				//console.log( $(this).find('.active') );
				
				//$(this).find('a').addClass('h');

				var subnavIndex = $(this).parent().prevUntil('#navigator').length; // current subnav
				liOffset = $('#navigator').children('li').eq(subnavIndex).offset().left; // offset of parent <li>
			
				$(this).children('ul:last').addClass('ul_last');
			
				kol = $(this).children('ul').children('li').length;
				h   = subnav_h[subnavIndex];
				var f = 0;	// flag if there is section
				
				$(this).children('ul').children('li').each(function() {
					if ( num_in_razd( $(this) ) > 0) {
						f = 1;
						//h_li_in_razd = $(this).find('li:first').height();
						num_li_razd += num_in_razd( $(this) );
					}
				});

				var tmp = $(this).find('li');
				for(var i = 0; i < tmp.length; i++) {
					if ( tmp.eq(i).parentsUntil('.subnav').length == 1 && !ifRazd(tmp.eq(i)) ) {
						//h_li = tmp.eq(i).height(); console.log(h_li);
						break;
					}
				}
				
				calculate( $(this), f, subnavIndex );
				build( $(this), f, subnavIndex );
				
				//$(this).children('ul').eq(0).find('li').eq(6).children('ul').eq(0).css('margin-top', '2px');

				var wdt = 0; 	// width of .subnav
				var cnt1 = 0; 	// num of columns
				$(this).find('ul').each(function() {
                    if($(this).parent().attr('class') == 'subnav') {
						wdt = parseInt(wdt) + parseInt($(this).width() ) + parseInt(61);
					    cnt1++;
                    }
				});
				if(cnt1 == 1) {					
					$(this).find('ul:first-child').css('border', 'none');
				}
				$(this).css('width', wdt +'px');

				$(this).offset({left: li.offset().left - 10});

				if( wdt - 10 > $('nav').width() - li.offset().left ) {
				
					lw =  li.offset().left + li.width();
					
					$(this).offset({left: lw - $(this).width() + 10});
				}
				
				if ( $(this).offset().left < 0 ) {
					$(this).offset({left: li.offset().left - 10});
				}
			});
			
			$(this).find('.subnav').find('ul:last').css('border', 'none');

        }, function() {
	        $(this).removeClass('hover').prev('li').removeClass('clean');
        });
    /*NAV COLUMN
    ----------------------------------------------------------------------*/
	    $('.subnav ul:last').addClass('last');
    
		/* $("nav a.item-selected").attr("href", "javascript:void(0);");
        $("nav a.item-selected").css("font-weight", "bold");
        $("nav a.item-selected").css("color", "#333");
        $("nav a.item-selected").css("border-bottom", "none");
        $("nav a.item-selected").css("cursor", "default");
        $("nav li.active").prev().attr("class", "clean");
        $("nav li.active a").hover(function(){}, function(){ $("nav li.active").prev().style("background", "none", "important");}); */
});
document.createElement("nav");