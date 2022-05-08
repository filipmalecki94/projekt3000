define(['helper'], function (helper) {
    let collection = {}, animationSpeed = 100, n, buildIndex;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration);

        if (n === 0) {
            $('.graph.tree').remove()
            $.each(collection, function (i,e) {
                e.el.removeClass('sorted')
            })
            return;
        }
        if (buildIndex >= 0) {
            shiftDown(collection, n, buildIndex--)
        } else {
            swap(collection, --n, 0).then(function (result) {
                shiftDown(result, n, 0)
            })
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

                    t[a].el.addClass('sorted');
                    t[a].elNode.addClass('sorted');

                    $('.line[line-id="' + b + '"]').css('background-color', x.el.css('color'));
                    $('.line#line-' + a).css('visibility', 'hidden');
                    y.elNode.css('visibility', 'hidden');

                    resolve(t);
                }
            });
        });
    }

    function shiftDown(t, n, i) {

        loop(t, n, i, i, true).then(function (result) {
            $.each(result, function (i, e) {
                e.elNode.css('background-color', 'black')
                e.el.css('border', '1px solid black');
            });
            helper.getStepButton().on('click', sortIteration);
            collection = result;
        });
    }

    function loop(t, n, k, i, x) {
        if (x) {
            let kk = 2 * i + 2;

            t[i] && helper.colorElement(t[i].elNode, '#93faff',  '#93faff','black')
            t[i] && helper.colorElement(t[i].el, '#93faff')
            t[kk] && !t[kk].elNode.hasClass('sorted') && helper.colorElement(t[kk].elNode, '#93faff',  '#93faff','black')
            t[kk] && !t[kk].el.hasClass('sorted') && helper.colorElement(t[kk].el, '#93faff')
            t[kk - 1] && !t[kk - 1].elNode.hasClass('sorted') && helper.colorElement(t[kk - 1].elNode, '#93faff',  '#93faff','black')
            t[kk - 1] && !t[kk - 1].el.hasClass('sorted') && helper.colorElement(t[kk - 1].el, '#93faff')
            helper.colorElement($('.line[line-id="' + i + '"]'), null, '#93faff');
        }

        return loopCode(t, n, k, i, x).then(function (result) {
            return new Promise(function (resolve) {
                if (typeof result.N != 'undefined') {
                    resolve(loop(result.T, result.N, result.K, result.I, (2 * result.I + 2) < result.N));
                } else {
                    $.each(t, function (i, e) {
                        helper.colorElement(e.elNode, e.el.css('color'), 'black', e.el.css('color'))
                            .colorElement(e.el, 'black');
                    });

                    resolve(result.T);
                }
            });
        });
    }

    function loopCode(t, n, k, i, x) {
        let kk = k = 2 * i + 2;

        return new Promise(function (resolve) {
            setTimeout(function () {
                if (((k < n) && (+t[k].val > +t[k - 1].val) || (--k < n)) && +t[k].val > +t[i].val) {
                    t[k] && t[k].elNode.css({'background-color': '#fffc3d'});
                    t[k] && t[k].el.css({'border': '1px solid #fffc3d'});

                    setTimeout(function () {
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

                                t[i] && helper.colorElement(t[i].elNode, t[i].el.css('color'), 'black', t[i].el.css('color'))
                                t[kk] && helper.colorElement(t[kk].elNode, t[kk].el.css('color'), 'black', t[kk].el.css('color'))
                                t[kk - 1] && helper.colorElement(t[kk - 1].elNode, t[kk - 1].el.css('color'), 'black', t[kk - 1].el.css('color'))
                                t[i] && helper.colorElement(t[i].el, 'black')
                                t[kk] && helper.colorElement(t[kk].el,'black')
                                t[kk - 1] && helper.colorElement(t[kk - 1].el, 'black')
                                helper.colorElement($('.line[line-id="' + i + '"]'), null, x.elNode.css('border-color'));

                                resolve({'T': t, 'N': n, 'K': k, 'I': k});
                            }
                        });
                    }, animationSpeed);
                } else {
                    x && t[i] && t[i].elNode.css('background-color', '#fffc3d');
                    x && t[i] && t[i].el.css({'border': '1px solid #fffc3d'});

                    setTimeout(function () {
                        t[i] && $('.line[line-id="' + i + '"]').css('background-color', t[i].el.css('color'));

                        resolve({'T': t});
                    }, animationSpeed);
                }
            }, animationSpeed);
        });
    }

    function initHeapsortCode() {
        let $codeFieldSort = $('<div/>', {'class': 'code m-1 h-25'}),
            $codeFieldPartition = $('<div/>', {'class': 'code mt-4 h-50'}),
            codeStructureSort = [
                {'line': 'heap_sort (double t[], int n) {', 'tab': 0},
                {'line': 'for (int i=n/2-1; i>=0; i--)', 'tab': 1},
                {'line': 'shift_down( t, n, i);', 'tab': 2},
                {'line': 'while (--n) {', 'tab': 1},
                {'line': 'std::swap(t[0],t[n]);', 'tab': 2},
                {'line': 'shift_down(t,n,0);', 'tab': 2},
                {'line': '}', 'tab': 1},
                {'line': '}', 'tab': 0},
            ],
            codeStructurePartition = [
                {'line': 'shift_down (double t[], int n, int i) {', 'tab': 0},
                {'line': 'int k = i;', 'tab': 1},
                {'line': 'double x = t[i]', 'tab': 1},
                {'line': 'while( ( (k+=k+2)<n && t[k-1]<t[k] || --k<n ) && x<t[k]) {', 'tab': 1},
                {'line': 't[i] = t[k];', 'tab': 2},
                {'line': 'i = k;', 'tab': 2},
                {'line': 't[i] = x;', 'tab': 1},
                {'line': '}', 'tab': 0},
            ];

        helper.initCode(codeStructureSort, $codeFieldSort);
        helper.initCode(codeStructurePartition, $codeFieldPartition);
        $('.code-block').append($codeFieldSort).append($codeFieldPartition)
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
