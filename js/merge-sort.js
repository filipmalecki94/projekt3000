define(['helper'], function (helper) {
    var init = {},
        buffer = {},
        animationSpeed = 500,
        level = 0,
        n = 0,
        C = 0;

    function sortIteration() {
        var itemsInBufferContainer = $('.buffer .buffer-container').first().children().length,
            bufferContainerCount = Object.keys(buffer).length,
            i=0,j=bufferContainerCount,L=0;

        loop(C * itemsInBufferContainer,itemsInBufferContainer/2 + (C * itemsInBufferContainer),C * itemsInBufferContainer).then(function (res) {
            var I = res['i'], J = res['j'], L = res['l'];

            C++;
            console.log(buffer)
            if (C >= bufferContainerCount) {
                setTimeout(function () {
                    $('.graph').html($('.buffer').html());
                    init = buffer;
                    buffer = {};
                    $('.buffer').remove();
                    level++;
                    C=0
                    initBuffer()
                    console.log('----------------------------')
                },animationSpeed * 2);
            }
            // koniec petli
        });
    }

    function loop(I,J,L) {
        return loopCode(I,J,L).then(function (result) {
            var I = result['i'], J = result['j'], L = result['l'];

            return new Promise(function (resolve) {
                setTimeout(function () {
                    var x_x =I%($('.graph .buffer-container').first().children().length),
                        y_y = J%($('.graph .buffer-container').first().children().length);

                    if (I < (C+1) * $('.buffer .buffer-container').first().children().length / 2  && J < (C+1) * $('.buffer .buffer-container').first().children().length) {
                        return resolve(loop(I, J, L));
                    } else {
                        if (I < $('.buffer .buffer-container').first().children().length / 2 + (C * $('.buffer .buffer-container').first().children().length)) {
                            buffer[C][$('.buffer .buffer-container').first().children().length - 1].val = init[I][x_x].val;
                            var $new = helper.createBar(0,init[I][x_x].val,{
                                    'withNumbers': true,
                                    'noOrder': true,
                                    'customBarClasses': 'merged',
                                    'noBorder': true,
                                }
                            )
                            buffer[C][$('.buffer .buffer-container').first().children().length - 1].div.replaceWith($new);
                            buffer[C][L%$('.buffer .buffer-container').first().children().length].div = $new;
                            init[I][x_x].div.addClass('merged')
                        } else {
                            buffer[C][$('.buffer .buffer-container').first().children().length - 1].val = init[J][y_y].val;
                            var $new = helper.createBar(0,init[J][y_y].val,{
                                    'withNumbers': true,
                                    'noOrder': true,
                                    'customBarClasses': 'merged',
                                    'noBorder': true,
                                }
                            )
                            buffer[C][$('.buffer .buffer-container').first().children().length - 1].div.replaceWith($new);
                            buffer[C][L%$('.buffer .buffer-container').first().children().length].div = $new;
                            init[J][y_y].div.addClass('merged')
                        }
                       resolve(result);

                    }
                },animationSpeed)
            })
        });
    }

    function loopCode(I,J,L) {
        var x_x =I%($('.graph .buffer-container').first().children().length),
            y_y = J%($('.graph .buffer-container').first().children().length);

        console.log('iter')
        return new Promise(function (resolve) {
            setTimeout(function () {
                if (I < $('.buffer .buffer-container').first().children().length/2 + (C * $('.buffer .buffer-container').first().children().length) && J < $('.buffer .buffer-container').first().children().length+ (C * $('.buffer .buffer-container').first().children().length)) {
                    if(init[I][x_x].val <= init[J][y_y].val) {
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].val = init[I][x_x].val;
                        var $new = helper.createBar(0,init[I][x_x].val,{
                                'withNumbers': true,
                                'noOrder': true,
                                'customBarClasses': 'merged',
                                'noBorder': true,
                            }
                        )
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].div.replaceWith($new);
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].div = $new;
                        init[I][x_x].div.addClass('merged')
                        resolve({'i':++I,'j':J,'l':++L});
                    } else {
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].val = init[J][y_y].val;
                        var $new = helper.createBar(0,init[J][y_y].val,{
                                'withNumbers': true,
                                'noOrder': true,
                                // 'customBarClasses': 'merged',
                                'noBorder': true,
                            }
                        )
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].div.replaceWith($new);
                        buffer[C][L%$('.buffer .buffer-container').first().children().length].div = $new;
                        console.log(init[J][y_y].div)
                        init[J][y_y].div.addClass('merged')
                        resolve({'i':I,'j':++J,'l':++L});
                    }
                } else {
                    console.log('XD')
                    C++;
                    resolve({'i':I,'j':J,'l':L});
                }
            }, animationSpeed);
        });
    }

    function initBuffer() {
        var bufferContainer,
            bufferContainers = [],
            $buffer = $('<div/>',{
                'class': 'buffer d-flex justify-content-around'
            }),
            bufferContainerIndex = -1;

        for(var i = 0; i < n; i++) {
            var bufferContainerBarIndex = i%(2 * (level + 1));

            if(bufferContainerBarIndex === 0) {
                if(typeof bufferContainer !== 'undefined') {
                    bufferContainers.push(bufferContainer);
                    bufferContainer = undefined;
                }
                bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 border border-white d-flex justify-content-around',
                    'id': ++bufferContainerIndex
                });
                buffer[bufferContainerIndex] = {};
            }
            buffer[bufferContainerIndex][bufferContainerBarIndex] = {
                div: helper.createBar(bufferContainerBarIndex,bufferContainerBarIndex,{'height':0}),
                val: 0
            }
            bufferContainer.append(buffer[bufferContainerIndex][bufferContainerBarIndex].div)
        }
        bufferContainers.push(bufferContainer);

        console.log({buffer})
        console.log({init})
        $buffer.append(bufferContainers)
        $('.graph-block').append($buffer)
    }

    function initMergeSortCode() {
        var $codeFieldSort = $('<div/>',{'class': 'code m-1 h-50'}),
            $codeFieldMerge = $('<div/>',{'class': 'code m-1 h-50'}),
            codeStructureMerge = [
                {'line' : 'double b[N];', 'tab' : 0},
                {'line' : ' ', 'tab' : 0},
                {'line' : 'void merge(int n,int k,double t[], double b[]', 'tab' : 0},
                {'line' : '{', 'tab' : 0},
                {'line' : 'int i=0,j=k,L=0;', 'tab' : 1},
                {'line' : 'while (i<k && j<n)\n', 'tab' : 1},
                {'line' : 'if(t[i]<=t[j])', 'tab' : 2},
                {'line' : ' b[L++]=t[i++];', 'tab' : 3},
                {'line' : 'else', 'tab' : 2},
                {'line' : 'b[L++]=t[j++];', 'tab' : 3},
                {'line' : 'while(i<k)', 'tab' : 1},
                {'line' : 't[--j]=t[--k];', 'tab' : 2},
                {'line' : 'for(i=0;i<j;i++)', 'tab' : 1},
                {'line' : 't[i]=b[i];', 'tab' : 2},
                {'line' : '}', 'tab' : 0}
            ],
            codeStructureSort = [
                {'line' : 'void merge_sort(double t[],int n)', 'tab' : 0},
                {'line' : '{', 'tab' : 0},
                {'line' : 'if(n>1)', 'tab' : 1},
                {'line' : '{', 'tab' : 1},
                {'line' : 'int k=n/2;', 'tab' : 2},
                {'line' : 'merge_sort(t,k);', 'tab' : 2},
                {'line' : 'merge_sort(t+k,n-k);', 'tab' : 2},
                {'line' : 'merge(n,k,t,b);', 'tab' : 2},
                {'line' : '}', 'tab' : 1},
                {'line' : '}', 'tab' : 0},
            ];

        helper.initCode(codeStructureMerge,$codeFieldMerge);
        helper.initCode(codeStructureSort,$codeFieldSort);
        $('.code-block').append($codeFieldMerge).append($codeFieldSort);
    }

    return {
        init: function (graphContainer) {
            init = {};
            level = 0;
            n = 0;

            initMergeSortCode();
            n = graphContainer.find('.bar-block').length;
            graphContainer.find('.bar-block').each(function(index,$div) {
                init[index] = {0:{
                    div:$($div),
                    val:parseInt($(this).attr('id')),
                }};
            });
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
        }
    };
});
