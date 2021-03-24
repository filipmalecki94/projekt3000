var collection = {count:0},
	initInterval,
	animationSpeed = 2000,
	isDone = false,
	i = 1,
	key,
	j;

setTimeout(function (){
	jQuery('.graph').ready(function () {

		initInterval = setInterval(function (){
			var $graphBlocks = $('.graph .bar-block:not(#empty)');

			if($graphBlocks.length > 0){
				$graphBlocks.each(function(index,$div) {
					collection.count++;
					collection[index] = {
						div:$($div),
						val:parseInt($(this).attr('id')),
					};
				});
				clearInterval(initInterval);
			} else {
				return;
			}
			changeCodeHighlight(1)
			$(collection[i].div).addClass('border border-danger');
		},100);

	});

	$(".next").on('click',sortIteration);

	function sortIteration() {
		$(".next").off('click',sortIteration);
		changeCodeHighlight(2)

		key = copyObj(collection[i]);
		$(key.div).removeClass('border border-danger');
		$(key.div).addClass('border border-success');
		$(collection[i-1].div).addClass('border border-primary');
		$(key.div).swap({
			target: $('#empty'),
			speed: animationSpeed,
			callback:function(){
				$(".next").off('click',sortIteration);
				changeCodeHighlight(3)
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
							changeCodeHighlight(1)
							$(".next").on('click',sortIteration);
						}
					});
				});
				$(".next").off('click',sortIteration);
			}
		});

	}

	const doSomething = value =>
		new Promise(resolve => {
			changeCodeHighlight(4)
			$(collection[value].div).addClass('border border-primary');
			if(value >= 0 && collection[value].val > key.val) {
				collection[value + 1] = collection[value];
				changeCodeHighlight(5)
				$(collection[value].div).swap({
					target: $('#empty'),
					speed: animationSpeed,
					callback:function(){
						$(collection[value].div).removeClass('border border-primary');
						changeCodeHighlight(6)
						setTimeout(function(){
							resolve(value -1);
						},500)
						$(".next").off('click',sortIteration)
					}
				});
			} else {
				resolve(value);
				$(".next").on('click',sortIteration)
			}
		});

	const loop = value =>
		doSomething(value).then(result => {
			if(result >= 0 && collection[result].val > key.val) {
				changeCodeHighlight(5)
				return loop(result);
			}
			changeCodeHighlight(8)
			return result;
		});


	function swapCollectionItems(value) {
		var temp = collection[value];

		collection[value] = collection[value+1];
		collection[value+1] = temp;
	}

	function changeCodeHighlight(id,time) {
		setTimeout(function(){
			$('.code .highlight').removeClass('highlight');
			$('.step.'+id).addClass('highlight');
		},time);
	}

	function copyObj(obj) {
		return $.extend(true,{},obj);
	}

},0);
