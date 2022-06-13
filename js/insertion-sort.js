define(['helper'], function (helper) {
    let collection = {},
        animationSpeed = 100,
        i = 1,
        key,
        j;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        helper.setVariableValue('insertion_sort','i', i)
        $(collection[i].div).addClass('border border-danger');
        helper.changeCodeHighlight(1, function () {
            key = helper.copyObj(collection[i]);
            $(key.div).removeClass('border border-danger');
            $(key.div).addClass('border border-danger');
            $(collection[i - 1].div).addClass('border border-primary');

            helper.setVariableValue('insertion_sort','j', i - 1)
            helper.changeCodeHighlight(2, function () {

                j = i - 1;
                helper.getStepButton().off('click', sortIteration);

                loop(j).then(function (res) {
                    $(collection[res + 1].div).addClass('sorted');
                    collection[res + 1] = key;
                    $(key.div).removeClass('border border-danger');

                    if (typeof collection[++i] === 'undefined') {
                        helper.increaseComparisonCounter()
                        helper.changeCodeHighlight([])
                        $.each(collection, function (index, object) {
                            $(object.div).removeClass('sorted')
                        });
                        return;
                    }

                    $(collection[i].div).addClass('border border-danger');
                    helper.setVariableValue('insertion_sort','i', i)
                    helper.setVariableValue('insertion_sort','j', null)
                    helper.changeCodeHighlight(1)
                    helper.getStepButton().on('click', sortIteration);
                });
                helper.getStepButton().off('click', sortIteration);
            }, animationSpeed)
        }, animationSpeed)
    }

    function loop(value) {
        helper.setVariableValue('insertion_sort','j', value)
        $(collection[value].div).addClass('border border-primary')
        return loopCode(value).then(function (result) {
            helper.setVariableValue('insertion_sort','j', result)
            $('.border.border-primary:not(#'+result+')').removeClass('border border-primary');
            if (result >= 0 && collection[result].val > key.val) {
                $(collection[result].div).addClass('border border-primary')
                return helper.changeCodeHighlight(5, function () {
                    return helper.changeCodeHighlight(3, function () {
                        return loop(result);
                    }, animationSpeed)
                }, animationSpeed)
            } else {
                collection[result] && $(collection[result].div).addClass('border border-primary')
                return helper.changeCodeHighlight(result >= 0 || collection[result+2].val < key.val ? 3 : 5, function () {
                    $('.border.border-primary:not(#'+result+')').removeClass('border border-primary');
                    return helper.changeCodeHighlight(3, function () {
                        $(key.div).removeClass('border border-danger');
                        return result;
                    }, animationSpeed)
                }, animationSpeed)
            }
        });
    }

    function loopCode(value) {
        return new Promise(function (resolve) {
            $(collection[value].div).addClass('border border-primary')
            helper.changeCodeHighlight(3, function () {
                $(collection[value].div).addClass('border border-primary');
                if (value >= 0) {
                    helper.increaseComparisonCounter()
                }
                if (value >= 0 && collection[value].val > key.val) {
                    helper.changeCodeHighlight(4, function () {
                        $(collection[value].div).animateSwap({
                            target: collection[value + 1].div,
                            speed: animationSpeed,
                            callback: function () {
                                collection[value + 1] = collection[value];
                                collection[value] = key;
                                resolve(value - 1);
                                helper.getStepButton().off('click', sortIteration)
                            }
                        });
                    });
                } else {
                    resolve(value);
                }
            }, animationSpeed)
        });
    }

    function initInsertionSortCode() {
        let $codeBlock = $('<div/>', {'class': 'code-block insertion_sort'}),
            codeStructure = [
                {'line': 'FOR (I = 1; I < N; I++) {', 'tab': 0},
                {'line': 'KEY = ARR[I];', 'tab': 1},
                {'line': 'J = I - 1;', 'tab': 1},
                {'line': 'WHILE (J >= 0 && ARR[J] > KEY) {', 'tab': 1},
                {'line': 'SWAP(ARR[J + 1], ARR[J]);', 'tab': 2},
                {'line': 'J = J - 1;', 'tab': 2},
                {'line': '}', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            variables = {
                0: {
                    'color': 'red',
                    'label': 'I'
                },
                1: {
                    'color': 'blue',
                    'label': 'J'
                }
            };

        helper.initCode(codeStructure, $codeBlock, 'insertion sort', variables);
        $('.code-container').append($codeBlock);
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
            helper.changeCodeHighlight(0)
            helper.setVariableValue('insertion_sort','i', i)
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
