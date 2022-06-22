define(['helper'], function (helper) {
    let collection = {},
        animationSpeed = 100,
        i = 1,
        key,
        j;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        helper.setVariableValue('insertion_sort', 'i', i);
        collection[i].div.addClass('border-danger');

        helper.changeCodeHighlight(1, function () {
            key = helper.copyObj(collection[i]);

            key.div.removeClass('border-danger');
            key.div.addClass('border-danger');
            collection[i - 1].div.addClass('border-primary');

            helper.setVariableValue('insertion_sort', 'j', i - 1);
            helper.changeCodeHighlight(2, function () {
                j = i - 1;

                loop(j).then(function (result) {
                    key.div.removeClass('border-danger');
                    collection[result + 1].div.addClass('sorted');
                    collection[result + 1] = key;

                    if (typeof collection[++i] === 'undefined') {
                        helper.changeCodeHighlight([]);
                        helper.setVariableValue('insertion_sort', 'i');
                        helper.setVariableValue('insertion_sort', 'j');
                        $.each(collection, function (index, object) {
                            object.div.removeClass('sorted');
                        });

                        return;
                    }

                    collection[i].div.addClass('border-danger');
                    helper.setVariableValue('insertion_sort', 'i', i);
                    helper.setVariableValue('insertion_sort', 'j', null);
                    helper.changeCodeHighlight(0);
                    helper.getStepButton().on('click', sortIteration);
                });
                helper.getStepButton().off('click', sortIteration);
            }, animationSpeed);
        }, animationSpeed);
    }

    function loop(J) {
        helper.setVariableValue('insertion_sort', 'j', J);
        collection[J].div.addClass('border-primary');

        return loopCode(J).then(function (result) {
            helper.setVariableValue('insertion_sort', 'j', result);
            $('.border-primary:not(#' + result + ')').removeClass('border-primary');
            if (result >= 0 && collection[result].val > key.val) {
                collection[result].div.addClass('border-primary');

                return helper.changeCodeHighlight(5, function () {
                    return helper.changeCodeHighlight(3, function () {
                        return loop(result);
                    }, animationSpeed);
                }, animationSpeed);
            } else {
                collection[result] && collection[result].div.addClass('border-primary');

                return helper.changeCodeHighlight(result >= 0 || collection[result + 2].val < key.val ? 3 : 5, function () {
                    $('.border-primary:not(#' + result + ')').removeClass('border-primary');

                    return helper.changeCodeHighlight(3, function () {
                        $(key.div).removeClass('border-danger');
                        return result;
                    }, animationSpeed);
                }, animationSpeed);
            }
        });
    }

    function loopCode(J) {
        return new Promise(function (resolve) {
            collection[J].div.addClass('border-primary');

            if (J >= 0) {
                helper.increaseComparisonCounter();
            }

            helper.changeCodeHighlight(3, function () {
                collection[J].div.addClass('border-primary');
                if (J >= 0 && collection[J].val > key.val) {
                    helper.changeCodeHighlight(4, function () {
                        collection[J].div.animateSwap({
                            target: collection[J + 1].div,
                            speed: animationSpeed,
                            callback: function () {
                                collection[J + 1] = collection[J];
                                collection[J] = key;

                                helper.getStepButton().off('click', sortIteration);
                                resolve(J - 1);
                            }
                        });
                    });
                } else {
                    resolve(J);
                }
            }, animationSpeed);
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
                0: {'color': '#DC3545', 'label': 'I'},
                1: {'color': '#007BFF', 'label': 'J'}
            };

        helper.initCode(codeStructure, $codeBlock, 'INSERTION_SORT', variables);
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
            collection[0].div.addClass('sorted');
            helper.changeCodeHighlight(0);
            helper.setVariableValue('insertion_sort', 'i', i);
            helper.getStepButton().on('click', sortIteration);

            return this;
        },
        sortIteration: function () {
            return sortIteration();
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
