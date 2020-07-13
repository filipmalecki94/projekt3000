var collection = {count:0},
	i = 1,
	key,
	j;

$('.graph .bar-block:not(#empty)').each(function(index,$div) {
	collection.count++;
	collection[index] = {
		div:$($div),
		val:parseInt($(this).attr('id')),
	};
});

changeCodeHighlight(1)
$(collection[i].div).addClass('border border-danger');

$(".next").click(function() {
	changeCodeHighlight(3)
	key = copyObj(collection[i]);

	$(key.div).removeClass('border border-danger');
	$(key.div).addClass('border border-success');
	$(collection[i-1].div).addClass('border border-primary');
	$(key.div).swap({  
        target: $('#empty'),  
        opacity: "0.5",
        speed: 2000,
        callback:function(){
        changeCodeHighlight(4)
		j = i - 1;
			loop(j).then((res) => {
				collection[res+1] = key;
				$(collection[res+1].div).swap({  
		            target: $('#empty'),  
		            opacity: "0.5",
		            speed: 2000,
		            callback:function(){
						$(key.div).removeClass('border border-success');
						$('.border.border-primary').removeClass('border border-primary');
						i++;
						$(collection[i].div).addClass('border border-danger');
		        		changeCodeHighlight(1)
		            }
		        });
			});
        }
    }); 
});

const doSomething = value =>
  	new Promise(resolve => {
  		changeCodeHighlight(5)
		$(collection[value].div).addClass('border border-primary');
	    if(value >= 0 && collection[value].val > key.val) {
	    	collection[value + 1] = collection[value];
  			changeCodeHighlight(7)
	    	$(collection[value].div).swap({  
		            target: $('#empty'),  
		            opacity: "0.5",
		            speed: 2000,
		            callback:function(){
						$(collection[value].div).removeClass('border border-primary');
        				changeCodeHighlight(8)
        				setTimeout(function(){
	    				resolve(value -1);
        				},500)
		            }
		        });
	    } else {
	    	resolve(value);
	    }
	});

const loop = value =>
  	doSomething(value).then(result => {
    	if(result >= 0 && collection[result].val > key.val) {
		    changeCodeHighlight(7)
   		   	return loop(result);
    	}
		changeCodeHighlight(10)
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
