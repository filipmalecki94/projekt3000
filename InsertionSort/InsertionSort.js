var collection = {count:0},
	i = 0,
	j = 0;

$('.bar-block').each(function(index,$div) {
	collection.count++;
	collection[index] = {
		div:$div,
		val:parseInt($(this).attr('id')),
		index: $('#'+index+'.index')
	};
});

$(".next").click(function() {
	var that = this;

	$(collection[i].index).find('.i').show();
	$(collection[j].index).find('.j').show();

	$(this).attr('disabled',true);
    
	if(collection[j].val > collection[j+1].val){			
		var promise = new Promise(function(resolve){
			$(collection[j].div).swap({  
	        	target: collection[j+1].div,  
	            opacity: "0.5",
	            speed: 1000,
	            callback: function(){resolve();}
	        });  
		});
		var temp = collection[j];
		collection[j] = collection[j+1];
		collection[j+1] = temp;
	}
	if(j < collection.count - i - 2){
		$(collection[j].index).find('.j').hide();	
		$(collection[++j].index).find('.j').show();	
	} else {
		i++;
		j=0;
	}

	if(typeof promise !== 'undefined'){
		promise.then(function(){
			$(that).removeAttr('disabled');
		});
	}
});

