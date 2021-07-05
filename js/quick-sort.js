define(['helper'], function (helper) {
	var collection = [],animationSpeed = 500,working = false,
		N, k, a;

	function sortIteration() {
		if(!working){
			a=quick(0,N);
			a.next();
			working = true;
		} else {
			if(a.next().done)
				working = false;
		}
	}

	function* quick(i,j) {
		if(i+1<j)
		{
			yield* partition(i,j);
			yield k;
			yield* quick(i,k);
			yield* quick(k,j);
		}
	}

	function* partition(i,j)
	{
		if(i+1==j) {
			return;
		}
		let mid=Math.floor((i+j)/2);
		let x=+collection[mid].val;
		if(mid === N-1){
			$('.graph .bar-block').removeClass('sorted').removeClass('border border-danger')
			working = 'done';
			return;
		}
		$('.graph .bar-block').removeClass('border border-danger')
		collection[mid].div.addClass('border border-danger')
		 loop(i-1,j,mid,x).then(function (result) {
			let ii = result.i, jj = result.j, midd = result.mid, xx = result.x;

			 if(ii==j-1)
			 	collection[ii].div.addClass('sorted')
			 if(ii==i+1)
			 	collection[i].div.addClass('sorted')
			 k = ii
		});
	}

	function loop(i,j, mid, x) {
		return loopCode(i,j, mid, x).then(function (result) {
			let ii = result.i, jj = result.j, midd = result.mid, xx = result.x;
			return new Promise(function (resolve) {
				if (ii < jj) {
					$(collection[ii].div).animateSwap({
						target: collection[jj].div,
						speed: animationSpeed,
						opacity: "1",
						callback: function() {
							let y = collection[ii];
							collection[ii]=collection[jj];
							collection[jj]=y;
							if(ii==midd || jj==midd)
							{
								midd=ii+jj-midd;
							}
							return resolve(loop(ii,jj,midd,xx));
						}
					});
				} else {
					resolve({'i':ii,'j':jj,'mid':midd,'x':xx})
				}
			});
		});
	}

	function loopCode(i,j,mid,x) {
		return new Promise(function (resolve) {
			i++;
			j--;
			do {
				if(collection[i].val >= x && collection[j].val <= x) {
					return resolve({'i':i,'j':j,'mid':mid,'x':x})
				} else{
					if(+collection[i].val < x) {
						i++;
					}
					if(+collection[j].val > x) {
						j--;
					}
				}
			} while (true)
		});
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
			collection = []
			N = graphContainer.find('.bar-block').length;
			graphContainer.find('.bar-block').each(function(index,$div) {
				collection[index] = {
					div:$($div),
					val:
						parseInt($(this).attr('id'))
				};
			});
			helper.getStepButton().on('click',sortIteration);

			return this;
		},
		sortIteration: function () {
			return sortIteration()
		},
		setAnimationSpeed: function (newAnimationSpeed) {
			if (newAnimationSpeed > animationSpeed) {
				animationSpeed = newAnimationSpeed;
			}

			return this;
		}
	};
});
