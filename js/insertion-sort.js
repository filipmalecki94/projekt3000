define(['helper'], function (helper) {
    let collection = {},
        animationSpeed = 100,
        i = 1,
        key,
        j;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        helper.changeCodeHighlight(2)
        key = helper.copyObj(collection[i]);

        $(key.div).removeClass('border border-danger');
        $(key.div).addClass('border border-success');
        $(collection[i - 1].div).addClass('border border-primary');

        helper.changeCodeHighlight(3)
        j = i - 1;

        helper.getStepButton().off('click', sortIteration);

        loop(j).then(function (res) {
            $(collection[res + 1].div).addClass('sorted');
            collection[res + 1] = key;
            $(key.div).removeClass('border border-success');

            if (typeof collection[++i] === 'undefined') {
                $.each(collection, function (index, object) {
                    $(object.div).removeClass('sorted')
                });
                return;
            }

            $(collection[i].div).addClass('border border-danger');
            helper.changeCodeHighlight(1)
            helper.getStepButton().on('click', sortIteration);
        });
        helper.getStepButton().off('click', sortIteration);
    }

    function loop(value) {
        return loopCode(value).then(function (result) {
            $('.border.border-primary').removeClass('border border-primary');
            if (result >= 0 && collection[result].val > key.val) {
                helper.changeCodeHighlight(5)
                $(collection[result].div).addClass('border border-primary')
                return loop(result);
            }
            helper.changeCodeHighlight(8)
            return result;
        });
    }

    function loopCode(value) {
        return new Promise(function (resolve) {
            helper.changeCodeHighlight(4)
            $(collection[value].div).addClass('border border-primary');
            // setTimeout(function () {
            if (value >= 0 && collection[value].val > key.val) {
                helper.changeCodeHighlight(5)
                // setTimeout(function () {

                $(collection[value].div).animateSwap({
                    target: collection[value + 1].div,
                    speed: animationSpeed,
                    callback: function () {
                        collection[value + 1] = collection[value];
                        collection[value] = key;
                        // setTimeout(function () {
                        helper.changeCodeHighlight(6)
                        resolve(value - 1);
                        helper.getStepButton().off('click', sortIteration)
                        // }, animationSpeed)
                    }
                    // }, animationSpeed * 3);
                });
            } else {
                resolve(value);
                helper.getStepButton().on('click', sortIteration)
            }
            // }, animationSpeed * 2);
        });
    }

    function initInsertionSortCode() {
        let $codeField = $('<div/>', {'class': 'code m-1'}),
            codeStructure = [
                {'line': 'int <span style="color: red">i</span>,<span style="color: green">key</span>,<span style="color: blue">j</span>;', 'tab': 0},
                {'line': 'for(i = 1; i < n; i++) {', 'tab': 0},
                {'line': 'key = arr[i];', 'tab': 1},
                {'line': 'j = i - 1;', 'tab': 1},
                {'line': 'while(j >= 0 && arr[j] > key) {', 'tab': 1},
                {'line': 'arr[j + 1] = arr[j];', 'tab': 2},
                {'line': 'j = j - 1;', 'tab': 2},
                {'line': '}', 'tab': 1},
                {'line': 'arr[j + 1] = key;', 'tab': 1},
                {'line': '}', 'tab': 0},
            ];

        helper.initCode(codeStructure, $codeField);
        $('.code-block').append($codeField);
    }

    return {
        init: function (graphContainer) {
            collection = {};
            i = 1;

            initInsertionSortCode();
            graphContainer.find('.bar-block:not(#empty)').each(function (index, $div) {
                collection[index] = {
                    div: $($div),
                    val: parseInt($(this).attr('id')),
                };
            });
            helper.changeCodeHighlight(1)
            $(collection[i].div).addClass('border border-danger');
            $(collection[0].div).addClass('sorted')
            helper.getStepButton().on('click', sortIteration);

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
        },
        getAnimationSpeed: function () {
            return animationSpeed;
        }
    };
});
