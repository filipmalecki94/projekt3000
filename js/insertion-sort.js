define(['helper'], function (helper) {
	var collection = {count:0},
		animationSpeed = 1000,
		isDone = false,
		i = 1,
		key,
		j;

	function sortIteration() {
		helper.getStepButton().off('click',sortIteration);
		helper.changeCodeHighlight(2)

		key = helper.copyObj(collection[i]);
		$(key.div).removeClass('border border-danger');
		$(key.div).addClass('border border-success');
		$(collection[i-1].div).addClass('border border-primary');
		$(key.div).swap({
			target: $('#empty'),
			speed: animationSpeed,
			callback:function(){
				helper.getStepButton().off('click',sortIteration);
				helper.changeCodeHighlight(3)
				j = i - 1;
				loop(j).then((res) => {
					collection[res+1] = key;
					$(collection[res+1].div).swap({
						target: $('#empty'),
						speed: animationSpeed,
						callback:function() {
							$(key.div).removeClass('border border-success');
							$('.border.border-primary').removeClass('border border-primary');
							isDone = typeof collection[++i] === 'undefined'
							if(isDone){
								return;
							}
							$(collection[i].div).addClass('border border-danger');
							helper.changeCodeHighlight(1)
							helper.getStepButton().on('click',sortIteration);
						}
					});
				});
				helper.getStepButton().off('click',sortIteration);
			}
		});

	}
	const doSomething = value =>
		new Promise(resolve => {
			helper.changeCodeHighlight(4)
			$(collection[value].div).addClass('border border-primary');
			if(value >= 0 && collection[value].val > key.val) {
				collection[value + 1] = collection[value];
				helper.changeCodeHighlight(5)
				$(collection[value].div).swap({
					target: $('#empty'),
					speed: animationSpeed,
					callback:function(){
						$(collection[value].div).removeClass('border border-primary');
						helper.changeCodeHighlight(6)
						setTimeout(function(){
							resolve(value -1);
						},500)
						helper.getStepButton().off('click',sortIteration)
					}
				});
			} else {
				resolve(value);
				helper.getStepButton().on('click',sortIteration)
			}
		});

	const loop = value =>
		doSomething(value).then(result => {
			if(result >= 0 && collection[result].val > key.val) {
				helper.changeCodeHighlight(5)
				return loop(result);
			}
			helper.changeCodeHighlight(8)
			return result;
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
			helper.getStepButton().on('click',sortIteration);
		},
		sortIteration: function () {
			return sortIteration()
		}
	};
});
