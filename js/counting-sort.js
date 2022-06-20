define(['helper'], function (helper) {
    let init = {},
        n = 0,
        maxValue = 0,
        counter = {},
        sorted = {},
        stepDone = 0,
        animationSpeed = 200,
        interval,
        i = 0;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        if (stepDone === 0) {
            helper.darkenBars(counter[i].div, function () {
                helper.changeCodeHighlight(4, function () {
                    if (i++ >= maxValue) {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(3, function () {
                            helper.setVariableValue('counting_sort', 'i', 0);
                            helper.changeCodeHighlight(6, function () {
                                stepDone = 1;
                                i = 0
                                helper.getStepButton().on('click', sortIteration);
                            }, animationSpeed);
                        }, animationSpeed);
                    } else {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(3, function () {
                            helper.getStepButton().on('click', sortIteration);
                        }, animationSpeed);
                    }
                }, animationSpeed);
            }, true);

            return;
        }

        if (stepDone === 1) {
            helper.darkenBars(init[i].div, function () {
                $('#' + init[i].val + '.bar-block-container').append(
                    helper.createBar(0, init[i].val, {
                        'withNumbers': false,
                        'height': 50 / Math.max(...Object.values(getPreCountedInit())) + 'px',
                        'onlyBar': true,
                        'barWidth': '10px',
                        'customBarClasses': 'position-relative'
                    })
                );
                ++counter[init[i].val].count;
                helper.changeCodeHighlight(7, function () {
                    if (++i < n) {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(6, function () {
                            helper.getStepButton().on('click', sortIteration);
                        }, animationSpeed);
                    } else {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(6, function () {
                            helper.setVariableValue('counting_sort', 'i', 1);
                            helper.changeCodeHighlight(9, function () {
                                stepDone = 2;
                                i = 1;
                                helper.darkenBars($('.graph .bar-block .bar'), null, true);
                                helper.getStepButton().on('click', sortIteration);
                            }, animationSpeed);
                        }, animationSpeed);
                    }
                }, animationSpeed);

            });
            return;
        }

        if (stepDone === 2) {
            if (i === 1) {
                $('.sorted').empty().removeClass('preset').append(getVerticalBarsOrder());
            }

            helper.darkenBars($('.counter-container .counter-bars .bar-block[data-index="' + i + '"]'), function () {
                $('.sorted #' + i + ' .bar').removeClass('invisible');
                $('.counter-container .counter-labels .bar-block[data-index="' + i + '"]').addClass('border-bottom-red');
                helper.changeCodeHighlight(10, function () {
                    if (++i <= maxValue) {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(9, function () {
                            helper.getStepButton().on('click', sortIteration);
                        }, animationSpeed);
                    } else {
                        helper.changeCodeHighlight(9, function () {
                            helper.setVariableValue('counting_sort', 'i', i);
                            helper.changeCodeHighlight(12, function () {
                                stepDone = 3;
                                i = n - 1;
                                helper.setVariableValue('counting_sort', 'i', n - 1);
                                helper.darkenBars($('.graph .bar-block'), null, true);
                                helper.getStepButton().on('click', sortIteration);
                            }, animationSpeed);
                        }, animationSpeed);
                    }
                }, animationSpeed);
            });

            return;
        }

        if (stepDone === 3) {
            let e = --counter[init[i].val].count, values = [];

            helper.darkenBars(init[i].div, function () {
                sorted[e].val = init[i].val;
                sorted[e].div = init[i].div;
                $('.sorted .bar-block[data-index="' + e + '"] .bar').replaceWith(helper.createBar(e, sorted[e].val,
                    {
                        'withNumbers': true,
                        'onlyBar': true,
                        'isOversize': n < 50
                    }));
                helper.changeCodeHighlight(13, function () {
                    if (i-- === 0) {
                        stepDone = 4;

                        $.each(sorted, function (index, object) {
                            values.push(object.val);
                        });

                        $('.graph').empty();
                        $('.sorted').remove();
                        $('.counter-container').remove();

                        helper.setVariableValue('counting_sort', 'i', null);
                        helper.changeCodeHighlight(12, function () {
                            helper.changeCodeHighlight([], function () {
                                $.each(helper.createBars($('.graph'), values,
                                    {
                                        'withNumbers': true
                                    }
                                ).find('.bar-block'), function (index, $div) {
                                    init[index] = {
                                        div: $($div),
                                        val: parseInt($(this).attr('id')),
                                    }
                                    sorted[index] = {div: '', val: 0}
                                });

                                initSortedContainer();
                                initCounters();

                                helper.getStepButton().on('click', sortIteration);
                            }, animationSpeed);
                        }, animationSpeed);
                    } else {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(12, function () {
                            helper.getStepButton().on('click', sortIteration);
                        });
                    }
                }, animationSpeed);
            });
        }
    }

    function initCountingSortCode() {
        let $codeBlock = $('<div/>', {'class': 'code-block'}),
            codeStructure = [
                {'line': 'COUNTER[K + 1];', 'tab': 0},
                {'line': 'SORTED[K + 1];', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 0; I < K; I++)', 'tab': 0},
                {'line': 'COUNTER[I] = 0;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 0; I < N; I++)', 'tab': 0},
                {'line': 'COUNTER[ARR[I]]++;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 1; I < K; I++)', 'tab': 0},
                {'line': 'COUNTER[I] += COUNTER[I-1];', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = N-1; I >= 0; I--)', 'tab': 0},
                {'line': 'SORTED[--COUNTER[ARR[I]]] = ARR[I];', 'tab': 1},
            ],
            variables = {
                0: {'color': 'black', 'label': 'I'},
                1: {'color': 'gray', 'label': 'K'}
            };

        helper.initCode(codeStructure, $codeBlock, 'counting_sort', variables);
        $('.code-container').append($codeBlock);
    }

    function initCounters() {
        $('.graph-block').append(function () {
            let $counterLabelContainer = $('<div/>', {
                    'class': 'counter-labels d-flex justify-content-around'
                }),
                $counterBarContainer = $('<div/>', {
                    'class': 'counter-bars d-flex justify-content-around'
                });

            for (let i = 0; i <= maxValue; i++) {
                let $counterLabelBlock = helper.createBar(i, i,
                        {
                            'withNumbers': true,
                            'isOversize': maxValue > 50,
                            'glueToTop': true
                        }),
                    $counterBarBlock = $('<div/>', {
                        'class': 'bar-block d-flex justify-content-center flex-column align-items-center',
                        'id': i,
                        'data-index': i,
                        'html': $('<div/>', {
                            'class': 'bar-block-container position-absolute',
                            'id': i
                        })
                    });

                counter[i] = {
                    div: $($counterLabelBlock).css('opacity', 0),
                    count: 0
                };
                $counterLabelContainer.append($counterLabelBlock);
                $counterBarContainer.append($counterBarBlock);
            }

            return $('<div/>', {'class': 'counter-container'})
                .append($counterBarContainer)
                .append($counterLabelContainer);
        });
    }

    function initSortedContainer(n) {
        $('.graph-block')
            .append(
                $('<div/>', {'class': 'sorted preset d-flex justify-content-around'}).append(function () {
                    let slots = [];

                    for (let i = 0; i < n; i++) {
                        slots.push(helper.createBar(i, i, {
                                'barWidth': '100%',
                                'noBorder': false,
                                'height': '10px',
                                'customBarClasses': 'invisible'
                            }
                        ));
                    }

                    return slots;
                })
            );
    }

    function getPreCountedInit() {
        let tempCounter = {};

        $.each(init, function (key, object) {
            tempCounter[object.val] ? tempCounter[object.val] += 1 : tempCounter[object.val] = 1;
        });

        return tempCounter;
    }

    function getVerticalBarsOrder() {
        let ii = 1,
            x = counter[ii - 1].count,
            verticalBarsOrder = [],
            barCustomOptions = {
                'barWidth': '100%',
                'withNumbers': false,
                'height': '10px',
                'noBorder': true,
                'customBarClasses': 'invisible'
            };

        for (let index = 1; index <= maxValue; index++) {
            counter[index].count += counter[index - 1].count;
        }

        for (; ii < maxValue; ii++) {
            for (; x < counter[ii].count; x++) {
                verticalBarsOrder.push(helper.createBar(x, ii, barCustomOptions));
            }
        }

        for (; x < n; x++) {
            verticalBarsOrder.push(helper.createBar(x, ii, barCustomOptions));
        }

        return verticalBarsOrder
    }

    return {
        init: function (graphContainer) {
            clearInterval(interval);

            init = {};
            maxValue = 0;
            counter = {};
            sorted = {};
            stepDone = 0;
            maxValue = Math.max(...
                graphContainer.find('.bar-block')
                    .map(function () {
                        return parseInt(this.id);
                    }).get());
            n = graphContainer.find('.bar-block').length;

            graphContainer.find('.bar-block').each(function (index, $div) {
                init[index] = {
                    div: $($div),
                    val: parseInt($(this).attr('id')),
                };
                sorted[index] = {div: '', val: 0}
            });

            initCountingSortCode();
            initSortedContainer(n);
            initCounters();

            helper.changeCodeHighlight(3);
            helper.setVariableValue('counting_sort', 'i', 0);
            helper.setVariableValue('counting_sort', 'k', maxValue);
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
