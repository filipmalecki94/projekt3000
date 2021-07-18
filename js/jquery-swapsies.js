var swapping = false;

(function($) {
    $.fn.extend({
        swap: function(opt) {
			var defaults = {
					target: "",
					speed: 1000,
					opacity: "1",
					callback: function() {}
				},
				options = $.extend(defaults, opt);

			return this.each(function() {
				var obj = $(this),
					tempOrder = obj.css('order');

				if (options.target !== "" && !swapping) {
					swapping = true;
					setTimeout(function (){
						obj.css('order',options.target.css('order'));
						options.target.css('order',tempOrder);
						swapping = false;
						options.callback.call(this);
					},options.speed);
				}
			});
        }
    });
})(jQuery);