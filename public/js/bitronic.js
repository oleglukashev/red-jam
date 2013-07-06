$(document).ready(function() {
	var ysLocCookie = YS.GeoIP.Cookie,
		ysLocPopUp  = YS.GeoIP.PopUpWindow,
		ysLocAutoC	= YS.GeoIP.AutoComplete,
		town = ysLocCookie.getCookieTown('GeoIP-city'),
		region = getRegionCookie('GeoIP-city'),
		regionId = getRegionId('GeoIP-city'),
		country = getCountryCookie('GeoIP-city'),
		countryId = getCookieCountryId('GeoIP-city'),
		siteId = $('#ys-SITE_ID').val(),
		townId,
		dataLoc,
		tmpVal;
	
	if (town === null) {
		ysLocPopUp.showPopUpGeoIP();

	} else { // if (town === null)
		$('a.ys-loc-city').text(town);
		$('a.ys-loc-city').css('display', 'inline');
		
		// ====================== Шаблон visual / .default ======================
		
		// Шаблон местоположения - По умолчанию
		if ( $('#LOCATION_ORDER_PROP_5').length != 0 ) {
		
			$('select[name="COUNTRY"]').selectBox('destroy');
			$('select[name="COUNTRY_ORDER_PROP_5"]').selectBox('destroy');
			$('select[name="ORDER_PROP_5"]').selectBox('destroy');
			$('select[name="ORDER_PROP_5_COUNTRY"]').selectBox('destroy');
			
			$('#LOCATION_ORDER_PROP_5').empty();
			
			dataLoc = { 'COUNTRY_INPUT_NAME' : 'COUNTRY',
						'REGION_INPUT_NAME' : 'REGION',
						'CITY_INPUT_NAME' : 'ORDER_PROP_5',
						'CITY_OUT_LOCATION' : 'Y',
						'ALLOW_EMPTY_CITY' : 'Y',
						'ONCITYCHANGE' : '',
						'COUNTRY' : countryId,
						'REGION' : regionId,
						'SITE_ID': siteId };

			if ( $('[id^=ID_PAY_SYSTEM_ID]').length != 0 ) {
				dataLoc['ONCITYCHANGE'] = 'submitForm()';
			}
			
			$.ajax({
				type: 'POST',
				url: 'http://' + window.location.host +
					'/bitrix/components/bitrix/sale.ajax.locations/templates/.default/ajax.php',
				data: dataLoc,
				async: false,
				success: function(out) {
					var tmp = out.split('name="ORDER_PROP_5"'),
						reg = new RegExp('option value="([0-9]+)">' + town),
						townId = reg.exec(tmp[1])[1],
						tmp = out.split(townId + '"');

					$('#LOCATION_ORDER_PROP_5').prepend(out);
				
					$('select[name="ORDER_PROP_5"]').val(townId).change();
					$('#ORDER_PROP_6').val(town);
				}
			});
			
			$('input[name="ORDER_PROP_6"]').val(town);
			
			$('#PERSON_TYPE_2').live('click', function() {
				var intervalTimer = setInterval(function() {
					if ( $('#LOCATION_ORDER_PROP_18').length != 0 ) {
						$('#LOCATION_ORDER_PROP_18').empty();
				
						$.ajax({
							type: 'POST',
							url: 'http://' + window.location.host +
								'/bitrix/components/bitrix/sale.ajax.locations/templates/.default/ajax.php',
							data: { 'COUNTRY_INPUT_NAME' : 'COUNTRY',
									'REGION_INPUT_NAME' : 'REGION',
									'CITY_INPUT_NAME' : 'ORDER_PROP_18',
									'CITY_OUT_LOCATION' : 'Y',
									'ALLOW_EMPTY_CITY' : 'Y',
									'ONCITYCHANGE' : 'submitForm()',
									'COUNTRY' : countryId,
									'REGION' : regionId,
									'SITE_ID': siteId },
							async: false,
							success: function(out) {
								
								var tmp = out.split('name="ORDER_PROP_18"'),
									reg = new RegExp('option value="([0-9]+)">' + town),
									townId = reg.exec(tmp[1])[1],
									tmp = out.split(townId + '"');

								$('#LOCATION_ORDER_PROP_18').prepend(out);
								
								$('[name="ORDER_PROP_18"]').val(townId).change();
								$('#ORDER_PROP_17').val(town);
								
								clearInterval(intervalTimer);
							}
						});
					}
				}, 1000);
			});
			
			$('#PERSON_TYPE_1').live('click', function() {
				var intervalTimer = setInterval(function() {
					if ( $('#LOCATION_ORDER_PROP_5').length != 0 ) {
						$('#LOCATION_ORDER_PROP_5').empty();
				
						$.ajax({
							type: 'POST',
							url: 'http://' + window.location.host +
								'/bitrix/components/bitrix/sale.ajax.locations/templates/.default/ajax.php',
							data: { 'COUNTRY_INPUT_NAME' : 'COUNTRY',
									'REGION_INPUT_NAME' : 'REGION',
									'CITY_INPUT_NAME' : 'ORDER_PROP_5',
									'CITY_OUT_LOCATION' : 'Y',
									'ALLOW_EMPTY_CITY' : 'Y',
									'ONCITYCHANGE' : 'submitForm()',
									'COUNTRY' : countryId,
									'REGION' : regionId,
									'SITE_ID': siteId },
							async: false,
							success: function(out) {
								console.log(out);
								
								var tmp = out.split('name="ORDER_PROP_5"'),
									reg = new RegExp('option value="([0-9]+)">' + town),
									townId = reg.exec(tmp[1])[1],
									tmp = out.split(townId + '"');

								$('#LOCATION_ORDER_PROP_5').prepend(out);
								
								$('[name="ORDER_PROP_5"]').val(townId).change();
								$('#ORDER_PROP_6').val(town);
								
								clearInterval(intervalTimer);
							}
						});
					}
				}, 1000);
			});
			
			$('select[name="COUNTRY"]').selectBox();
			$('select[name="COUNTRY_ORDER_PROP_5"]').selectBox();
			$('select[name="ORDER_PROP_5"]').selectBox();
			$('select[name="ORDER_PROP_5_COUNTRY"]').selectBox();
			
		} else if( $('#ORDER_PROP_5_val').length != 0 ) { // if ( $('#LOCATION_ORDER_PROP_5').length != 0 )
			
			// Шаблон местоположения - Строка поиска
			$('#ORDER_PROP_5_val').val(town + ', ' + region + ', ' + country);
			if (region != '') {
				$('#ORDER_PROP_5_val').attr('value', town + ', ' + region + ', ' + country);
			} else {
				$('#ORDER_PROP_5_val').attr('value', town + ', ' + country);
			}
				
			$.ajax({
				url: 'http://' + window.location.host +
					'/bitrix/components/bitrix/sale.ajax.locations/search.php?search=' + town + '&params=',
				async: false,
				success: function(out) {
					var tmp = out.split('NAME'),
						townId = tmp[0].split("'")[3];
					
					$('#ORDER_PROP_5').val(townId);
				}
			});
			$('#ORDER_PROP_6').val(town);
		} else {
			// Редактирование профиля покупателя ( упрощенный режим )
			$('select[name="ORDER_PROP_5"]').selectBox('destroy');
			
			$('select[name="ORDER_PROP_5"] option').each(function() {
				if ( $(this).text() == country + ' - ' + town  ) {
					tmpVal = $(this).val();
				}
				
				if ($(this).attr('selected') == 'selected') {
					$(this).removeAttr('selected');
				}
				
				$('select[name="ORDER_PROP_5"]').val(tmpVal);
			});
			
			$('input[name="ORDER_PROP_6"]').val(town);
		}
	}
	
	// ------------ click handlers -------------
	$('.ys-loc-cities a').on('click', function() {
		ysLocCookie.setCookieFromTownClick($(this).text());
		
		ysLocPopUp.hidePopUpGeoIP();
		
		$('a.ys-loc-city').text(ysLocCookie.getCookieTown('GeoIP-city'));
		$('a.ys-loc-city').css('display', 'inline');
	});
	
	$('a.ys-loc-city').on('click', function() {
		ysLocPopUp.showPopUpGeoIP();
	});
	
	$('.ys-my-city .button').on('click', function() {
		ysLocCookie.setCookieFromButtonClick();
		ysLocPopUp.hidePopUpGeoIP();
		
		$('a.ys-loc-city').text(ysLocCookie.getCookieTown('GeoIP-city'));
		$('a.ys-loc-city').css('display', 'inline');
	});
	// ------------- end click handlers ---------------
	
	$('.popup .txt').on('textchange', function() {
		if ($(this).val().length > 1)
		{
			ysLocAutoC.buildList( $(this).val() );
			
		} else if($(this).val().length <= 1) {
			$('.ys-loc-autocomplete').css('display', 'none');
		}
	});
});