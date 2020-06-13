var collection = {count:0},
	i = 1,
	key,
	j;

$('.bar-block:not(#empty)').each(function(index,$div) {
	collection.count++;
	collection[index] = {
		div:$($div),
		val:parseInt($(this).attr('id')),
	};
});

$(".next").click(function() {
	key = copyObj(collection[i]);
	$(key.div).swap({  
        target: $('#empty'),  
        opacity: "0.5",
        speed: 1000,
        callback:function(){
		j = i - 1;
			loop(j).then((res) => {
				collection[res+1] = key;
				$(collection[res+1].div).swap({  
		            target: $('#empty'),  
		            opacity: "0.5",
		            speed: 1000,
		        });
				i++;
			});
        }
    }); 
});

const doSomething = value =>
  	new Promise(resolve => {
	    if(value >= 0 && collection[value].val > key.val) {
	    	collection[value + 1] = collection[value];
	    	$(collection[value].div).swap({  
		            target: $('#empty'),  
		            opacity: "0.5",
		            speed: 1000,
		            callback:function(){
	    				resolve(value -1);
		            }
		        });
	    } else {
	    	resolve(value);
	    }
	});

const loop = value =>
  	doSomething(value).then(result => {
    	if(result >= 0 && collection[result].val > key.val) {
   		   	return loop(result);
    	}
    	return result;
  	});


function swapCollectionItems(value) {
	var temp = collection[value];

	collection[value] = collection[value+1];
	collection[value+1] = temp;
}

function changeCodeHighlight(id,time) {
	setTimeout(function(){
		$('.code .highlight').removeClass('highlight');
		$('.step.'+id).addClass('highlight');
	},time);
}

function copyObj(obj) {
	return $.extend(true,{},obj);
}
