define(['helper'], function (helper) {
	var collection = {count:0},n,low,high,pi,i,pivot,t,stack={};


	function initVars(){
		n=collection.count;
		low=0;
		high=n-1;
		t=-1;
		stack[++t] = low;
		stack[++t] = high;
	}

	function swap(a,b) {
		var temp = collection[a];

		collection[a] = collection[b];
		collection[b] = temp;
	}
	function partition2(low,high,resolve)
	{
		pivot = collection[high].val;
		i = (low - 1);
		var j = low;
		loop(j).then((res) => {
			$(collection[i+1].div).swap({
				target: $(collection[high].div),
				opacity: "0.5",
				speed: 2000,
				callback: function(){
					$('.border.border-success').removeClass('border border-success');
					swap(i+1,high);
					pi = i+1;
					resolve();
				}
			});
		});
	}

	function sortIteration() {
		if(t >= 0){

			var h = stack[t--],
				l = stack[t--],
				pr = new Promise(resolve => {

				$('.border.border-success').removeClass('border border-success');
				$(collection[l].div).addClass('border border-danger')
				$(collection[h].div).addClass('border border-success')
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

				$('.border.border-danger').removeClass('border border-success');
				$('.border.border-primary').removeClass('border border-primary');
				$(collection[stack[t-1]].div).addClass('border border-primary')
				$(collection[stack[t]].div).addClass('border border-success')
				console.log(stack[t-1],stack[t])
			});
		}
	}
	const doSomething = value =>
		new Promise(resolve => {
			if(value <= high - 1){
				if(collection[value].val < pivot)
				{
					i++;
					$('.border.border-primary').removeClass('border border-primary');
					$(collection[i].div).addClass('border border-danger')
					$(collection[value].div).addClass('border border-primary')
					$(collection[i].div).swap({
						target: $(collection[value].div),
						opacity: "0.5",
						speed: 2000,
						callback: function(){
							$('.border.border-danger').removeClass('border border-danger');
							$('.border.border-primary').removeClass('border border-primary');
							swap(i,value);
							resolve(value + 1);
						}
					});
				} else {
					resolve(value + 1);
				}
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


	function initQuicksortCode() {
		var $codeFieldSort = $('<div/>',{'class': 'code m-1 h-50'}),
			$codeFieldPartition = $('<div/>',{'class': 'code m-1 h-50'}),
			codeStructureSort = [
				{'line' : 'if(low < high) {', 'tab' : 0},
				{'line' : 'int pi = partition(arr, low, high);', 'tab' : 1},
				{'line' : '&nbsp;', 'tab' : 1},
				{'line' : 'quickSort(arr, pi + 1, high);', 'tab' : 1},
				{'line' : 'quickSort(arr, low, pi - 1);', 'tab' : 1},
				{'line' : '}', 'tab' : 0},
			],
			codeStructurePartition = [
				{'line' : 'int pivot = arr[high];', 'tab' : 0},
				{'line' : 'int i = (low - 1);', 'tab' : 0},
				{'line' : '&nbsp;', 'tab' : 0},
				{'line' : 'for(int j = low; j <= high-1; j++) {', 'tab' : 0},
				{'line' : 'if(arr[j] < pivot) {', 'tab' : 1},
				{'line' : 'i++;', 'tab' : 2},
				{'line' : 'swap(&arr[i}, &arr[j]);', 'tab' : 2},
				{'line' : '}', 'tab' : 1},
				{'line' : '}', 'tab' : 0},
				{'line' : 'swap(&arr[i+1},&arr[high];', 'tab' : 0},
				{'line' : 'return (i+1);', 'tab' : 0},
			];

		helper.initCode(codeStructureSort,$codeFieldSort);
		helper.initCode(codeStructurePartition,$codeFieldPartition);
		$('.code-block').append($codeFieldPartition).append($codeFieldSort)
	}

	return {
		init: function (graphContainer) {
			initQuicksortCode();
			graphContainer.find('.bar-block:not(#empty)').each(function(index,$div) {
				collection.count++;
				collection[index] = {
					div:$($div),
					val:parseInt($(this).attr('id')),
				};
			});
			initVars();
			helper.getStepButton().on('click',sortIteration);
		},
		sortIteration: function () {
			return sortIteration()
		}
	};
});
