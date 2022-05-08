define(['helper'], function (helper) {
    let init = {},
        n = 0,
        maxValue = 0,
        counter = {},
        sorted = {},
        stepDone = 1,
        animationSpeed = 200,
        interval;

    function sortIteration() {
        let i = 0;

        helper.getStepButton().off('click', sortIteration);
        if (stepDone === 1) {
            helper.changeCodeHighlight([9, 10])
            interval = setInterval(function () {
                ++counter[init[i].val].count;
                helper.darkenBars(init[i].div, function () {
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
                        helper.getStepButton().on('click', sortIteration);
                    }
                });
            }, animationSpeed * 1.5);

            return;
        }
        if (stepDone === 2) {
            i = 1;
            for (; i <= maxValue; i++) {
                counter[i].count += counter[i - 1].count;
            }
            $('.sorted').empty().removeClass('preset').append(getVerticalBarsOrder());
            helper.changeCodeHighlight([12, 13]);
            i = 0;
            interval = setInterval(function () {
                $('.sorted #' + i + ' .bar').removeClass('invisible');
                helper.darkenBars($('.counter-bars #' + i + '.bar-block'));
                $('.counter-bars #' + i + '.bar-block').css('border-bottom', '1px solid red')
                if (i++ > maxValue) {
                    clearInterval(interval);
                    helper.darkenBars($('.graph .bar-block'), null, true);
                    stepDone = 3;
                    helper.getStepButton().on('click', sortIteration);
                }
            }, animationSpeed * 1.75);

            return;
        }
        if (stepDone === 3) {
            helper.changeCodeHighlight([15, 16]);
            i = n - 1;
            interval = setInterval(function () {
                let e = --counter[init[i].val].count, values = [];

                sorted[e].val = init[i].val;
                sorted[e].div = init[i].div;

                helper.darkenBars(init[i].div, function () {
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
            }, animationSpeed * 1.5);
        }
    }

    function initCountingSortCode() {
        let $codeField = $('<div/>', {'class': 'code m-1'}),
            codeStructure = [
                {'line': 'int k=max(arr);', 'tab': 0},
                {'line': 'int n=count(arr);', 'tab': 0},
                {'line': 'int i;', 'tab': 0},
                {'line': 'int counter[k + 1];', 'tab': 0},
                {'line': 'int sorted[k + 1];', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'for(i = 0; i < k; i++)', 'tab': 0},
                {'line': 'counter[i] = 0;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'for(i = 0; i < n; i++)', 'tab': 0},
                {'line': 'counter[arr[i]]++;', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'for(i = 1; i < k; i++)', 'tab': 0},
                {'line': 'counter[i] += counter[i-1];', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'for(i = n-1; i >= 0; i--)', 'tab': 0},
                {'line': 'sorted[--counter[arr[i]]] = arr[i];', 'tab': 1},
            ];

        helper.initCode(codeStructure, $codeField);
        $('.code-block').append($codeField);
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
                            'isOversize': maxValue >= 20,
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
                    div: $($counterLabelBlock),
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
            stepDone = 1;
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
