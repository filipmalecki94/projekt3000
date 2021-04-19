define(['helper'], function (helper) {
	var init = {},n=0,maxValue=0
		counter = {},
		sorted = {},
		stepDone = 0;

	function changeCodeHighlightArr(ids,time) {
		setTimeout(function(){
			$('.code .highlight').removeClass('highlight');
			$.each(ids, function( index, value ) {
				$('.step.'+value).addClass('highlight');
			});
		},time);
	}

	function changeCodeHighlight(id,time) {
		setTimeout(function(){
			$('.code .highlight').removeClass('highlight');
			$('.step.'+id).addClass('highlight');
		},time);
	}

	function sortIteration() {
		var i = 0;

		if(stepDone === 0){
			changeCodeHighlightArr([6,7])
			var interval = setInterval(function(){
				counter[i].div.animate({
					opacity: 1
				}, 1,function(){
					i++;
					if(i > maxValue) {
						clearInterval(interval);
					}
				});
			}, 500);
			stepDone = 1;
			return;
		}
		if(stepDone === 1){
			changeCodeHighlightArr([9,10])
			var interval = setInterval(function(){
				init[i].div.animate({
					opacity: 0.5,
				}, 100,function(){
					counter[init[i].val].div.find('.counter-box').text(++counter[init[i].val].count);
					i++;
					if(i >= n) {
						clearInterval(interval);
					}
				});
			}, 600);
			stepDone = 2;
			return;
		}
		if(stepDone === 2){
			counter[0].div.find('.counter-box').addClass('bg-success text-white')
			i = 1
			changeCodeHighlightArr([12,13])
			var interval = setInterval(function(){
				counter[i].div.find('.counter-box').addClass('bg-success text-white')
				counter[i].count += counter[i-1].count;
				counter[i].div.find('.counter-box').text(counter[i].count)
				i++;
				if(i > maxValue){
					$('.bg-success .text-white').removeClass('bg-success text-white')
					// $('.graph').empty();
					// for(i=1;i<=n;i++){
					// 	$('.graph').append($('<div id="'+i+'" class="slot"></div>').css('width',helper.getBarWidth()))
					// 	$('.slot')
					// }
					clearInterval(interval)
				}
			}, 1000);
			stepDone = 3;
			return;
		}
		if(stepDone === 3){
			changeCodeHighlightArr([15,16])
			i = n-1;
			var interval = setInterval(function(){
				var e = --counter[init[i].val].count;
				counter[init[i].val].div.find('.counter-box').addClass('border border-danger')
				counter[init[i].val].div.find('.counter-box').text(e)
				sorted[e].val = init[i].val;
				sorted[e].div = init[i].div;

				sorted[e].div.animate({
					opacity: 1
				}, 100,function(){
					$('.sorted #'+ e +'.slot').replaceWith(sorted[e].div.clone());
					$('.border.border-danger').removeClass('border border-danger')
				});
				if(i-- === 0){
					clearInterval(interval)
				}
			},1000);
			stepDone = 4;
			return;
		}
	}

	function initCountingSortCode() {
		var $codeField = $('<div/>',{'class': 'code m-1'}),
			codeStructure = [
				{'line' : 'int k=max(arr);', 'tab' : 0},
				{'line' : 'int n=count(arr);', 'tab' : 0},
				{'line' : 'int i;', 'tab' : 0},
				{'line' : 'int counter[k + 1];', 'tab' : 0},
				{'line' : 'int sorted[k + 1];', 'tab' : 0},
				{'line' : '&nbsp;', 'tab' : 0},
				{'line' : 'for(i = 0; i < k; i++)', 'tab' : 0},
				{'line' : 'counter[i] = 0;', 'tab' : 1},
				{'line' : '&nbsp;', 'tab' : 0},
				{'line' : 'for(i = 0; i < n; i++)', 'tab' : 0},
				{'line' : 'counter[arr[i]]++;', 'tab' : 1},
				{'line' : '&nbsp;', 'tab' : 0},
				{'line' : 'for(i = 1; i < k; i++)', 'tab' : 0},
				{'line' : 'counter[i] += counter[i-1];', 'tab' : 1},
				{'line' : '&nbsp;', 'tab' : 0},
				{'line' : 'for(i = n-1; i >= 0; i--)', 'tab' : 0},
				{'line' : 'sorted[--counter[arr[i]]] = arr[i];', 'tab' : 1},
			];

		helper.initCode(codeStructure,$codeField);
		$('.code-block').append($codeField);
	}

	function initCounters () {
		$('.graph-block').append(function (){
			var $counterContainer = $('<div/>',{
				'class': 'counter h-25 my-1 mx-3 p-4 d-flex justify-content-around'
			});
			for(var i = 0; i <= maxValue; i++) {
				var $counterBlock = $('<div/>',{
						'id': i,
						'class': 'counter-block d-flex flex-wrap justify-content-center w-100',
						'html': i
					}),
					$counterBox = $('<div/>',{
						'class': 'counter-box d-flex justify-content-center align-items-center',
						'html': 0
					});
				$counterBlock.append($counterBox);
				counter[i] = {
					div:$($counterBlock),
					count:0
				};
				$counterContainer.append($counterBlock);
			}
			return $counterContainer;
		});
	}

	function initSortedContainer(n) {
		$('.graph-block')
			.append($('<div/>',{'class':'sorted my-1 mx-3 p-4 d-flex justify-content-around'})
				.append(function (){
					var slots = [];
					for (var i = 0; i < n; i++){
						slots.push($('<div/>',{'id':i,'class':'slot d-flex justify-content-around'}).css('width',helper.getBarWidth()))
					}
					return slots;
				}));
	}

	return {
		init: function (graphContainer) {
			initCountingSortCode();
			maxValue = Math.max(...graphContainer.find('.bar-block')
				.map(function() { return parseInt(this.id); })
				.get());
			graphContainer.find('.bar-block').each(function(index,$div) {
				n++;
				init[index] = {
					div:$($div),
					val:parseInt($(this).attr('id')),
				};
				sorted[index] = {div:'',val:0}
			});
			initSortedContainer(graphContainer.find('.bar-block').length);
			initCounters();
			helper.getStepButton().on('click',sortIteration);
		},
		sortIteration: function () {
			return sortIteration()
		}
	};
});
