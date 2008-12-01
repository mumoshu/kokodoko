(function() {  
		
	jQuery.fn.horizontal_menu_with_separators = function(config){

		// 引数のデフォルト値を渡す {}内は、カンマ（,）で区切って複数可能
		config = jQuery.extend({
				value1: "Default value 1",
				value2: "Default value 2"
			},config);

		// プラグイン内のthis は、$("div.target") など指定したHTML要素
		var target = this;
		target.addClass("horizontal_menu_with_separators")
		.find("li:gt(0)").addClass("rest").end()
		.find("li:first").addClass("first");
		
		//append("Hello jQuery Plugin !<br />"
		//+ config.value1 + "<br />"  + config.value2);
	};
})(jQuery);
