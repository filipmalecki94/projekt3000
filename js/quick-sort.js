define(['helper'], function (helper) {
	var collection = [],animationSpeed = 100, level = 0,
		N, k, quicksort;

	function sortIteration() {
		helper.getStepButton().off('click',sortIteration);
		if(level === 0){
			appendPartitionLevel(0,N);
			quicksort = quick(0,N);
		}
		quicksort.next()
	}

	function* quick(i,j) {
		if(i+1 === N-1 && j === N) {
			$('.partition .partition-level').remove()
			return;
		}
		if(i+1<j) {
			yield* partition(i,j);
			yield k;
			appendPartitionLevel(i,k);
			yield* quick(i,k);
			removePartitionLevelG();
			appendPartitionLevel(k,j);
			yield* quick(k,j);
			removePartitionLevelG();
		}
	}

	function* partition(i,j) {
		let mid=Math.floor((i+j)/2),
			x = +collection[mid].val;

		if(i+1 === j || mid === N-1) {
			return;
		}
		loop(i-1,j,mid,x).then(function (result) {
			$('.bar-block').css('background','unset')
			k = result.i
			helper.getStepButton().on('click',sortIteration);
		});
	}

	function loop(i,j, mid, x) {
		return loopCode(i,j, mid, x).then(function (result) {
			let i = result.i, j = result.j, mid = result.mid, x = result.x;

			return new Promise(function (resolve) {
				if (i < j) {
					collection[i].div.css('background','unset')
					collection[j].div.css('background','unset')
					return $(collection[i].div).animateSwap({
						target: collection[j].div,
						speed: animationSpeed,
						opacity: "1",
						callback: function() {
							let y = collection[i];
							collection[i]=collection[j];
							collection[j]=y;

							if(i === mid || j == mid) {
								mid = i+j-mid;
							}

							return resolve(loop(i,j,mid,x));
						}
					});
				} else {
					resolve({'i':i,'j':j,'mid':mid,'x':x})
				}
			});
		});
	}

	function loopCode(i,j,mid,x) {
		return new Promise(function (resolve) {
			i++; j--;
			collection[i].div.css('background','red')
			collection[j].div.css('background','blue')
			let intrvl = setInterval(function () {
				if(i > j) {
					clearInterval(intrvl)
				}
				if(collection[i].val >= x && collection[j].val <= x) {
					clearInterval(intrvl)
					return resolve({'i':i,'j':j,'mid':mid,'x':x})
				} else{
					if(+collection[i].val < x) {
						collection[i].div.css('background','unset')
						collection[++i].div.css('background','red')
					}
					if(+collection[j].val > x) {
						collection[j].div.css('background','unset')
						collection[--j].div.css('background','blue')
					}
				}
			}, animationSpeed)
		});
	}

	function appendPartitionLevel(i,j) {
		$('.partition').append(createPartitionLevel(level, i, j))
		enablePartitionRangeField(level++, i, j)
	}

	function removePartitionLevelG() {
		return $('.partition .partition-level[data-level='+(--level)+']').remove();
	}

	function createPartition () {
		return $('<div/>',{'class' : 'partition'})
			.css({'width' : '100%','height' : '100px'});
	}

	function createPartitionLevel (level, i, j) {
		let $partitionLevel = $('<div/>',{'class' : 'partition-level d-flex'})
			.css({'width' : '100%','height' : '1px', 'margin-bottom' : '4px'})
			.attr('data-level', level);

		for(let i = 0; i < N; i++) {
			$partitionLevel.append(helper.createBar(i,1,{
					'height' : '100%',
					'noBorder' : true,
					'barWidth' : '100%',
					'backgroundColor' : 'rgb(0,255,0)'
				})
					.css('visibility','hidden')
			);
		}
		markPivot(Math.floor((i+j)/2))

		return $partitionLevel;
	}

	function enablePartitionRangeField(level = 0, from = 0, to = 0, turnOn = true) {
		let $partitionLevel = $('.partition-level[data-level='+level+']');

		for(let i = from; i < to; i++) {
			$partitionLevel.find('.bar-block[data-index='+i+']').css('visibility','visible');
		}
	}

	function markPivot(pivot) {
		$('.graph .bar-block').removeClass('border border-danger')
		collection[pivot].div.addClass('border border-danger')
	}

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
				{'line' : 'int partition (double t[], int n)', 'tab' : 0},
				{'line' : '{', 'tab' : 0},
				{'line' : 'int k = -1;', 'tab' : 1},
				{'line' : 'double x = t[n / 2];', 'tab' : 1},
				{'line' : 'while() {', 'tab' : 1},
				{'line' : 'do ++k; while (t[k] < x);', 'tab' : 2},
				{'line' : 'do --n; while (t[n] > x);', 'tab' : 2},
				{'line' : 'if (k < n) std::swap(t[k],t[n]);', 'tab' : 2},
				{'line' : 'else       return k;', 'tab' : 2},
				{'line' : '}', 'tab' : 1},
				{'line' : '}', 'tab' : 0},
			];

		helper.initCode(codeStructureSort,$codeFieldSort);
		helper.initCode(codeStructurePartition,$codeFieldPartition);
		$('.code-block').append($codeFieldPartition).append($codeFieldSort)
	}

	return {
		init: function (graphContainer) {
			initQuicksortCode();
			collection = [];
			level = 0;
			k = null;
			N = graphContainer.find('.bar-block').length;
			$('.graph-block').prepend(createPartition());
			graphContainer.find('.bar-block').each(function(index, $div) {
				collection[index] = {
					div: $($div),
					val: parseInt($(this).attr('id'))
				};
			});
			helper.getStepButton().on('click',sortIteration);

			return this;
		},
		sortIteration: function () {
			return sortIteration
		},
		setAnimationSpeed: function (newAnimationSpeed) {
			if (newAnimationSpeed > animationSpeed) {
				animationSpeed = newAnimationSpeed;
			}

			return this;
		}
	};
});
