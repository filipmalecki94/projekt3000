define(['helper'], function (helper) {
    let init = {},
        n = 0,
        maxValue = 0,
        counter = {},
        sorted = {},
        stepDone = 0,
        animationSpeed = 200,
        interval;

    function sortIteration() {
        let i = 0;

        helper.getStepButton().off('click', sortIteration);

        if (stepDone === 0) {
            interval = setInterval(function () {
                helper.setVariableValue('counting_sort','i', i)
                helper.changeCodeHighlight(5, function () {
                    helper.darkenBars(counter[i].div, function () {
                        helper.changeCodeHighlight(6)
                        if (i++ >= maxValue) {
                            clearInterval(interval);
                            stepDone = 1;
                            helper.setVariableValue('counting_sort','i', 0)
                            helper.changeCodeHighlight(8)
                            helper.getStepButton().on('click', sortIteration);
                        }
                    }, true);
                }, animationSpeed)
            }, animationSpeed * 1.5);

            return;
        }
        if (stepDone === 1) {
                interval = setInterval(function () {
                    helper.setVariableValue('counting_sort','i', i)
                    helper.changeCodeHighlight(8, function () {
                        ++counter[init[i].val].count;
                        helper.darkenBars(init[i].div, function () {
                            helper.changeCodeHighlight(9)
                            $('#' + init[i].val + '.bar-block-container').append(helper.createBar(0, init[i].val, {
                                'withNumbers': false,
                                'height': 50 / Math.max(...Object.values(getPreCountedInit())) + 'px',
                                'onlyBar': true,
                                'barWidth': '10px',
                                'customBarClasses': 'position-relative'
                            }));
                            if (++i >= n) {
                                clearInterval(interval);
                                stepDone = 2;
                                helper.darkenBars($('.graph .bar-block .bar'), null, true);
                                helper.setVariableValue('counting_sort','i', 1)
                                helper.changeCodeHighlight(11)
                                helper.getStepButton().on('click', sortIteration);
                            }
                        });
                    }, animationSpeed)
                }, animationSpeed * 1.5);

            return;
        }
        if (stepDone === 2) {
            i = 1;
            for (; i <= maxValue; i++) {
                counter[i].count += counter[i - 1].count;
            }
            $('.sorted').empty().removeClass('preset').append(getVerticalBarsOrder());
            i = 1;
            interval = setInterval(function () {
                let $counterBarBlock = $('.counter-bars #' + i + '.bar-block');

                helper.setVariableValue('counting_sort','i', i)
                helper.changeCodeHighlight(11, function () {
                    $('.sorted #' + i + ' .bar').removeClass('invisible');
                    helper.darkenBars($counterBarBlock, function () {
                        helper.changeCodeHighlight(12)
                        $counterBarBlock.addClass('border-bottom-red')
                        if (++i > maxValue) {
                            clearInterval(interval);
                            helper.darkenBars($('.graph .bar-block'), null, true);
                            helper.setVariableValue('counting_sort','i', n-1)
                            helper.changeCodeHighlight(14)
                            stepDone = 3;
                            helper.getStepButton().on('click', sortIteration);
                        }
                    });
                }, animationSpeed);
            }, animationSpeed * 1.75);

            return;
        }
        if (stepDone === 3) {
            helper.changeCodeHighlight([15, 16]);
            i = n - 1;
            interval = setInterval(function () {
                let e = --counter[init[i].val].count, values = [];

                helper.setVariableValue('counting_sort','i', i)
                helper.changeCodeHighlight(14, function () {
                    sorted[e].val = init[i].val;
                    sorted[e].div = init[i].div;

                    helper.darkenBars(init[i].div, function () {
                        helper.changeCodeHighlight(15)
                        $('.sorted .bar-block[data-index="' + e + '"] .bar')
                            .replaceWith(helper.createBar(e, sorted[e].val,
                                {
                                    'withNumbers': true,
                                    'onlyBar': true,
                                    'isOversize': n < 50
                                }))
                        if (i-- === 0) {
                            clearInterval(interval);
                            $.each(sorted, function (index, sor) {
                                values.push(sor.val)
                            });
                            $('.graph').empty();
                            $('.sorted').remove();
                            $('.counter-container').remove();
                            helper.setVariableValue('counting_sort','i', null)
                            helper.changeCodeHighlight([])
                            setTimeout(function () {
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
                            }, 100)
                            stepDone = 4;
                            helper.getStepButton().on('click', sortIteration);
                        }
                    });
                }, animationSpeed);
            }, animationSpeed * 1.5);
        }
    }

    function initCountingSortCode() {
        let $codeBlock = $('<div/>', {'class': 'code-block'}),
            codeStructure = [
                {'line': 'J = MAX(ARR);', 'tab': 0},
                {'line': 'N = COUNT(ARR);', 'tab': 0},
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
                0: {
                    'color': 'black',
                    'label': 'i'
                }
            };

        helper.initCode(codeStructure, $codeBlock, 'counting sort', variables);
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
                        'html': $('<div/>', {
                            'class': 'bar-block-container position-absolute',
                            'id': i
                        })
                    });

                counter[i] = {
                    div: $($counterLabelBlock).css('opacity',0),
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
            tempCounter[value.val] ? tempCounter[value.val] += 1 : tempCounter[value.val] = 1;
        });

        return tempCounter;
    }

    function getVerticalBarsOrder() {
        let i = 1,
            x = counter[i - 1].count,
            verticalBarsOrder = [],
            barCustomOptions = {
                'barWidth': '100%',
                'withNumbers': false,
                'height': '10px',
                'noBorder': true,
                'customBarClasses': 'invisible'
            };

        for (; i < maxValue; i++) {
            for (; x < counter[i].count; x++) {
                verticalBarsOrder.push(helper.createBar(x, i, barCustomOptions));
            }
        }
        for (; x < n; x++) {
            verticalBarsOrder.push(helper.createBar(x, i, barCustomOptions));
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
            stepDone = 0;
            clearInterval(interval);

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
