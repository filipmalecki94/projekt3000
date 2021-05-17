define(['helper'], function (helper) {
    var init = {},
        buffer = {},
        animationSpeed = 2000,
        level = 0,
        n = 0,
        C = 0;

    function sortIteration() {
        var itemsInBufferContainer = $('.buffer-container').first().children().length,
            bufferContainerCount = Object.keys(buffer).length,
            i=0,j=bufferContainerCount,L=0;
// console.log(buffer)
        loop(C * itemsInBufferContainer,itemsInBufferContainer/2 + (C * itemsInBufferContainer),C * itemsInBufferContainer).then(function (res) {
            var I = res['i'], J = res['j'], L = res['l'];
            // console.log(res)


            console.log(buffer)
            C++;
            // koniec petli
        });
    }

    function loop(I,J,L) {
        // console.log(1)
        // console.log({'i':I,'j':J,'l':L})
        return loopCode(I,J,L).then(function (result) {
            var I = result['i'], J = result['j'], L = result['l'];
            // console.log(2)
            console.log({'i':I,'j':J,'l':L})
            console.log(I , $('.buffer-container').first().children().length/2 + (C * $('.buffer-container').first().children().length) , J , C * $('.buffer-container').first().children().length)
            if (I < $('.buffer-container').first().children().length/2 + (C * $('.buffer-container').first().children().length) && J < C * $('.buffer-container').first().children().length) {
                console.log(3)
                // console.log({'i':I,'j':J,'l':L})
                return loop(I,J,L);
            } else {

                console.log({'i':I,'j':J,'l':L})
                console.log(L%$('.buffer-container').first().children().length)
                if (I < $('.buffer-container').first().children().length/2 + (C * $('.buffer-container').first().children().length)) {

                    console.log('X',$('.buffer-container').first().children().length-1)
                    console.log('I',I)
                    buffer[C][$('.buffer-container').first().children().length-1].val = init[I][0].val;
                    // helper.swapDivs(buffer[C][$('.buffer-container').first().children().length-1].div,init[I][0].div,true)

                    console.log(init[I][0].div)
                    // init[I][0].div.addClass('merged')
                    // setTimeout(function () {
                    buffer[C][$('.buffer-container').first().children().length-1].div.replaceWith(helper.createBar(0,init[I][0].val,{
                            'withNumbers': true,
                            'noOrder': true,
                            'customBarClasses': 'merged',
                            'noBorder': true,
                        }
                    ));
                    // },500);
                }  else {
                    console.log('D',$('.buffer-container').first().children().length-1)
                    console.log('J',J)
                    buffer[C][$('.buffer-container').first().children().length-1].val = init[J][0].val;
                    console.log(init[J][0].div)
                    buffer[C][$('.buffer-container').first().children().length-1].div.replaceWith(helper.createBar(0,init[J][0].val,{
                            'withNumbers': true,
                            'noOrder': true,
                            'customBarClasses': 'merged',
                            'noBorder': true,
                        }
                    ));
                    // helper.swapDivs(buffer[C][$('.buffer-container').first().children().length-1].div,init[J][0].div,true)
                }

                return result;
            }
        });
    }

    function loopCode(I,J,L) {
        console.log('iter')
        // console.log(5)
        console.log({'i':I,'j':J,'l':L})
        return new Promise(function (resolve) {
            // console.log(6)
            // console.log({'i':I,'j':J,'l':L})
            setTimeout(function () {
                // console.log(7)
                console.log(I , $('.buffer-container').first().children().length/2 + (C * $('.buffer-container').first().children().length) , J , $('.buffer-container').first().children().length+ (C * $('.buffer-container').first().children().length))
                if (I < $('.buffer-container').first().children().length/2 + (C * $('.buffer-container').first().children().length) && J < $('.buffer-container').first().children().length+ (C * $('.buffer-container').first().children().length)) {
                    // console.log(8)
                    // console.log({'i':I,'j':J,'l':L})
                    if(init[I][0].val <= init[J][0].val) {
                        console.log('x')
                        console.log('i',I)
                        console.log(L%$('.buffer-container').first().children().length)
                        console.log(init[I][0].div)
                        buffer[C][L%$('.buffer-container').first().children().length].val = init[I][0].val;
                        buffer[C][L%$('.buffer-container').first().children().length].div.replaceWith(helper.createBar(0,init[I][0].val,{
                                'withNumbers': true,
                                'noOrder': true,
                                'customBarClasses': 'merged',
                                'noBorder': true,
                            }
                        ));
                        resolve({'i':++I,'j':J,'l':++L});
                    } else {
                        console.log('d')
                        console.log('j',J)
                        console.log(L%$('.buffer-container').first().children().length)
                        console.log(init[J][0].div)
                        buffer[C][L%$('.buffer-container').first().children().length].val = init[I][0].val;
                        buffer[C][L%$('.buffer-container').first().children().length].div.replaceWith(helper.createBar(0,init[J][0].val,{
                                'withNumbers': true,
                                'noOrder': true,
                                'customBarClasses': 'merged',
                                'noBorder': true,
                            }
                        ));
                        resolve({'i':I,'j':++J,'l':++L});
                    }
                } else {
                    console.log('XD')
                    resolve({'i':I,'j':J,'l':L});
                }
            }, animationSpeed * 2);
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
                div: helper.createBar(bufferContainerBarIndex,1),//bufferContainerBarIndex,{'height':0}),
                val: 0
            }
            bufferContainer.append(buffer[bufferContainerIndex][bufferContainerBarIndex].div)
        }
        bufferContainers.push(bufferContainer);

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
