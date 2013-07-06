$(document).ready(function(){
	$(".aprof-time2buy").each(function(){
		var slide_width = $(this).find(".aprof-time2buy-carousel li").width();
		var slide_cnt = $(this).find(".aprof-time2buy-carousel li").size();
		var slide = $(this).find(".aprof-time2buy-carousel li");
		var slider_width = $(this).find(".aprof-time2buy-carousel").width();
		var m = parseInt($(slide).css("margin-right"))+parseInt($(slide).css("margin-left"))+parseInt($(slide).css("padding-right"))+parseInt($(slide).css("padding-left"));
		var cnt = parseInt((slider_width+m)/(slide_width+m));
		var el = $(this);
		if(cnt==slide_cnt)
			$(this).find(".aprof-time2buy-larr, .aprof-time2buy-rarr").hide();
		$(this).find(".aprof-time2buy-larr").click(function(){
			if($(this).attr("disabled")=="disabled") return false;
			$(this).attr("disabled","disabled");
			var l = $(this).parents(".aprof-time2buy").find("ul").position().left;
			if(l<0){
				$(el).find(".aprof-time2buy-carousel ul").animate({
					left:"+="+(slide_width+m)+"px"
				},500,function(){
					$(el).find(".aprof-time2buy-larr").removeAttr("disabled");
					$(el).find(".aprof-by2time-rarr").removeAttr("disabled");
				});
			}
			else{
				
				$(el).find(".aprof-time2buy-carousel ul").animate({
					left:"-"+(slide_cnt-cnt)*(slide_width+m)+"px"
				},500,function(){
					$(el).find(".aprof-time2buy-larr").removeAttr("disabled");
					$(el).find(".aprof-time2buy-rarr").removeAttr("disabled");
				});
			}
		});
		$(el).find(".aprof-time2buy-rarr").click(function(){
			if($(this).attr("disabled")=="disabled") return false;
			$(this).attr("disabled","disabled");
			var l = $(el).find("ul").position().left;
			var image_id = parseInt((l*(-1)+slider_width)/slide_width);
			if(image_id<slide_cnt){
				$(el).find(".aprof-time2buy-carousel ul").animate({
					left:"-="+(slide_width+m)+"px"
				},500,function(){
					$(el).find(".aprof-time2buy-larr").removeAttr("disabled");
					$(el).find(".aprof-time2buy-rarr").removeAttr("disabled");
				});
			}
			else{
				$(el).find(".aprof-time2buy-carousel ul").animate({
					left:"0px"
				},500,function(){
					$(el).find(".aprof-time2buy-larr").removeAttr("disabled");
					$(el).find(".aprof-time2buy-rarr").removeAttr("disabled");
				});
			}
		});
	});
});