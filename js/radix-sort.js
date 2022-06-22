define(['helper'], function (helper) {
    let init = {},
        n = 0,
        maxValue = 0,
        counter = {},
        sorted = {},
        stepDone = 1,
        animationSpeed = 200,
        digit = 0,
        i = 0;

    function sortIteration() {

        helper.setVariableValue('counting_sort','digit', Math.pow(10, digit))
        helper.getStepButton().off('click', sortIteration);
        if (stepDone === 1) {
            $.each(init, function (i, e) {
                helper.darkenBars(e.div.find('.bar').not('[digit-id="' + digit + '"]'));
            });
            helper.darkenBars(init[i].div, function () {
                $('#' + helper.getXDigit(init[i].val, digit) + '.bar-block-container').prepend(helper.createBar(0, init[i].val, {
                    'withNumbers': false,
                    'height': 50 / Math.max(...Object.values(getPreCountedInit())) + 'px',
                    'onlyBar': true,
                    'barWidth': '10px',
                    'customBarClasses': 'position-relative ',
                    'backgroundColor': helper.getHslValue(100 * helper.getXDigit(init[i].val, digit) / (helper.getMaxValue(10)), 100, 350)
                }));
                ++counter[helper.getXDigit(init[i].val, digit)].count;
                helper.changeCodeHighlight(7, function () {
                    if (++i < n) {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(6, function () {
                            helper.getStepButton().on('click', sortIteration);
                        }, animationSpeed);
                    } else {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(6, function () {
                            helper.darkenBars($('.counter-container .counter-bars .bar-block[data-index="0"]'),function (){
                                helper.setVariableValue('counting_sort', 'i', 1);
                                $('.counter-container .counter-labels .bar-block[data-index="0"]').addClass('border-bottom-red');
                                for (let ii = 1; ii < 10; ii++) {
                                    counter[ii].count += counter[ii - 1].count;
                                }
                                $('.sorted').empty().removeClass('preset').append(getVerticalBarsOrder());
                                helper.changeCodeHighlight(9, function () {
                                    if (counter[0].count > 0) {
                                        $('.sorted #0 .bar').removeClass('invisible');
                                    }
                                    stepDone = 2;
                                    i = 1;
                                    helper.darkenBars($('.graph .bar-block .bar'), null, true, animationSpeed);
                                    helper.getStepButton().on('click', sortIteration);
                                }, animationSpeed);
                            },false, animationSpeed);
                        }, animationSpeed);
                    }
                }, animationSpeed);

            }, false, animationSpeed);

            return;
        }
        if (stepDone === 2) {
            helper.darkenBars($('.counter-container .counter-bars .bar-block[data-index="' + i + '"]'), function () {
                $('.sorted #' + i + ' .bar').removeClass('invisible');
                $('.counter-container .counter-labels .bar-block[data-index="' + i + '"]').addClass('border-bottom-red');
                helper.changeCodeHighlight(10, function () {
                    if (++i <= 9) {
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
                                helper.darkenBars($('.graph .bar-block'), null, true, animationSpeed);
                                $.each(init, function (i, e) {
                                    helper.darkenBars(e.div.find('.bar').not('[digit-id="' + digit + '"]'));
                                });
                                helper.getStepButton().on('click', sortIteration);
                            }, animationSpeed);
                        }, animationSpeed);
                    }
                }, animationSpeed);
            },false, animationSpeed);

            return;
        }
        if (stepDone === 3) {
            let e = --counter[helper.getXDigit(init[i].val, digit)].count, $bar = init[i].div.clone(), values = [];

            helper.darkenBars(init[i].div, function () {
                sorted[e].val = init[i].val;
                sorted[e].div = init[i].div;
                $bar.find('.bar').addClass('done');
                helper.changeCodeHighlight(13, function () {
                    $('.sorted .bar-block[data-index="' + e + '"] .bar').not('.done').closest('.bar-block').replaceWith($bar);
                    if (i-- === 0) {
                        init = {};
                        i = 0;
                        stepDone = ((++digit > (helper.getMaxValue().toString().split('').map(Number).length - 1)) ? 4 : 1)

                        $.each(sorted, function (index, sor) {
                            values.push(sor.val)
                        });

                        helper.setVariableValue('counting_sort', 'i', null);
                        $('.graph').empty();
                        helper.changeCodeHighlight(12, function () {
                            $('.graph').animateSwap({
                                target: $('.sorted'),
                                speed: 1500,
                                opacity: 1,
                                callback: function () {
                                    $('.graph').removeAttr('style');
                                    $('.sorted').remove();
                                    $('.counter-container').remove();
                                    $.each(helper.createBars($('.graph'), values,
                                        {
                                            'withNumbers': true,
                                            'multidigit': true,
                                            'fillWithZeros': true
                                        }
                                    ).find('.bar-block'), function (index, $div) {
                                        init[index] = {
                                            div: $($div),
                                            val: parseInt($(this).attr('id')),
                                        }
                                        sorted[index] = {div: '', val: 0}
                                    });

                                    initSortedContainer(n);
                                    initCounters();
                                    helper.changeCodeHighlight([], function () {
                                        helper.getStepButton().on('click', sortIteration);
                                    }, animationSpeed);
                                }
                            });
                        }, animationSpeed);
                    } else {
                        helper.setVariableValue('counting_sort', 'i', i);
                        helper.changeCodeHighlight(12, function () {
                            helper.getStepButton().on('click', sortIteration);
                        });
                    }
                }, animationSpeed);
            }, false, animationSpeed, 0.0001);
        }
    }

    function initCountingSortCode() {
        let $codeBlock = $('<div/>', {'class': 'code-block'}),
            countingSortStructure = [
                {'line': 'COUNTER[10];', 'tab': 0},
                {'line': 'SORTED[K + 1];', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 0; I < 10; I++)', 'tab': 0},
                {'line': 'COUNTER[I] = 0;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 0; I < N; I++)', 'tab': 0},
                {'line': 'COUNTER[ARR[I]]++;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = 1; I < 10; I++)', 'tab': 0},
                {'line': 'COUNTER[I] += COUNTER[I-1];', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR (I = N-1; I >= 0; I--)', 'tab': 0},
                {'line': 'SORTED[--COUNTER[ARR[I]]] = ARR[I];', 'tab': 1},
            ],
            variables = {
                0: {'color': 'black', 'label': 'I'},
                1: {'color': 'grey', 'label': 'DIGIT'}
            };

        helper.initCode(countingSortStructure, $codeBlock, 'counting_sort', variables);
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
            for (let i = 0; i < 10; i++) {
                let $counterLabelBlock = helper.createBar(i, i,
                        {
                            'withNumbers': true,
                            'isOversize': false,
                            'glueToTop': true,
                            'forceMaxValue': 10
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
                    div: $($counterLabelBlock),
                    count: 0,
                    val: i
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
            .append($('<div/>', {'class': 'sorted preset d-flex justify-content-around'})
                .append(function () {
                    let slots = [];
                    for (let i = 0; i < n; i++) {
                        slots.push(helper.createBar(i, i, {
                                'barWidth': '100%',
                                'noBorder': false,
                                'height': '10px',
                                'customBarClasses': 'invisible'
                            }
                        ))
                    }
                    return slots;
                }));
    }

    function getPreCountedInit() {
        let tempCounter = {};

        $.each(init, function (key, value) {
            tempCounter[helper.getXDigit(value.val, digit)] ? tempCounter[helper.getXDigit(value.val, digit)] += 1 : tempCounter[helper.getXDigit(value.val, digit)] = 1;
        });

        return tempCounter;
    }

    function getVerticalBarsOrder() {
        let i = 0,
            x = 0,
            verticalBarsOrder = [],
            barCustomOptions = {
                'barWidth': '100%',
                'withNumbers': false,
                'height': '10px',
                'noBorder': true,
                'customBarClasses': 'invisible',
                'forceMaxValue': 10
            };

        for (; i < 10; i++) {
            for (; x < counter[i].count; x++) {
                verticalBarsOrder.push(helper.createBar(x, i, barCustomOptions));
            }
        }

        return verticalBarsOrder
    }

    return {
        init: function (graphContainer) {
            init = {};
            n = 0;
            maxValue = 0;
            counter = {};
            sorted = {};
            stepDone = 1;
            digit = 0;

            initCountingSortCode();
            maxValue = Math.max(...graphContainer.find('.bar-block')
                .map(function () {
                    return parseInt(this.id);
                })
                .get());
            n = graphContainer.find('.bar-block').length;
            graphContainer.find('.bar-block').each(function (index, $div) {
                init[index] = {
                    div: $($div),
                    val: parseInt($(this).attr('id')),
                };
                sorted[index] = {div: '', val: 0}
            });
            initSortedContainer(n);
            initCounters();
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
