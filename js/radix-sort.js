define(['helper'], function (helper) {
    let init = {},
        n = 0,
        maxValue = 0,
        counter = {},
        sorted = {},
        stepDone = 1,
        animationSpeed = 200,
        digit = 0,
        interval;

    function sortIteration() {
        let i = 0;

        helper.getStepButton().off('click', sortIteration);
        if (stepDone === 1) {
            helper.changeCodeHighlight([9, 10])

            $.each(init, function (i, e) {
                helper.darkenBars(e.div.find('.bar').not('[digit-id="' + digit + '"]'));
            });

            interval = setInterval(function () {
                ++counter[helper.getXDigit(init[i].val, digit)].count;
                helper.darkenBars(init[i].div, function () {
                    $('#' + helper.getXDigit(init[i].val, digit) + '.bar-block-container').prepend(helper.createBar(0, init[i].val, {
                        'withNumbers': false,
                        'height': 50 / Math.max(...Object.values(getPreCountedInit())) + 'px',
                        'onlyBar': true,
                        'barWidth': '10px',
                        'customBarClasses': 'position-relative ',
                        'backgroundColor': helper.getHslValue(100 * helper.getXDigit(init[i].val, digit) / (helper.getMaxValue(10)), 100, 350)
                    }));
                    if (++i >= n) {
                        clearInterval(interval);
                        stepDone = 2;
                        helper.getStepButton().on('click', sortIteration);
                    }
                });
            }, animationSpeed * 1.5);

            return;
        }
        if (stepDone === 2) {
            i = 1;
            for (; i < 10; i++) {
                counter[i].count += counter[i - 1].count;
            }
            $('.sorted').empty().removeClass('preset').append(getVerticalBarsOrder());
            helper.changeCodeHighlight([12, 13]);
            i = 0;
            interval = setInterval(function () {
                let $counterBarBlock = $('.counter-bars #' + i + '.bar-block');

                $('.sorted #' + i + ' .bar').removeClass('invisible');
                helper.darkenBars($counterBarBlock);
                $counterBarBlock.css('border-bottom', '1px solid red')
                if (i++ > 10) {
                    clearInterval(interval);
                    helper.darkenBars($('.graph .bar-block'), null, true);
                    $.each(init, function (i, e) {
                        helper.darkenBars(e.div.find('.bar').not('[digit-id="' + digit + '"]'));
                    });
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
                let e = --counter[helper.getXDigit(init[i].val, digit)].count, $bar = init[i].div.clone(), values = [];

                sorted[e].val = init[i].val;
                sorted[e].div = init[i].div;

                $bar.find('.bar').addClass('done');
                $('.sorted .bar-block[data-index="' + e + '"] .bar').not('.done').replaceWith($bar);
                init[i].div.addClass('invisible')
                if (i-- === 0) {
                    clearInterval(interval);
                    init = {};
                    stepDone = ((++digit > (helper.getMaxValue().toString().split('').map(Number).length - 1)) ? 4 : 1)

                    $.each(sorted, function (index, sor) {
                        values.push(sor.val)
                    });
                    $('.graph').empty();
                    $('.sorted').remove();
                    $('.counter-container').remove();
                    setTimeout(function () {
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

                        initSortedContainer();
                        initCounters();
                    }, 100)
                    helper.getStepButton().on('click', sortIteration);
                }
            }, animationSpeed * 1.5);
        }
    }

    function initCountingSortCode() {
        let $codeBlock = $('<div/>', {'class': 'code-block'}),
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

        helper.initCode(codeStructure, $codeBlock, 'radix sort');
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
