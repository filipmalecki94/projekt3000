var collection = {count:0};
$('.bar-block').each(function(index,$div) {
	collection.count++;
	collection[index] = {div:$div,val:parseInt($(this).attr('id'))};
});
var i = 0 , j = 0;

$(document).ready(function() {  
    $(".next").click(function() {
        if(collection[j].val > collection[j+1].val){
					 $(collection[j].div).swap({  
			            target: collection[j+1].div,  
			            opacity: "0.5",
			            speed: 1000,
			        });  
					var temp = collection[j];
					collection[j] = collection[j+1];
					collection[j+1] = temp;

			}
			if(j < collection.count - i - 2){
				j++;
			} else {
				i++;
				j=0;
			}
    });  
});  

