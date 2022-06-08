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
            console.log(collection)
            // collection[i] && collection[i].div.css('background', 'red')
            // collection[j] && collection[j].div.css('background', 'blue')
            yield* partition(i, j);
            yield k;
            appendPartitionLevel(i, k);
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
        // collection[i] && collection[i].div.css('background', 'unset')
        // collection[i + 1] && collection[i + 1].div.css('background', 'red')
        loop(i, j, mid, x, 'start').then(function (result) {
            console.log(result.i);
            if (result.i + 1 >= result.j) {
                // collection[result.i + 1] && collection[result.i + 1].div.css('background', result.i + 1 === result.j ? 'red' : 'unset')
            }
            if (result.j >= 0) {
                // collection[result.j].div.css('background', 'unset')
            }
            if (result) {
                k = result.i
            }
            helper.getStepButton().on('click', sortIteration);
        });
    }

    function loop(i, j, mid, x, switchLoop) {
        console.log(i,j)
        let flag = 'red';

        if (+collection[i] && +collection[i].val <= x && +collection[j] && +collection[j].val > x) {
            if (+collection[i].val > x) {
                flag = 'blue';
                // collection[j] && collection[j].div.css('background', 'unset')
                // collection[j - 1] && collection[j - 1].div.css('background', 'blue')
            }
        } else if (collection[i] && +collection[i].val >= x && collection[j - 1]) {
            flag = 'blue';
            // collection[j] && collection[j].div.css('background', j - 1 === i ? 'red' : 'unset')
            // collection[j - 1] && collection[j - 1].div.css('background', 'blue')
        } else if (collection[i + 1] && collection[i] && +collection[i].val < x) {
            flag = 'red';
            // collection[i] && collection[i].div.css('background', 'unset')
            // collection[i + 1] && collection[i + 1].div.css('background', 'red')
        }
        return loopCode((switchLoop === 'Start' || switchLoop === 'start' || flag === 'red') ? i + 1 : i, switchLoop !== 'Start' && flag === 'blue' ? j - 1 : j, mid, x, switchLoop).then(function (result) {
            let i = result.i, j = result.j, mid = result.mid, x = result.x, end = result.end;

            return new Promise(function (resolve) {
                if (end === true) {
                    if (i < j) {
                        return $(collection[i].div).animateSwap({
                            target: collection[j].div,
                            speed: animationSpeed,
                            opacity: "1",
                            callback: function () {
                                let y = collection[i];
                                collection[i] = collection[j];
                                collection[j] = y;

                                // collection[j].div.css('background', 'blue')
                                // collection[i].div.css('background', 'red')

                                if (i === mid || j === mid) {
                                    mid = i + j - mid;
                                }

                                return resolve(loop(i, j, mid, x, 'Start'));
                            }

                        })
                    } else {
                        resolve({'i':i, 'j': j, 'mid': mid, 'x': x})
                    }
                } else if (typeof end === 'undefined') {
                    return resolve(loop(i - 1, j, mid, x));
                } else if (end === 'XD') {
                    return resolve(loop(i, j + 1, mid, x, true));
                } else if (end === 'nic') {
                    return resolve(loop(i, j + 1, mid, x,false));
                } else {
                    return resolve(loop(i - 1, j, mid, x));
                }
            });
        });
    }

    function loopCode(i, j, mid, x, switchLoop) {
        return new Promise(function (resolve) {
            if (i >= j) {
                resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'end': true})
            } else if (+collection[i].val >= x && (typeof switchLoop !== 'undefined' && switchLoop !== 'start' && switchLoop !== 'Start') && collection[j] && +collection[j].val <= x) {
                resolve({'i': i, 'j': j, 'mid': mid, 'x': x, 'end': true})
            } else if (+collection[i].val >= x) {
                if (switchLoop === true) {
                    resolve({'i': i, 'j': j - 1, 'mid': mid, 'x': x, 'end': 'nic'})
                } else {
                    resolve({'i': i, 'j': j - 1, 'mid': mid, 'x': x, 'end': 'XD'})
                }
            } else {
                resolve({'i': i+1, 'j': j, 'mid': mid, 'x': x})
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
