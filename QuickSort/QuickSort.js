var collection = {},
	n=$('.bar-block').length,
	low=0,
	high=n-1,pi,i,pivot,step=0;

$('.bar-block').each(function(index,$div) {
	collection[index] = {
		div:$($div),
		val:parseInt($(this).attr('id')),
	};
});


const doSomething = value =>
  	new Promise(resolve => {
  		// console.log(value , high - 1 , collection[value].val , pivot)
  		if(value <= high - 1){
  			if(collection[value].val < pivot)
  			{
				i++;
				swap(i,value);
  			}
		    resolve(value + 1);
  		} else {
  			resolve(9999)
  		}
	});

const loop = value =>
  	doSomething(value).then(result => {
  		if(result <= high - 1){
	   		return loop(result);
  		} else {
  			return result;
  		}
  	});


$(".next").click(function() {
	if(step === 0){
		console.log('step',0)
		partition2(low,high)
	}
	if(step === 1){
		console.log('step',1)
		partition2(low,pi-1)
	}
	if(step === 2){
		console.log('step',2)
		partition2(pi+1, high)
	}
});

function partition2(low,high)
{
	console.log(low,high)
	pivot = collection[high].val;
	i = (low - 1);
	j = low;
	loop(j).then((res) => {	
			swap(i+1,high);
			if(step === 0){
				step = 1;
				pi = i+1;
			}
			if(step === 1){
				step = 2;
			}
			if(step === 2){
				step = 1;
			}
		});
}

function partition(low,high)
{
	// console.log(low,high)
	pivot = collection[high].val;
	i = (low - 1)

	for(var j = low; j <= high - 1; j++)
	{
		if(collection[j].val < pivot)
		{
			i++;
			swap(i,j);
		}
	}
	swap(i+1,high);
	return (i+1);
}

function quickSort(low,high)
{
	if(low < high){
	pi = partition(low,high);
	console.log(pi)
	// quickSort(low,pi-1);
	// quickSort(pi+1, high);
	}
}

quickSort(low,high);

// setTimeout(function(){console.log(collection)},2000);



function swap(a,b) {
	var temp = collection[a];

	collection[a] = collection[b];
	collection[b] = temp;
}


function copyObj(obj) {
	return $.extend(true,{},obj);
}
