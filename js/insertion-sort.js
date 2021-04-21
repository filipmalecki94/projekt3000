define(['helper'], function (helper) {
	var collection = {count:0},
		animationSpeed = 1000,
		i = 1,
		key,
		j;

	function sortIteration() {
		helper.getStepButton().off('click',sortIteration);

		// key = arr[i];
		helper.changeCodeHighlight(2)
		key = helper.copyObj(collection[i]);

		$(key.div).removeClass('border border-danger');
		$(key.div).addClass('border border-success');
		$(collection[i-1].div).addClass('border border-primary');

		// j = i - 1
		helper.changeCodeHighlight(3)
		j = i - 1;

		helper.getStepButton().off('click',sortIteration);

		// while(j >= 0 && arr[j] > key) {
		loop(j).then((res) => {
			console.log(res+1)
			$(collection[res+1].div).addClass('sorted');
			collection[res+1] = key;
			$(key.div).removeClass('border border-success');
			$('.border.border-primary').removeClass('border border-primary');
			if(typeof collection[++i] === 'undefined'){
				return;
			}
			$(collection[i].div).addClass('border border-danger');
			helper.changeCodeHighlight(1)
			helper.getStepButton().on('click',sortIteration);
		});
		helper.getStepButton().off('click',sortIteration);
	}

	// while(j >= 0 && arr[j] > key) {
	const loop = value =>
		doSomething(value).then(result => {
			if(result >= 0 && collection[result].val > key.val) {
				helper.changeCodeHighlight(5)
				return loop(result);
			}
			helper.changeCodeHighlight(8)
			return result;
		});

	const doSomething = value =>
		new Promise(resolve => {
			// while(j >= 0 && arr[j] > key) {
			helper.changeCodeHighlight(4)
			$(collection[value].div).addClass('border border-primary');
			// setTimeout(function (){
				if(value >= 0 && collection[value].val > key.val) {
					helper.changeCodeHighlight(5)
					$(collection[value].div).swap({
						target: collection[value+1].div,
						speed: animationSpeed,
						callback:function(){
							$(collection[value].div).removeClass('border border-primary');
							helper.changeCodeHighlight(6)

							setTimeout(function(){
								collection[value + 1] = collection[value];
								collection[value] = key;
								resolve(value - 1);
							},500)
							helper.getStepButton().off('click',sortIteration)
						}
					});
				} else {
					resolve(value);
					helper.getStepButton().on('click',sortIteration)
				}
			// },
			// 	2000);
		});


	function initInsertionSortCode() {
		var $codeField = $('<div/>',{'class': 'code m-1'}),
			codeStructure = [
				{'line' : 'int <span style="color: red">i</span>,<span style="color: green">key</span>,<span style="color: blue">j</span>;','tab':0},
				{'line' : 'for(i = 1; i < n; i++) {', 'tab' : 0},
				{'line' : 'key = arr[i];', 'tab' : 1},
				{'line' : 'j = i - 1;', 'tab' : 1},
				{'line' : 'while(j >= 0 && arr[j] > key) {', 'tab' : 1},
				{'line' : 'arr[j + 1] = arr[j];', 'tab' : 2},
				{'line' : 'j = j - 1;', 'tab' : 2},
				{'line' : '}', 'tab' : 1},
				{'line' : 'arr[j + 1] = key;', 'tab' : 1},
				{'line' : '}', 'tab' : 0},
			];

		helper.initCode(codeStructure,$codeField);
		$('.code-block').append($codeField);
	}

	return {
		init: function (graphContainer) {
			initInsertionSortCode();
			graphContainer.find('.bar-block:not(#empty)').each(function(index,$div) {
				collection.count++;
				collection[index] = {
					div:$($div),
					val:parseInt($(this).attr('id')),
				};
			});
			helper.changeCodeHighlight(1)
			$(collection[i].div).addClass('border border-danger');
			$(collection[0].div).addClass('sorted')
			helper.getStepButton().on('click',sortIteration);
		},
		sortIteration: function () {
			return sortIteration()
		}
	};
});
