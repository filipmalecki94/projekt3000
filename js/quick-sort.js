define(['helper'], function (helper) {
	var collection = [],animationSpeed = 10000, stack = [],
		N, x, k = -1, pi, working = false;


	function swap(a,b) {
		console.log({a,b})
		console.log(collection[a])
		console.log(collection[b])
		var temp = collection[a];

		collection[a] = collection[b];
		collection[b] = temp;
		console.log(collection)
	}
	function partition2(low,high,resolve)
	{
		do {
			++k;
			console.log({k})
		} while (collection[k].val < x)

		do {
			--high;
			console.log({high})
		} while (collection[high].val > x)

		if(k < high) {
			$(collection[k].div).animateSwap({
				target: $(collection[high].div),
				opacity: "0.5",
				speed: 2000,
				callback: function(){
					swap(k,high);
				}
			});
		} else {
			return resolve(k)
		}

		console.log(k,high)

		//
		// loop(j).then((res) => {
		//
		// });
	}

	function sortIteration() {
		quick(k,N,collection)
		console.log(stack)
		// if(working === false) {
		// 	k = -1;
		// 	x = collection[N/2].val;
		// }
		// var pr = new Promise(resolve => {
		// 	working = true;
		// 	partition2(0,N,resolve);
		// });
		//
		// pr.then(function(res){
		// 	working = false;
		// 	console.log({res})
		// });
	}

	function quick( ll,hh, coll) {
		var pi;
		console.log(ll,hh)
		if(ll < hh) {
			loop(ll,hh,coll[Math.ceil(hh/2)], coll).then(function (res) {
				console.log('-------------------')
				console.log({res})
				pi = res.kk
				console.log(coll)
				quick(pi + 1, hh, coll)
				quick( ll, pi - 1, coll)
			});
			// pi = part(ll,hh,collection[Math.ceil(hh/2)])
			// console.log(pi)
		} else {
			stack.push(collection)
		}
	}

	function part(kk,nn,xx) {
		var rez;
		console.log({kk,nn,xx})
		loop(kk,nn,xx).then(function (res) {
			console.log({res})
			return 'x';
		});
	}
	function loop(kk,nn,xx, coll) {
		console.log({kk,nn,xx})
		return loopCode(kk,nn,xx, coll).then(function (result) {
			var KK=result.kk,NN=result.nn,COLL=result.coll;

			console.log({result});
			return new Promise(function (resolve) {
				if (KK < NN) {
					// swap(kk, nn)
					return resolve(loop(KK,NN,xx, COLL));
				} else {
					resolve(result)
				}
			});
		});
	}

	function loopCode(kk,nn,xx, coll) {
		console.log({nn})
		return new Promise(function (resolve) {
			var pr1 = new Promise(function (resolve1) {
				do {
					++kk;
					if (coll[kk] >= xx) {
						console.log({kk})
						return resolve1(kk)
					} else {
						console.log('pr1')
						console.log({kk})
						// return resolve1(kk)
					}
				} while (coll[kk] < xx)
			});
			return pr1.then(function (res1) {
				console.log({res1})
				var pr2 = new Promise(function (resolve2) {
					do {
						--nn;
						// console.log({'nn': collection[nn]})
						if (coll[nn] <= xx) {
							console.log({'kk': res1, 'nn': nn})
							return resolve2({'kk':res1,'nn':nn})
						} else {
							console.log('pr2')
							console.log({'kk': res1, 'nn': nn})
							// return resolve2({'kk': res1, 'nn': nn})
						}
					} while (coll[nn] > xx)
				});
				pr2.then(function (res2) {
					var data = {'kk': res2.kk, 'nn': res2.nn, 'coll': coll};
					console.log({data})
					if (data.kk < data.nn) {
						swap(kk, nn)
					}// else {
					// 	console.log(data.kk);
						return resolve(data);
					// }
				});
			});
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
				collection[index] = //{
					// div:$($div),
					//val:
						parseInt($(this).attr('id'))//,
				//};
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
