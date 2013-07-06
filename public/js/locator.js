/**
* Library for Yenisite's location module
*
* @author Pavel Ivanov
* @Skype: hardyjazz
* @email: pavel@yenisite.ru
*/

var YS = YS || {};

/**
* Create new namespace
*
* @param {String} namespace name
*/
YS.namespace = function(ns_string) {
	var parts = ns_string.split('.'),
		parent = YS,
		i;
		
	if (parts[0] === 'YS') {
		parts = parts.slice(1);
	}
	
	for (i = 0; i < parts.length; i+= 1) {
		if (typeof parent[parts[i]] === "undefined") {
			parent[parts[i]] = {};
		}
		parent = parts[i];
	}
	return parent;
};

YS.namespace('YS.GeoIP.Cookie');
YS.namespace('YS.GeoIP.PopUpWindow');
YS.namespace('YS.GeoIP.AutoComplete');

/**
* Create YS.GeoIP.Cookie object
* 
* @return {Object}
*/
YS.GeoIP.Cookie = (function() {
	/**
	* Set cookie for 365 days
	*
	* @private
	* @param {String} name cookie
	* @param {String} value of cookie
	*/
	__setCookie = function(name, value) {
		var date = new Date();
		
		if (__getCookie(name) !== null) {
			__deleteCookie(name);
		}
		
		date.setDate(365 + date.getDate());
		document.cookie = name + "=" + value + "; path=/; expires="+ date.toGMTString();
	},
	
	/**
	* Set cookie from selects
	*/
	setCookieFromSelects = function() {
		var country,
			region,
			city,
			cId;
			
		cId = $('.ys-loc-choose-country select').val().split('-')[0];
		
		region 		= $('.ys-loc-choose-region select').val();
		city 		= $('.ys-loc-choose-city select').val();
		
		$.ajax({
			url: 'http://' + window.location.host + '/bitrix/components/yenisite/geoip.city/tools.php?cId=' + cId,
			async: false,
			success: function(out)	{
				__setCookie('GeoIP-city', out + '/' + region + '/' + city);
			}
		});
	},
	
	/**
	* Set cookie from click on town
	*
	* @param {String} town name
	*/
	setCookieFromTownClick = function(town) {
		$.ajax({
			url: 'http://' + window.location.host + '/bitrix/components/yenisite/geoip.city/tools.php?townName=' + town,
			async: false,
			success: function(out)	{
				var tmp = out.split('/');
				
				if (tmp.length != 2) {
					__setCookie('GeoIP-city', out + '/empty/' + town);
				} else {
					__setCookie('GeoIP-city', out + '/' + town);
				}
			}
		});
	},
	
	/**
	* Set cookie from drop down list
	*
	* @param {String} loction (country name/{region name | empty}/city name)
	*/
	setCookieFromDropDown = function(location) {
		var locElems = location.split(', ');
		
		if (locElems.length == 2) {
			__setCookie('GeoIP-city', locElems[1] + '/empty/' + locElems[0]);
		} else {
			__setCookie('GeoIP-city', locElems[2] + '/' + locElems[1] + '/' + locElems[0]);
		}
	},
	
	/**
	* Set cookie from button click
	*
	* @param {String} loction (country name/{region name | empty}/city name)
	*/
	setCookieFromButtonClick = function() {
		var town = $('.ys-your-city span').eq(1).text();
		
		setCookieFromTownClick(town);
	},
	
	/**
	* Get cookie by name
	* 
	* @private
	* @param {String} cookie name
	*/
	__getCookie = function(name) {
		var cookie = " " + document.cookie,
			search = " " + name + "=",
			setStr = null,
			offset = 0,
			end = 0;
			
		if (cookie.length > 0) {
			offset = cookie.indexOf(search);
			
			if (offset != -1) {
				offset += search.length;
				end = cookie.indexOf(";", offset);
				
				if (end == -1) {
					end = cookie.length;
				}
				setStr = unescape(cookie.substring(offset, end));
			}
		}
		return setStr;
	},
	
	/**
	* Get town from cookie
	*
	* @param {String} cookie name
	*/
	getCookieTown = function(name) {
		var cookie = __getCookie(name);
		
		if (cookie !== null) {

			if (cookie.indexOf('/') == -1) {
				return cookie;
			} else {
				return cookie.split('/')[2];
			}
		}
		
		return null;
	},
	
	/**
	* Get town id from cookie
	*
	* @param {String} cookie name
	*/
	getCookieTownId = function(name) {
		var cookie = __getCookie(name),
			id;
		
		if (cookie !== null) {
			$.ajax({
				url: 'http://' + window.location.host +
					'/bitrix/components/yenisite/geoip.city/tools.php?town=' + cookie.split('/')[2],
				async: false,
				success: function(out)	{
					id = out;
				}
			});
			
			return id;
		}
	},
	
	/**
	* Get country id from cookie
	*
	* @param {String} cookie name
	*/
	getCookieCountryId = function(name) {
		var cookie = __getCookie(name),
			id;
		
		if (cookie !== null) {
			$.ajax({
				url: 'http://' + window.location.host +
					'/bitrix/components/yenisite/geoip.city/tools.php?country=' + cookie.split('/')[0],
				async: false,
				success: function(out)	{
					id = out;
				}
			});
			
			return id;
		}
	},
	
	/**
	* Get region id from cookie
	*
	* @param {String} cookie name
	*/
	getRegionId = function(cookieName) {
		var cookie = __getCookie(cookieName),
			id;
			
		if (cookie !== null && cookie.split('/')[1] != 'empty') {
			$.ajax({
				url: 'http://' + window.location.host +
					'/bitrix/components/yenisite/geoip.city/tools.php?regionName=' + cookie.split('/')[1],
				async: false,
				success: function(out)	{
					id = out;
				}
			});
		} else {
			id ='';
		}
		return id;
	}
	
	/**
	* Delete cookie from name
	*
	* @private
	* @param {String} cookie name
	*/
	__deleteCookie = function(cookieName) {
		var cookieDate = new Date();  
		cookieDate.setTime (cookieDate.getTime() - 1);
		document.cookie = cookieName += "=; expires=" + cookieDate.toGMTString();
	},
	
	/**
	* Get region from cookie
	*
	* @param {String} cookie name
	*/
	getRegionCookie = function(cookieName) {
		var cookie = __getCookie(cookieName);
		
		if (cookie !== null) {

			return cookie.split('/')[1] != 'empty' ? cookie.split('/')[1] : '';
		}
		
		return null;
	},
	
	/**
	* Get country from cookie
	*
	* @param {String} cookie name
	*/
	getCountryCookie = function(cookieName) {
		var cookie = __getCookie(cookieName);
		
		if (cookie !== null) {

			return cookie.split('/')[0];
		}
		
		return null;
	};
	
	return {
		setCookieFromSelects: 		setCookieFromSelects,
		setCookieFromTownClick: 	setCookieFromTownClick,
		setCookieFromDropDown:		setCookieFromDropDown,
		setCookieFromButtonClick: 	setCookieFromButtonClick,
		
		getCookieTown: 				getCookieTown,
		getCookieTownId:			getCookieTownId,
		
		getCountryCookie:			getCountryCookie,
		getCookieCountryId:			getCookieCountryId,
		
		getRegionCookie:			getRegionCookie,
		getRegionId:				getRegionId
		
	};
}());

/**
* Create YS.GeoIP.PopUpWindow object
* 
* @return {Object}
*/
YS.GeoIP.PopUpWindow = (function() {
	var yscookie = YS.GeoIP.Cookie;
	
	/**
	* Rebuild cities on popup window
	* 
	* @private
	*/
	__rebuildCities = function() {
		var town = yscookie.getCookieTown('GeoIP-city'),
			cities = [],
			i = 1;
			
		$('.ys-loc-cities li a span').each(function() {
			cities.push($(this).text());
		});
		
		
		
		if ($('.ys-your-city').length == 0) {
			cities.push( $('.ys-loc-cities .ys-loc-first span').eq(1).text() );
		} else {
			cities.push( $('.ys-your-city span').eq(1).text() );
		}
		
		if (town !== null) {
			cities.unshift(town);
			
			cities = _.uniq(cities);
			
			if ($('.ys-your-city').length == 0) {
				$('.ys-loc-cities li a span').slice(1).each(function() {
					$(this).text(cities[i]);
					i++;
				});
			} else {
				$('.ys-loc-cities li a span').each(function() {
					$(this).text(cities[i]);
					i++;
				});
			}
			
			if ($('.ys-your-city').length == 0) {
				$('.ys-loc-first li').eq(0).addClass('ys-your-city');
				$('.ys-your-city').empty();
				$('.ys-your-city').append('<span class="sym">. </span><span></span>');
				$('.ys-your-city span').eq(1).text(town);
			} else {
				$('.ys-loc-cities .ys-loc-first span').eq(1).text(town);
				$('.ys-loc-cities li').eq(0).addClass('ys-your-city');
			}
		}
	},
	
	/**
	* Show popup window
	*/
	showPopUpGeoIP = function() {
		var town = yscookie.getCookieTown('GeoIP-city');
		
		if (town !== null) {
			$('.ys-city-header').text(town);
		}
		
		__rebuildCities();
		
		$('#ys-locator').css('display', 'block');
		$('#mask').css('display', 'block');
	},
	
	/**
	* Hide popup window
	*/
	hidePopUpGeoIP = function() {
		$('#ys-locator').css('display', 'none');
		$('#mask').css('display', 'none');
		$('.ys-loc-autocomplete').css('display', 'none');
		$('#ys-locator input.txt').val('');
	};
	
	return {
		showPopUpGeoIP: showPopUpGeoIP,
		hidePopUpGeoIP: hidePopUpGeoIP
	};
}());

/**
* Create YS.GeoIP.AutoComplete object
* 
* @return {Object}
*/
YS.GeoIP.AutoComplete = (function() {
	var yscookie = YS.GeoIP.Cookie,
		yspopup = YS.GeoIP.PopUpWindow;
	
	/**
	* Build AJAX location list
	*
	* @param {String} first characters of city
	*/
	buidList = function(query) {
		$.ajax({
			url: 'http://' + window.location.host + '/bitrix/components/yenisite/geoip.city/tools.php?query=' + encodeURI(query),
			success: function(out) {
				if (out.length > 0) {
					$('.ys-loc-autocomplete').empty().append(out).css('display', 'block');
						
					// set handlers for location information
					$('.ys-loc-autocomplete div').each(function() {
						
						$(this).hover(function() {
							$(this).addClass('ys-loc-autoc-selected');
						}, function() {
							$(this).removeClass('ys-loc-autoc-selected');
						});
							
						$(this).on('click', function() {
							yscookie.setCookieFromDropDown( $(this).text() );
							yspopup.hidePopUpGeoIP();
							
							$('a.ys-loc-city').text(yscookie.getCookieTown('GeoIP-city'));
							$('a.ys-loc-city').css('display', 'inline');
						});
					});
				}
			}
		});
	};

	return {
		buildList: buidList
	};
}());