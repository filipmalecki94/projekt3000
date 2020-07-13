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

			changeCodeHighlightArr([6,7])
		var interval = setInterval(function(){
		    counter[i].div.animate({
				    opacity: 1
				  }, 1,function(){
				   i++;
				   if(i > k) {
		        clearInterval(interval);
		    }
		});
		   
		    
		}, 500);
    	stepDone = 1;
    	return;
	}
	if(stepDone === 1){
			changeCodeHighlightArr([9,10])
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
			counter[0].div.find('.counter-box').addClass('bg-success text-white')
		i = 1
			changeCodeHighlightArr([12,13])
		var interval = setInterval(function(){
			counter[i].div.find('.counter-box').addClass('bg-success text-white')
		    counter[i].count += counter[i-1].count;
		    counter[i].div.find('.counter-box').text(counter[i].count)
		    i++;
		    if(i > k){
		    	$('.bg-success .text-white').removeClass('bg-success text-white')
				$('.graph').empty();
				for(i=1;i<=n;i++){
					$('.graph').append('<div id="'+i+'" class="slot border border-primary">'+i+'</div>')
				}
		    	clearInterval(interval)
		    }
		}, 1000);
    	stepDone = 3;
    	return;
	}
	if(stepDone === 3){
			changeCodeHighlightArr([15,16])
		i = n-1;
		var interval = setInterval(function(){
			var e = --counter[init[i].val].count;
			counter[init[i].val].div.find('.counter-box').addClass('border border-danger')
			counter[init[i].val].div.find('.counter-box').text(e)
			sorted[e].val = init[i].val;
			sorted[e].div = init[i].div;
			$('.graph #'+(e+1)+'.slot').replaceWith(sorted[e].div);
			sorted[e].div.animate({
				    opacity: 1
				  }, 1000,function(){i--;
		    	$('.border.border-danger').removeClass('border border-danger')});
			if(i === 0){
		    	clearInterval(interval)
		    }
		},2000);
		stepDone = 4;
		return;
	}
});


function changeCodeHighlightArr(ids,time) {
	setTimeout(function(){
		$('.code .highlight').removeClass('highlight');
		$.each(ids, function( index, value ) {
  			$('.step.'+value).addClass('highlight');
});
	},time);
}

function changeCodeHighlight(id,time) {
	setTimeout(function(){
		$('.code .highlight').removeClass('highlight');
		$('.step.'+id).addClass('highlight');
	},time);
}