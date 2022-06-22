define(['helper'], function (helper) {
    let collection = [], animationSpeed = 100, level = 0,
        N, q, quicksort;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);
        if (level === 0) {
            appendPartitionLevel(0, N);
            helper.setVariableValue('quick_sort', 'low', -1);
            helper.setVariableValue('quick_sort', 'high', N);
            quicksort = quick(-1, N);
        }
        quicksort.next();
    }

    function* quick(i, j) {
        $('.graph .bar-block').css('background', 'unset');
        helper.setVariableValue('quick_sort', 'low', i);
        helper.setVariableValue('quick_sort', 'high', j);

        if (1 < Math.abs(j - i - 1)) {
            collection[i] && collection[i].div.css('background', '#DC3545');
            collection[j] && collection[j].div.css('background', '#007BFF');

            yield* partition(i, j);
            yield q;

            appendPartitionLevel(i + 1, q);
            yield* quick(i, q);
            removePartitionLevelG();

            appendPartitionLevel(q, j);
            yield* quick(q - 1, j);
            removePartitionLevelG();
        }
    }

    function* partition(i, j) {
        let mid = Math.ceil((i + j) / 2),
            x = collection[mid].val;

        helper.changeCodeHighlight(0, function () {
            if (i + 1 === j || mid === N - 1) {
                $('.graph-block .partition').empty();
                $('.graph-block .graph .bar-block')
                    .removeClass('border border-success')
                    .css('background', 'unset');

                helper.changeCodeHighlight([]);
                helper.setVariableValue('quick_sort', 'q');
                helper.setVariableValue('quick_sort', 'low');
                helper.setVariableValue('quick_sort', 'high');
                helper.setVariableValue('partition', 'x');
                helper.setVariableValue('partition', 'low');
                helper.setVariableValue('partition', 'high');

                return;
            }
            helper.changeCodeHighlight(1, function () {
                markPivot(Math.ceil((i + j) / 2));
                helper.setVariableValue('partition', 'low', i);
                helper.setVariableValue('partition', 'high', j);
                helper.changeCodeHighlight(0, function () {
                    helper.changeCodeHighlight(2, function () {
                        loop(i, j, mid, x, 'low').then(function (result) {
                            if (result) {
                                helper.setVariableValue('quick_sort', 'q', result.i);
                                q = result.i;
                            }
                            helper.getStepButton().on('click', sortIteration);
                        });
                    }, animationSpeed, 'partition');
                }, animationSpeed, 'partition');
            }, animationSpeed, 'quick_sort');
        }, animationSpeed, 'quick_sort');
    }

    function loop(i, j, mid, x, loopFlag) {
        return loopCode(i, j, mid, x, loopFlag).then(function (result) {
            let i = result.i, j = result.j, mid = result.mid, x = result.x, loopFlag = result.loopFlag;

            return new Promise(function (resolve) {
                if (loopFlag === 'swap') {
                    helper.changeCodeHighlight(9, function () {
                        if (i < j) {
                            helper.changeCodeHighlight(10, function () {
                                return $(collection[i].div).animateSwap({
                                    target: collection[j].div,
                                    speed: animationSpeed,
                                    opacity: "1",
                                    callback: function () {
                                        let y = collection[i];
                                        collection[i] = collection[j];
                                        collection[j] = y;

                                        collection[i].div.css('background', '#DC3545');
                                        collection[j].div.css('background', '#007BFF');

                                        if (i === mid || j === mid) {
                                            mid = i + j - mid;
                                        }

                                        return helper.changeCodeHighlight(2, function () {
                                            return resolve(loop(i, j, mid, x, 'low'));
                                        }, animationSpeed, 'partition');
                                    }
                                });
                            }, animationSpeed, 'partition');
                        } else {
                            helper.changeCodeHighlight(11, function () {
                                helper.changeCodeHighlight(12, function () {
                                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x});
                                }, animationSpeed, 'partition');
                            }, animationSpeed, 'partition');
                        }
                    }, animationSpeed, 'partition');
                } else {
                    if (loopFlag === 'low' && collection[i].val < x) {
                        return helper.changeCodeHighlight(4, function () {
                            helper.increaseComparisonCounter();

                            return resolve(loop(i, j, mid, x, 'low'));
                        }, animationSpeed, 'partition');
                    }
                    if (loopFlag === 'low' && collection[i].val >= x) {
                        return helper.changeCodeHighlight(4, function () {
                            helper.increaseComparisonCounter();

                            return resolve(loop(i, j, mid, x, 'high'));
                        }, animationSpeed, 'partition');
                    }
                    if (loopFlag === 'high' && collection[j].val > x) {
                        return helper.changeCodeHighlight(7, function () {
                            helper.increaseComparisonCounter();

                            return resolve(loop(i, j, mid, x, 'high'));
                        }, animationSpeed, 'partition');
                    }
                    if (loopFlag === 'high' && collection[i].val >= x && collection[j].val <= x) {
                        return helper.changeCodeHighlight(7, function () {
                            return resolve(loop(i, j, mid, x, 'swap'));
                        }, animationSpeed, 'partition');
                    }
                }
            });
        });
    }

    function loopCode(i, j, mid, x, loopFlag) {
        return new Promise(function (resolve) {
            if (loopFlag === 'low') {
                helper.setVariableValue('partition', 'low', i + 1);
                collection[i] && collection[i].div.css('background', j <= i ? '#007BFF' : 'unset');
                collection[i + 1] && collection[i + 1].div.css('background', j === i + 1 ? 'linear-gradient(45deg, #007BFF 50%, #DC3545 50%)' : '#DC3545');
                helper.changeCodeHighlight(3, function () {
                    resolve({'i': i + 1, 'j': j, 'mid': mid, 'x': x, 'loopFlag': 'low'});
                }, animationSpeed, 'partition');
            } else if (loopFlag === 'high') {
                helper.setVariableValue('partition', 'high', j - 1);
                collection[j] && collection[j].div.css('background', j === i ? '#DC3545' : 'unset');
                collection[j - 1] && collection[j - 1].div.css('background', j - 1 === i ? 'linear-gradient(45deg, #007BFF 50%, #DC3545 50%)' : '#007BFF');
                helper.changeCodeHighlight(6, function () {
                    resolve({'i': i, 'j': j - 1, 'mid': mid, 'x': x, 'loopFlag': 'high'});
                }, animationSpeed, 'partition');
            } else {
                if (i >= j) {
                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'loopFlag': 'swap'});
                } else {
                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'loopFlag': 'swap'});
                }
            }
        });
    }

    function appendPartitionLevel(i, j) {
        $('.graph-block .partition').append(createPartitionLevel(level, i, j));
        enablePartitionRangeField(level++, i, j);
    }

    function removePartitionLevelG() {
        return $('.graph-block .partition .partition-level[data-level=' + (--level) + ']').remove();
    }

    function createPartition() {
        return $('<div/>', {'class': 'partition'}).css({'width': '100%', 'height': '100px'});
    }

    function createPartitionLevel(level, i, j) {
        let $partitionLevel = $('<div/>', {'class': 'partition-level d-flex'})
            .css({'width': '100%', 'height': '1px', 'margin-bottom': '4px'})
            .attr('data-level', level);

        for (let i = 0; i < N; i++) {
            $partitionLevel.append(helper.createBar(i, 1, {
                    'height': '100%',
                    'noBorder': true,
                    'barWidth': '100%',
                    'backgroundColor': '#ffc800',
                    'customBarBlockClasses': 'part',
                }).css('visibility', 'hidden')
            );
        }

        return $partitionLevel;
    }

    function enablePartitionRangeField(level = 0, from = 0, to = 0, turnOn = true) {
        let $partitionLevel = $('.partition-level[data-level=' + level + ']');

        for (let i = from; i < to; i++) {
            $partitionLevel.find('.bar-block[data-index=' + i + ']').css('visibility', 'visible');
        }
    }

    function markPivot(pivot) {
        $('.graph .bar-block').removeClass('border border-success');
        collection[pivot].div.addClass('border border-success');
        helper.setVariableValue('partition', 'x', collection[pivot].val);
    }

    function initQuicksortCode() {
        let $codeBlockSort = $('<div/>', {'class': 'code-block'}),
            $codeBlockPartition = $('<div/>', {'class': 'code-block'}),
            codeStructureSort = [
                {'line': 'IF (1 < HIGH - LOW) {', 'tab': 0},
                {'line': '  Q = PARTITION(ARR, LOW, HIGH);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': '  QUICKSORT(ARR, LOW, Q);', 'tab': 1},
                {'line': '  QUICKSORT(ARR, Q - 1, HIGH);', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            codeVariables = {
                0: {'color': '#28A745', 'label': 'Q'},
                1: {'color': '#DC3545', 'label': 'LOW'},
                2: {'color': '#007BFF', 'label': 'HIGH'}
            },
            codeStructurePartition = [
                {'line': 'X = ARR[N / 2];', 'tab': 0},
                {'line': '&nbsp;', 'tab': 1},
                {'line': 'WHILE ( ) {', 'tab': 0},
                {'line': '  DO ++LOW', 'tab': 1},
                {'line': '  WHILE (ARR[LOW] < X);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': '  DO --HIGH', 'tab': 1},
                {'line': '  WHILE (ARR[HIGH] > X);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': '  IF (LOW < HIGH)', 'tab': 1},
                {'line': '      SWAP(ARR[LOW], ARR[HIGH]);', 'tab': 2},
                {'line': '  ELSE', 'tab': 1},
                {'line': '      RETURN LOW;', 'tab': 2},
                {'line': '}', 'tab': 0},
            ],
            partitionVariables = {
                0: {'color': '#28A745', 'label': 'X'},
                1: {'color': '#DC3545', 'label': 'LOW'},
                2: {'color': '#007BFF', 'label': 'HIGH'}
            };

        helper.initCode(codeStructureSort, $codeBlockSort, 'QUICK_SORT (ARR, LOW, HIGH)', codeVariables);
        helper.initCode(codeStructurePartition, $codeBlockPartition, 'PARTITION (ARR, LOW, HIGH)', partitionVariables);
        $('.code-container').append($codeBlockSort).append($codeBlockPartition);
    }

    return {
        init: function (graphContainer) {
            initQuicksortCode();
            collection = [];
            level = 0;
            q = null;
            N = graphContainer.find('.bar-block').length;
            $('.graph').before(createPartition());
            graphContainer.find('.bar-block').each(function (index, $div) {
                collection[index] = {
                    div: $($div),
                    val: parseInt($(this).attr('id'))
                };
            });
            helper.getStepButton().on('click', sortIteration);

            return this;
        },
        sortIteration: function () {
            return sortIteration;
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
