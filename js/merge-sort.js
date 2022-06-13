define(['helper'], function (helper) {
    let init = {},
        buffer = {},
        animationSpeed = 100,
        level, maxValue, N, n, k, C, itemsInBufferContainer, masterI, masterJ, masterL;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration)

        $('.graph #' + (C * 2) + '.buffer-container').addClass('merged')
        $('.graph #' + (C * 2 + 1) + '.buffer-container').addClass('merged')
        helper.setVariableValue('mergesort', 'k', k)
        helper.setVariableValue('mergesort', 'n', n)
        return helper.changeCodeHighlight(6, function () {
            helper.setVariableValue('merge', 'i', masterI)
            helper.setVariableValue('merge', 'j', masterJ)
            helper.setVariableValue('merge', 'l', masterL)
            $('.graph .bar-block[data-index="'+masterI+'"]').css('background','red')
            $('.graph .bar-block[data-index="'+masterJ+'"]').css('background','blue')
            $('.buffer .bar-block[data-index="'+masterL+'"]').css('border','1px solid green')

            helper.changeCodeHighlight(4, function () {
                loop(masterI, masterJ, masterL, 'first').then(function (res) {
                    let I = res['i'], J = res['j'], L = res['l'];

                    $('.graph #' + (C * 2) + '.buffer-container').addClass('border-black')
                    $('.graph #' + (C * 2) + '.buffer-container').removeClass('merged border-buffer')
                    $('.graph #' + (C * 2 + 1) + '.buffer-container').addClass('border-black')
                    $('.graph #' + (C * 2 + 1) + '.buffer-container').removeClass('merged border-buffer')
                    C++;
                    n = (C + 1) * itemsInBufferContainer;
                    k = n / 2 + (C) * itemsInBufferContainer / 2;
                    masterI = (C) * itemsInBufferContainer;
                    masterJ = k;
                    masterL = L

                    helper.changeCodeHighlight(-1, function () {
                        if (C >= Math.ceil(N / itemsInBufferContainer)) { // loopFlag = end
                            for (let x = J; x < N; x++ && L++) {
                                if (init[L]) {
                                    buffer[x].val = init[L].val
                                    $('.graph').find('.bar-block[data-index="' + L + '"]').css('visibility', 'hidden')
                                }
                            }

                            helper.changeCodeHighlight([8, 9], function () {
                                init = buffer;
                                $('.graph').html($('.buffer').html())
                                $('.buffer').remove()
                                buffer = {};

                                level++;

                                initBuffer(itemsInBufferContainer)
                                C = 0
                                itemsInBufferContainer = itemsInBufferContainer * 2
                                n = itemsInBufferContainer
                                k = n / 2 + C;
                                masterI = 0;
                                masterJ = k;
                                masterL = 0;

                                helper.changeCodeHighlight(-1, function () {
                                    helper.getStepButton().on('click', sortIteration)
                                    if (k >= N) {
                                        $('.buffer').remove()
                                        $('.graph .buffer-container').removeClass('border border-buffer')
                                        helper.getStepButton().off('click', sortIteration);
                                    }
                                }, animationSpeed, 'mergesort')
                            }, animationSpeed, 'mergesort')
                        } else {
                            helper.getStepButton().on('click', sortIteration)
                        }
                    }, animationSpeed, 'merge')
                });
            }, animationSpeed, 'merge');
        }, animationSpeed, 'mergesort');
    }

    function loop(I, J, L, loopFlag) {
        return loopCode(I, J, L, loopFlag).then(function (result) {
            let I = result['i'], J = result['j'], L = result['l'], loopFlag = result['loopFlag'];

            return new Promise(function (resolve) {
                if (loopFlag === 'firstA') {
                    let lf = 'last';
                    buffer[L].val = init[I].val;
                    buffer[L].div = moveToBuffer(L, I)
                    $('.graph').find('.bar-block[data-index="' + I + '"]').css('visibility', 'hidden')

                    helper.setVariableValue('merge', 'i', I + 1)
                    helper.setVariableValue('merge', 'j', J)
                    helper.setVariableValue('merge', 'l', L + 1)
                    $('.graph .bar-block[data-index="'+I+'"]').css('background','unset')
                    $('.graph .bar-block[data-index="'+(I+1)+'"]').css('background','red')
                    $('.buffer .bar-block[data-index="'+L+'"]').css('border','unset')
                    $('.buffer .bar-block[data-index="'+(L+1)+'"]').css('border','1px solid green')
                    helper.changeCodeHighlight(6, function () {
                        if (typeof init[I + 1] !== 'undefined' && (I + 1) < k && J < n) {
                            helper.changeCodeHighlight(4, function () {
                                resolve(loop(I + 1, J, L + 1, 'first'));
                            }, animationSpeed, 'merge');
                        } else if (typeof init[I + 1] !== 'undefined' && (I + 1) < k) {
                            helper.changeCodeHighlight(4, function () {
                                resolve(loop(I + 1, J, L + 1, 'second'));
                            }, animationSpeed, 'merge');
                        } else {
                            helper.changeCodeHighlight(4, function () {
                                helper.changeCodeHighlight(10, function () {
                                    resolve(loop(I + 1, J, L + 1, 'last'));
                                }, animationSpeed, 'merge');
                            }, animationSpeed, 'merge');
                        }
                    }, animationSpeed, 'merge');
                } else if (loopFlag === 'firstB') {
                    buffer[L].val = init[J].val;
                    buffer[L].div = moveToBuffer(L, J)
                    $('.graph').find('.bar-block[data-index="' + J + '"]').css('visibility', 'hidden')

                    helper.setVariableValue('merge', 'i', I)
                    helper.setVariableValue('merge', 'j', (I) < k ? J + 1 : J)
                    helper.setVariableValue('merge', 'l', L + 1)
                    $('.graph .bar-block[data-index="'+J+'"]').css('background','unset')
                    $('.graph .bar-block[data-index="'+((I) < k ? J + 1 : J)+'"]').css('background','blue')
                    $('.buffer .bar-block[data-index="'+L+'"]').css('border','unset')
                    $('.buffer .bar-block[data-index="'+(L+1)+'"]').css('border','1px solid green')
                    helper.changeCodeHighlight(8, function () {
                            if(I < k && (J + 1) < n) {
                                helper.changeCodeHighlight(4, function () {
                                    resolve(loop(I, ((I) < k ? J + 1 : J), L + 1, 'first'));
                                }, animationSpeed, 'merge');
                            } else if (I < k) {
                                helper.changeCodeHighlight(4, function () {
                                    resolve(loop(I, J + 1, L + 1, 'second'));
                                }, animationSpeed, 'merge');
                            } else {
                                helper.changeCodeHighlight(4, function () {
                                    helper.changeCodeHighlight(10, function () {
                                        resolve(loop(I, J, L + 1, 'last'));
                                    }, animationSpeed, 'merge');
                                }, animationSpeed, 'merge');
                            }
                    }, animationSpeed, 'merge');
                } else if (loopFlag === 'second') {
                    buffer[L].val = init[I].val;
                    buffer[L].div = moveToBuffer(L, I)
                    $('.graph').find('.bar-block[data-index="' + I + '"]').css('visibility', 'hidden')

                    helper.setVariableValue('merge', 'i', (I + 1) < k ? I + 1 : I)
                    helper.setVariableValue('merge', 'j', J)
                    helper.setVariableValue('merge', 'l', L + 1)
                    $('.graph .bar-block[data-index="'+I+'"]').css('background','unset')
                    $('.graph .bar-block[data-index="'+((I + 1) < k ? I + 1 : I)+'"]').css('background','red')
                    $('.buffer .bar-block[data-index="'+L+'"]').css('border','unset')
                    $('.buffer .bar-block[data-index="'+(L+1)+'"]').css('border','1px solid green')
                    helper.changeCodeHighlight(11, function () {
                        helper.changeCodeHighlight((I + 1) < k ? 10 : 13, function () {
                            resolve(loop((I + 1) < k ? I + 1 : I, J, L + 1, (I + 1) < k ? 'second' : 'last'));
                        }, animationSpeed, 'merge');
                    }, animationSpeed, 'merge');
                } else {
                    if (typeof init[J] !== 'undefined' && (J) < n) {

                        helper.changeCodeHighlight(14, function () {
                            buffer[J].val = init[J].val
                            buffer[J].div = moveToBuffer(L, J, J + 1 < n)
                            $('.graph').find('.bar-block[data-index="' + (J) + '"]').css('visibility', 'hidden')
                            helper.setVariableValue('merge', 'i', I)
                            helper.setVariableValue('merge', 'j', J + 1)
                            helper.setVariableValue('merge', 'l', L + 1)
                            $('.graph .bar-block[data-index="'+J+'"]').css('background','unset')
                            $('.graph .bar-block[data-index="'+(J+1)+'"]').css('background','blue')
                            $('.buffer .bar-block[data-index="'+L+'"]').css('border','unset')
                            $('.buffer .bar-block[data-index="'+(L+1)+'"]').css('border','1px solid green')
                            resolve(loop(I, J + 1, L + 1, 'last'));
                        }, animationSpeed, 'merge');
                    } else {
                        return resolve({'i': I, 'j': J, 'l': L});
                    }
                }
            })
        });
    }

    function loopCode(I, J, L, loopFlag) {
        return new Promise(function (resolve) {
            if (loopFlag === 'first') {
                helper.changeCodeHighlight(5, function () {
                    if (typeof init[J] === 'undefined' || init[I].val <= init[J].val) {
                        resolve({'i': I, 'j': J, 'l': L, 'loopFlag': 'firstA'});
                    } else {
                        helper.changeCodeHighlight(7, function () {
                            resolve({'i': I, 'j': J, 'l': L, 'loopFlag': 'firstB'});
                        }, animationSpeed, 'merge')
                    }
                }, animationSpeed, 'merge')
            } else if (loopFlag === 'second') {
                helper.changeCodeHighlight(10, function () {
                    resolve({'i': I, 'j': J, 'l': L, 'loopFlag': 'second'});
                }, animationSpeed, 'merge')
            } else {
                helper.changeCodeHighlight([13], function () {
                    resolve({'i': I, 'j': J, 'l': L, 'loopFlag': 'last'});
                }, animationSpeed, 'merge')
            }
        });
    }

    function moveToBuffer(L, X) {
        let id = parseInt($('.graph').find('.bar-block[data-index="' + X + '"]').attr('id')),
            $bar = helper.createBar(L, init[X].val, {
                'withNumbers': N < 50,
                'noOrder': true,
                'customBarBlockClasses': 'buffer-container',
                'noBorder': true,
                'isOversize': N > 50,
                'barBlockId': id,
                'hideBarBlock': id === -1
            });

        $('.buffer').find('.bar-block[data-index="' + L + '"]').last().replaceWith($bar)

        return $bar;
    }

    function initBuffer(itemsInBufferContainer) {
        let $bufferContainer,
            bufferContainers = [],
            $buffer = $('<div/>', {
                'class': 'buffer d-flex justify-content-around '
            }),
            bufferContainerIndex = -1;


        for (let i = 0; i < N; i++) {
            buffer[i] = {
                div: helper.createBar(i, i, {
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container',
                    'noBorder': true,
                    'height': '0'
                }),
                val: 0
            }
        }

        for (let i = 0; i < N; i++) {
            let bufferContainerBarIndex = itemsInBufferContainer ? i % (2 * itemsInBufferContainer) : i % (2 * (level + 1))

            if (bufferContainerBarIndex === 0) {
                if (typeof $bufferContainer !== 'undefined') {
                    bufferContainers.push($bufferContainer);
                    $bufferContainer = undefined;
                }
                $bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 d-flex justify-content-around border-buffer',
                    'id': ++bufferContainerIndex
                });
            }
            if (typeof buffer[i] === 'undefined') {
                $bufferContainer.append(helper.createBar(i, 1000, {
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container',
                    'noBorder': true,
                }).removeClass('d-flex'))
            } else {
                $bufferContainer.append(buffer[i].div)
            }
        }
        for (let i = N; i < Math.ceil(N / 2) * 2; i++) {
            let bufferContainerBarIndex = itemsInBufferContainer ? i % (2 * itemsInBufferContainer) : i % (2 * (level + 1)),
                extraBar = helper.createBar(i, 1000, {
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container d-none',
                }).removeClass('d-flex');

            if (bufferContainerBarIndex === 0) {
                if (typeof $bufferContainer !== 'undefined') {
                    bufferContainers.push($bufferContainer);
                    $bufferContainer = undefined;
                }
                $bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 d-flex justify-content-around border-buffer',
                    'id': ++bufferContainerIndex
                });
            }
            if (typeof buffer[i] === 'undefined') {
                $bufferContainer.append(extraBar)
            } else {
                $bufferContainer.append(buffer[i].div)
            }
            buffer[i] = {
                div: $(extraBar),
                val: maxValue,
            };
            $bufferContainer.append(extraBar);
        }
        bufferContainers.push($bufferContainer);
        $buffer.append(bufferContainers)
        $('.graph-block').append($buffer)
    }

    function initMergeSortCode() {
        let $codeBlockSort = $('<div/>', {'class': 'code-block'}),
            $codeBlockMerge = $('<div/>', {'class': 'code-block'}),
            codeStructureSort = [
                {'line': 'B[N];', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'IF (N > 1) {', 'tab': 0},
                {'line': 'K = N/2;', 'tab': 1},
                {'line': 'MERGESORT(ARR, K);', 'tab': 1},
                {'line': 'MERGESORT(ARR + K, N);', 'tab': 1},
                {'line': 'MERGE(N, K, ARR, B);', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR(L = 0; L < N; L++)', 'tab': 1},
                {'line': '  ARR[L] = B[L];', 'tab': 2},
                {'line': '}', 'tab': 0},
            ],
            codeVariables = {
                0: {'color': 'black', 'label': 'K'},
                1: {'color': 'gray', 'label': 'N'}
            },
            codeStructureMerge = [
                {'line': 'I = 0', 'tab': 0},
                {'line': 'J = K;', 'tab': 0},
                {'line': 'L = 0;', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'WHILE (I < K && J < N)', 'tab': 0},
                {'line': '  IF(ARR[I] &#8804; ARR[J])', 'tab': 1},
                {'line': '      B[L++] = ARR[I++];', 'tab': 2},
                {'line': '  ELSE', 'tab': 1},
                {'line': '      B[L++] = ARR[J++];', 'tab': 2},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'WHILE(I < K)', 'tab': 0},
                {'line': '  B[L++] = ARR[I++];', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'FOR(; J < N; J++)', 'tab': 0},
                {'line': '  B[J] = ARR[J];', 'tab': 1},
            ],
            mergeVariables = {
                0: {'color': 'red', 'label': 'I'},
                1: {'color': 'blue', 'label': 'J'},
                2: {'color': 'green', 'label': 'L'}
            };

        helper.initCode(codeStructureSort, $codeBlockSort, 'MERGESORT (ARR, N)', codeVariables);
        helper.initCode(codeStructureMerge, $codeBlockMerge, 'MERGE (N, K, ARR, B)', mergeVariables);
        $('.code-container').append($codeBlockSort).append($codeBlockMerge);
    }

    return {
        init: function (graphContainer) {
            init = {},
                level = 0,
                N = 0,
                n = 2,
                k = n / 2,
                C = 0,
                itemsInBufferContainer = n,
                masterI = 0,
                masterJ = k,
                masterL = 0;

            initMergeSortCode();
            graphContainer.find('.bar-block').each(function (index, $div) {
                init[index] = {
                    div: $div,
                    val: parseInt($(this).attr('id')),
                };
            });
            N = graphContainer.find('.bar-block').length;
            maxValue = Math.max.apply(null, Object.values(init).map(c => c.val))
            for (let i = N; i < Math.ceil(N / n) * n; i++) {
                let extraBar = helper.createBar(i, -1, {
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'd-none'
                }).removeClass('d-flex');
                init[i] = {
                    div: $(extraBar),
                    val: maxValue,
                };
                graphContainer.append(extraBar);
            }
            initBuffer();
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
