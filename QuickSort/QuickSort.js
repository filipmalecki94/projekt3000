var collection = {},
	n=$('.bar-block').length,
	low=0,
	high=n-1,
	pi,
	i,
	pivot,
	stack={},
	t=-1;
	stack[++t] = low;
	stack[++t] = high;

$('.bar-block').each(function(index,$div) {
	collection[index] = {
		div:$($div),
		val:parseInt($(this).attr('id')),
	};
});

	const doSomething = value =>
  	new Promise(resolve => {
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
	if(t >= 0){
		
		h = stack[t--];
		l = stack[t--];

		var pr = new Promise(resolve => {
			partition2(l,h,resolve);
		});

		pr.then(function(res){

		if(pi - 1 > l){
			stack[++t] = l;
			stack[++t] = pi - 1;
		}

		if(pi + 1 < h){
			stack[++t] = pi + 1;
			stack[++t] = h;
		}
		console.log(collection)
		});
	}

});

function partition2(low,high,resolve)
{
	pivot = collection[high].val;
	i = (low - 1);
	j = low;
	loop(j).then((res) => {	
			swap(i+1,high);
			pi = i+1;
			resolve();
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

	quickSort(low,pi-1);
	quickSort(pi+1, high);
	}
}

// quickSort(low,high);

// setTimeout(function(){console.log(collection)},2000);



function swap(a,b) {
	var temp = collection[a];

	collection[a] = collection[b];
	collection[b] = temp;
}


function copyObj(obj) {
	return $.extend(true,{},obj);
}
