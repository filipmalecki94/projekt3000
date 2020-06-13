var init = {},n=0,k=0
	counter = {},
	sorted = {},
	stepDone = 0;

$('.bar-block').each(function(index,$div) {
	n++;
	init[index] = {
		div:$($div),
		val:parseInt($(this).attr('id')),
	};
	if(init[index].val > k){
		k = init[index].val;
	}
	sorted[index] = {div:'',val:0}
});


$('.counter-block').each(function(index,$div) {
	counter[index] = {
		div:$($div),
		count:0
	};
});

$(".next").click(function() {
	var i = 0;
	if(stepDone === 0){
		var interval = setInterval(function(){
		    counter[i].div.animate({
				    opacity: 1
				  }, 1000);
		    i++;
		    if(i > n) {
		        clearInterval(interval);
		    }
		}, 500);
    	stepDone = 1;
    	return;
	}
	if(stepDone === 1){
		var interval = setInterval(function(){
		    init[i].div.animate({
				    opacity: 0,
				  }, 1000,function(){
				  	counter[init[i].val].div.find('.counter-box').text(++counter[init[i].val].count);
				  	i++;
				    if(i >= n) {
				        clearInterval(interval);
				    }
				  });
		}, 1500);
    	stepDone = 2;
    	return;
	}
	if(stepDone === 2){
		i = 1
		var interval = setInterval(function(){
		    counter[i].count += counter[i-1].count;
		    counter[i].div.find('.counter-box').text(counter[i].count)
		    i++;
		    if(i > k){
		    	clearInterval(interval)
		    }
		}, 1000);
    	stepDone = 3;
    	return;
	}
	if(stepDone === 3){
		$('.graph').empty();
		for(i=1;i<=n;i++){
			$('.graph').append('<div id="'+i+'" class="slot"></div>')
		}
		for(i = n-1; i >= 0; i--){
			var e = --counter[init[i].val].count;
			sorted[e].val = init[i].val;
			sorted[e].div = init[i].div;
		}
		stepDone = 4;
		return;
	}
	if(stepDone === 4){
		i = 1
		var interval = setInterval(function(){
		    $('.graph #'+i+'.slot').replaceWith(sorted[i-1].div)
		    sorted[i-1].div.animate({
				    opacity: 1
				  }, 1,function(){i++;});
		    if(i >= n){
		    	clearInterval(interval)
		    }
		}, 1000);
    	stepDone = 5;
    	return;
	}
});

