define(['helper'], function (helper) {
    let collection = [], animationSpeed = 100, level = 0,
        N, k, quicksort;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);
        if (level === 0) {
            appendPartitionLevel(0, N);
            helper.setVariableValue('quick_sort', 'low', -1)
            helper.setVariableValue('quick_sort', 'high', N)
            quicksort = quick(-1, N);
        }
        quicksort.next()
    }

    function* quick(i, j) {
        if (i + 1 === N - 1 && j === N) {
            $('.graph-block .partition .partition-level').remove()
            return;
        }
        helper.increaseComparisonCounter()
        if (2 < Math.abs(j - i)) {
            yield* partition(i, j);
            yield k;
            appendPartitionLevel(i+1, k);
            yield* quick(i, k);
            removePartitionLevelG();
            appendPartitionLevel(k, j);
            yield* quick(k-1, j);
            removePartitionLevelG();
        }
    }

    function* partition(i, j) {
        let mid = Math.ceil((i + j) / 2),
            x = +collection[mid].val;

        if (i + 1 === j || mid === N - 1) {
            return;
        }
        markPivot(Math.ceil((i + j) / 2))
        loop(i, j, mid, x, 'low').then(function (result) {
            if (result) {
                k = result.i
            }
            helper.getStepButton().on('click', sortIteration);
        });
    }

    function loop(i, j, mid, x, loopFlag) {
        return loopCode(i, j, mid, x, loopFlag).then(function (result) {
            let i = result.i, j = result.j, mid = result.mid, x = result.x, loopFlag = result.loopFlag;

            return new Promise(function (resolve) {
                if(loopFlag === 'swap') {
                    if (i < j) {
                        return $(collection[i].div).animateSwap({
                            target: collection[j].div,
                            speed: animationSpeed,
                            opacity: "1",
                            callback: function () {
                                let y = collection[i];
                                collection[i] = collection[j];
                                collection[j] = y;

                                if (i === mid || j === mid) {
                                    mid = i + j - mid;
                                }

                                return resolve(loop(i, j, mid, x, 'low'));
                            }
                        })
                    } else {
                        resolve({'i':i, 'j': j, 'mid': mid, 'x': x})
                    }
                } else {
                    if(loopFlag === 'low' && +collection[i].val < x) {
                        return resolve(loop(i, j, mid, x, 'low'));
                    }
                    if(loopFlag === 'low' && +collection[i].val >= x) {
                        return resolve(loop(i, j, mid, x, 'high'));
                    }
                    if(loopFlag === 'high' && +collection[j].val > x) {
                        return resolve(loop(i, j, mid, x, 'high'));
                    }
                    if(loopFlag === 'high' && +collection[i].val >= x && +collection[j].val <= x) {
                        return resolve(loop(i, j, mid, x, 'swap'));
                    }
                }
            });
        });
    }

    function loopCode(i, j, mid, x, loopFlag) {
        return new Promise(function (resolve) {
            if (loopFlag === 'low') {
                resolve({'i': i+1, 'j': j, 'mid': mid, 'x': x,'loopFlag': 'low'})
            } else if(loopFlag === 'high') {
                resolve({'i': i, 'j': j-1, 'mid': mid, 'x': x,'loopFlag': 'high'})
            } else {
                if (i >= j) {
                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'loopFlag': 'swap'})
                } else {
                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'loopFlag': 'swap'})
                }
            }
        });
    }

    function appendPartitionLevel(i, j) {
        $('.graph-block .partition').append(createPartitionLevel(level, i, j))
        enablePartitionRangeField(level++, i, j)
    }

    function removePartitionLevelG() {
        return $('.graph-block .partition .partition-level[data-level=' + (--level) + ']').remove();
    }

    function createPartition() {
        return $('<div/>', {'class': 'partition'})
            .css({'width': '100%', 'height': '100px'});
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
        $('.graph .bar-block').removeClass('border border-success')
        collection[pivot].div.addClass('border border-success')
        helper.setVariableValue('partition', 'x', collection[pivot].val)
    }

    function initQuicksortCode() {
        var $codeBlockSort = $('<div/>', {'class': 'code-block'}),
            $codeBlockPartition = $('<div/>', {'class': 'code-block'}),
            codeStructureSort = [
                {'line': 'IF (1 < HIGH - LOW) {', 'tab': 0},
                {'line': 'Q = PARTITION(ARR, LOW, HIGH);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': 'QUICKSORT(ARR, LOW, Q);', 'tab': 1},
                {'line': 'QUICKSORT(ARR, Q - 1, HIGH);', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            codeVariables = {
                0: {'color': 'green', 'label': 'Q'},
                1: {'color': 'red', 'label': 'LOW'},
                2: {'color': 'blue', 'label': 'HIGH'}
            },
            codeStructurePartition = [
                {'line': 'X = ARR[N / 2];', 'tab': 0},
                {'line': 'WHILE ( ) {', 'tab': 0},
                {'line': 'DO ++LOW', 'tab': 1},
                {'line': 'WHILE (ARR[LOW] < X);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': 'DO --HIGH', 'tab': 1},
                {'line': 'WHILE (ARR[HIGH] > X);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 1},
                {'line': 'IF (LOW < HIGH)', 'tab': 1},
                {'line': 'SWAP(ARR[LOW], ARR[HIGH]);', 'tab': 2},
                {'line': 'ELSE       RETURN LOW;', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            partitionVariables = {
                0: {'color': 'green', 'label': 'X'},
                1: {'color': 'red', 'label': 'LOW'},
                2: {'color': 'blue', 'label': 'HIGH'}
            };

        helper.initCode(codeStructureSort, $codeBlockSort, 'quick sort', codeVariables);
        helper.initCode(codeStructurePartition, $codeBlockPartition, 'partition', partitionVariables);
        $('.code-container').append($codeBlockSort).append($codeBlockPartition)
    }

    return {
        init: function (graphContainer) {
            initQuicksortCode();
            collection = [];
            level = 0;
            k = null;
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
            return sortIteration
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
