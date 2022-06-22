define(['helper'], function (helper) {
    let collection = {}, animationSpeed = 100, n, buildIndex;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        if (n === 0) {
            $('.graph.tree').remove();
            $.each(collection, function (i, e) {
                e.el.removeClass('sorted');
                e.el.css('background', 'black');
            });

            return;
        }

        helper.setVariableValue('heapsort', 'i', buildIndex >= 0 ? buildIndex : 0);
        helper.setVariableValue('heapsort', 'n', n);

        if (buildIndex >= 0) {
            helper.changeCodeHighlight(0, function () {
                helper.changeCodeHighlight(1, function () {
                    shiftDown(collection, n, buildIndex--).then(function () {
                        helper.getStepButton().on('click', sortIteration);
                    });
                }, animationSpeed, 'heapsort');
            }, animationSpeed, 'heapsort');
        } else {
            if (--n) {
                helper.setVariableValue('heapsort', 'i', 0);
                helper.setVariableValue('heapsort', 'n', n);
                helper.changeCodeHighlight(3, function () {
                    helper.changeCodeHighlight(4, function () {
                        swap(collection, n, 0).then(function (result) {
                            helper.changeCodeHighlight(5, function () {
                                shiftDown(result, n, 0).then(function () {
                                    helper.getStepButton().on('click', sortIteration);
                                });
                            }, animationSpeed, 'heapsort');
                        });
                    }, animationSpeed, 'heapsort');
                }, animationSpeed, 'heapsort');
            } else {
                helper.getStepButton().on('click', sortIteration);
            }
        }
    }

    function swap(t, a, b) {
        return new Promise(function (resolve) {
            t[a].elNode.animateSwap({
                target: t[b].elNode,
                speed: animationSpeed,
                opacity: "1",
            });
            t[a].el.animateSwap({
                target: t[b].el,
                speed: animationSpeed,
                opacity: "1",
                callback: function () {
                    let x = t[a],
                        y = t[b];

                    t[a] = t[b]
                    t[b] = x;

                    t[a].el.css('background', '#212121');

                    t[a].el.addClass('sorted');
                    t[a].elNode.addClass('sorted');

                    $('.line[line-id="' + b + '"]').css('background', x.el.css('color'));
                    $('.line#line-' + a).css('visibility', 'hidden');
                    y.elNode.css('visibility', 'hidden');

                    resolve(t);
                }
            });
        });
    }

    function shiftDown(t, n, i) {
        let nn = n;

        helper.setVariableValue('shift_down', 'i', i);
        helper.setVariableValue('shift_down', 'x', t[i].val);

        return loop(t, n, i, i, true).then(function (result) {
            $.each(result, function (i, e) {
                if (i < nn) {
                    e.elNode.css('background', 'black');
                    e.el.css('background', 'black');
                }
            });
            collection = result;
        });
    }

    function loop(t, n, k, i, x) {
        let NN = n;

        return helper.changeCodeHighlight(2, function () {
            let kk = 2 * i + 2;

            helper.setVariableValue('shift_down', 'k', 2 * i + 2);
            if (x) {
                let kk = 2 * i + 2;

                kk < NN && t[kk] && !t[kk].elNode.hasClass('sorted') && helper.colorElement(t[kk].elNode, '#93faff', '#93faff', 'black');
                kk < NN && t[kk] && !t[kk].el.hasClass('sorted') && helper.colorElement(t[kk].el, '#93faff');

                (kk - 1) < NN && t[kk - 1] && !t[kk - 1].elNode.hasClass('sorted') && helper.colorElement(t[kk - 1].elNode, '#93faff', '#93faff', 'black');
                (kk - 1) < NN && t[kk - 1] && !t[kk - 1].el.hasClass('sorted') && helper.colorElement(t[kk - 1].el, '#93faff');
            }

            t[i] && helper.colorElement(t[i].elNode, '#93faff', '#007BFF', 'white');
            t[i] && helper.colorElement(t[i].el, '#93faff', '#007BFF');
            helper.colorElement($('.line[line-id="' + i + '"]'), null, '#93faff');

            kk < NN && t[kk] && helper.colorElement(t[kk].elNode, false, '#DC3545', 'white');
            kk < NN && t[kk] && helper.colorElement(t[kk].el, '#93faff', '#DC3545');

            return helper.changeCodeHighlight(3, function () {
                return loopCode(t, n, k, i, x).then(function (result) {
                    return new Promise(function (resolve) {
                        if (typeof result.N != 'undefined') {
                            resolve(loop(result.T, result.N, result.K, result.I, (2 * result.I + 2) < result.N));
                        } else {
                            $.each(t, function (i, e) {
                                if (i < NN) {
                                    helper.colorElement(e.elNode, e.el.css('color'), 'black', e.el.css('color'));
                                    helper.colorElement(e.el, 'black', 'black');
                                }
                            });
                            helper.changeCodeHighlight(10, function () {
                                resolve(result.T);
                            }, animationSpeed, 'shift_down');
                        }
                    });
                });
            }, animationSpeed, 'shift_down');
        }, animationSpeed, 'shift_down');
    }

    function loopCode(t, n, k, i, x) {
        let kk = k = 2 * i + 2;

        return new Promise(function (resolve) {
            helper.changeCodeHighlight(4, function () {
                let conditionPart = (k < n) && (+t[k].val > +t[k - 1].val) ? 1 : 2;

                if (((k < n) && (+t[k].val > +t[k - 1].val)
                    || (--k < n)) && +t[k].val > +t[i].val) {
                    helper.changeCodeHighlight(conditionPart === 2 ? 5 : 4, function () {
                        if (conditionPart === 2) {
                            helper.setVariableValue('shift_down', 'k', k);

                            k < n && t[k] && helper.colorElement(t[k].elNode, false, '#DC3545', 'white');
                            k < n && t[k] && helper.colorElement(t[k].el, '#93faff', '#DC3545');

                            (k + 1) < n && t[k + 1] && helper.colorElement(t[k + 1].elNode, false, '#93faff', 'black');
                            (k + 1) < n && t[k + 1] && helper.colorElement(t[k + 1].el, '#93faff', 'black');
                        }

                        helper.changeCodeHighlight(conditionPart === 2 ? 6 : null, function () {
                            helper.changeCodeHighlight(7, function () {
                                t[k].elNode.animateSwap({
                                    target: t[i].elNode,
                                    speed: animationSpeed,
                                    opacity: "1"
                                });

                                t[k].el.animateSwap({
                                    target: t[i].el,
                                    speed: animationSpeed,
                                    opacity: "1",
                                    callback: function () {
                                        let x = t[k];

                                        t[k] = t[i];
                                        t[i] = x;

                                        t[i] && helper.colorElement(t[i].elNode, t[i].el.css('color'), 'black', t[i].el.css('color'));
                                        t[i] && helper.colorElement(t[i].el, 'black', 'black');
                                        helper.colorElement($('.line[line-id="' + i + '"]'), null, x.elNode.css('border-color'));

                                        kk < n && t[kk] && helper.colorElement(t[kk].elNode, t[kk].el.css('color'), 'black', t[kk].el.css('color'));
                                        kk < n && t[kk] && helper.colorElement(t[kk].el, 'black', 'black');

                                        (kk - 1) < n && t[kk - 1] && helper.colorElement(t[kk - 1].elNode, t[kk - 1].el.css('color'), 'black', t[kk - 1].el.css('color'));
                                        (kk - 1) < n && t[kk - 1] && helper.colorElement(t[kk - 1].el, 'black', 'black');

                                        helper.setVariableValue('shift_down', 'i', k);
                                        helper.changeCodeHighlight(8, function () {
                                            resolve({'T': t, 'N': n, 'K': k, 'I': k});
                                        }, animationSpeed, 'shift_down');
                                    }
                                });
                            }, animationSpeed, 'shift_down');
                        }, animationSpeed, 'shift_down');
                    }, conditionPart === 2 ? animationSpeed : null, 'shift_down');
                } else {
                    helper.changeCodeHighlight(5, function () {
                        let kk = conditionPart === 2 ? 0 : -1;

                        (k + 1 + kk) < n && t[k + 1 + kk] && helper.colorElement(t[k + 1 + kk].elNode, false, '#93faff', 'black');
                        (k + kk) < n && t[k + kk] && helper.colorElement(t[k + kk].elNode, false, '#DC3545', 'white');

                        (k + 1 + kk) < n && t[k + 1 + kk] && helper.colorElement(t[k + 1 + kk].el, '#93faff', 'black');
                        (k + kk) < n && t[k + kk] && helper.colorElement(t[k + kk].el, '#93faff', '#DC3545');

                        helper.setVariableValue('shift_down', 'k', k + kk);
                        helper.changeCodeHighlight(6, function () {
                            helper.changeCodeHighlight(9, function () {
                                t[i] && $('.line[line-id="' + i + '"]').css('background', t[i].el.css('color'));
                                resolve({'T': t});
                            }, animationSpeed, 'shift_down');
                        }, animationSpeed, 'shift_down');
                    }, animationSpeed, 'shift_down');
                }
            }, animationSpeed, 'shift_down');
        });
    }

    function initHeapsortCode() {
        let $codeBlockSort = $('<div/>', {'class': 'code-block'}),
            $codeBlockShiftDown = $('<div/>', {'class': 'code-block'}),
            codeStructureSort = [
                {'line': 'FOR (I=N/2-1; I>=0; I--)', 'tab': 0},
                {'line': 'SHIFT_DOWN( ARR, N, I)', 'tab': 1},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'WHILE (--N) {', 'tab': 0},
                {'line': 'SWAP(ARR[0], ARR[N])', 'tab': 1},
                {'line': 'SHIFT_DOWN(ARR, N, 0)', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            codeVariables = {
                0: {'color': 'black', 'label': 'I'},
                1: {'color': 'gray', 'label': 'N'}
            },
            codeStructureShiftDown = [
                {'line': 'X = ARR[I]', 'tab': 0},
                {'line': '&nbsp;', 'tab': 0},
                {'line': 'WHILE ( TRUE ) {', 'tab': 0},
                {'line': 'K = 2 * I + 2', 'tab': 1},
                {'line': 'IF ( (K < N && ARR[K] > X && ARR[K] > ARR[K-1])', 'tab': 1},
                {'line': '||', 'tab': 2},
                {'line': '(--K < N && ARR[K] > x) ) {', 'tab': 1},
                {'line': 'SWAP(ARR[I], ARR[K])', 'tab': 2},
                {'line': 'I = K', 'tab': 2},
                {'line': '} ELSE {', 'tab': 1},
                {'line': 'RETURN', 'tab': 2},
                {'line': '}', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            shiftDownVariables = {
                0: {'color': '#DC3545', 'label': 'K'},
                1: {'color': '#007BFF', 'label': 'I'},
                2: {'color': '#28A745', 'label': 'X'},
            };

        helper.initCode(codeStructureSort, $codeBlockSort, 'HEAPSORT (ARR, N)', codeVariables);
        helper.initCode(codeStructureShiftDown, $codeBlockShiftDown, 'SHIFT_DOWN (ARR, N, I)', shiftDownVariables);
        $('.code-container').append($codeBlockSort).append($codeBlockShiftDown);
    }

    return {
        init: function (graphContainer) {
            collection = {};
            n = 0;
            initHeapsortCode();
            graphContainer.find('.bar-block').each(function (index, $div) {
                let $el = $($div),
                    $elNode = graphContainer.parent().find('.graph.tree div[node-id="' + $el.attr('data-index') + '"]');

                collection[n++] = {
                    el: $el,
                    elNode: $elNode,
                    val: parseInt($elNode.text())
                };
            });
            buildIndex = Math.floor(n / 2) - 1;
            helper.getStepButton().on('click', sortIteration);

            return this;
        },
        sortIteration: function () {
            return sortIteration();
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
