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
        if (1 < j - i) {
            yield* partition(i, j);
            yield k;
            helper.setVariableValue('quick_sort', 'low', i)
            helper.setVariableValue('quick_sort', 'high', k)
            appendPartitionLevel(i+1, k);
            yield* quick(i, k);
            removePartitionLevelG();
            helper.setVariableValue('quick_sort', 'low', k)
            helper.setVariableValue('quick_sort', 'high', j)
            appendPartitionLevel(k+1, j);
            yield* quick(k, j);
            removePartitionLevelG();
        }
    }

    function* partition(i, j) {
        let mid = Math.ceil((i + j) / 2),
            x = +collection[mid].val;

        helper.changeCodeHighlight(0, function () {
            if (i + 1 === j || mid === N - 1) {
                return;
            }
            helper.setVariableValue('partition','low',i)
            helper.setVariableValue('partition','high',j)
            helper.changeCodeHighlight(1,function (){
                markPivot(Math.ceil((i + j) / 2))
                helper.changeCodeHighlight(0, function () {
                    helper.changeCodeHighlight(1, function () {
                        loop(i, j, mid, x).then(function (result) {
                            if(result) {
                                k = result.i
                            }
                            helper.getStepButton().on('click', sortIteration);
                        });
                    }, animationSpeed, 'partition');
                }, animationSpeed, 'partition');
            },animationSpeed,'quick_sort')
        }, animationSpeed, 'quick_sort');
    }

    function loop(i, j, mid, x) {
        return helper.changeCodeHighlight(1,function (){
            helper.setVariableValue('partition','low',i+1)
            collection[i] && collection[i].div.css('background', 'unset')
            collection[i+1].div.css('background', 'red')
            helper.changeCodeHighlight(2, function () {
                return loopCode(i, j, mid, x).then(function (result) {
                    let i = result.i, j = result.j, mid = result.mid, x = result.x;

                    return new Promise(function (resolve) {
                        helper.changeCodeHighlight(8, function () {
                            if (i < j) {
                                helper.changeCodeHighlight(9, function () {}, null,'partition');
                                return $(collection[i].div).animateSwap({
                                    target: collection[j].div,
                                    speed: animationSpeed,
                                    opacity: "1",
                                    callback: function () {
                                        let y = collection[i];
                                        collection[i] = collection[j];
                                        collection[j] = y;

                                        collection[j].div.css('background','blue')
                                        collection[i].div.css('background','red')

                                        if (i === mid || j == mid) {
                                            mid = i + j - mid;
                                        }

                                        return resolve(loop(i, j, mid, x));
                                    }

                                }, animationSpeed, 'partition')
                            } else {
                                helper.setVariableValue('quick_sort','q',i)
                                helper.changeCodeHighlight(10, function () {
                                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x})
                                }, animationSpeed, 'partition')
                            }
                        }, animationSpeed, 'partition')
                    });
                });
            },animationSpeed, 'partition')
        },animationSpeed, 'partition')
    }

    function loopCode(i, j, mid, x) {
        return new Promise(function (resolve) {
            return helper.changeCodeHighlight(2, function () {
                let dupa = true;

                i++;

                let intrvl = setInterval(function () {
                    helper.changeCodeHighlight(3, function () {
                        if (i > j) {
                            clearInterval(intrvl)
                            helper.setVariableValue('partition', 'low', i)
                            helper.setVariableValue('partition', 'high', j)

                            collection[i-1] && collection[i-1].div.css('background', 'unset')
                            collection[j+1] && collection[j+1].div.css('background', 'unset')
                            resolve({'i': i, 'j': j, 'mid': mid, 'x': x})
                        } else if (+collection[i].val >= x &&  +collection[j].val <= x) {
                            clearInterval(intrvl)
                            helper.setVariableValue('partition', 'low', i)
                            helper.setVariableValue('partition', 'high', j)
                            collection[j+1] && collection[j+1].div.css('background', i >= j ? 'red' : 'unset')
                            collection[j].div.css('background', 'blue')
                            return helper.changeCodeHighlight(5, function () {
                                helper.changeCodeHighlight(6, function () {
                                    resolve({'i': i, 'j': j, 'mid': mid, 'x': x})
                                }, animationSpeed, 'partition')
                            }, animationSpeed, 'partition')
                        } else if (+collection[i].val >= x) {
                            helper.setVariableValue('partition', 'high', j-1)
                            collection[j] && collection[j].div.css('background', i >= j ? 'red' : 'unset')
                            collection[--j].div.css('background', 'blue')
                            helper.changeCodeHighlight(5, function () {
                                helper.changeCodeHighlight(6, function () {
                                    // dupa = false
                                }, animationSpeed, 'partition')
                            }, animationSpeed, 'partition')
                        } else {
                            if (+collection[i].val < x) {
                                let I = i;
                                if(+collection[i+1].val >= x) {
                                    j--;
                                    dupa = false;
                                }
                                helper.setVariableValue('partition', 'low', i+1)
                                collection[i] && collection[i].div.css('background', 'unset')
                                collection[++i].div.css('background', 'red')

                                return helper.changeCodeHighlight(2, function () {
                                    // ++i
                                }, animationSpeed, 'partition')
                            }
                        }
                    }, dupa ? animationSpeed : null, 'partition')
                }, animationSpeed * 3)
            }, null, 'partition')
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
                    'backgroundColor': 'rgb(0,255,0)',
                    'customBarBlockClasses': 'part',
                })
                    .css('visibility', 'hidden')
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
        helper.setVariableValue('partition','x', collection[pivot].val)
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

        helper.initCode(codeStructureSort, $codeBlockSort, 'quick sort',codeVariables);
        helper.initCode(codeStructurePartition, $codeBlockPartition , 'partition', partitionVariables);
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
