define(['helper'], function (helper) {
    var init = {},
        buffer = {},
        animationSpeed = 100,
        interval,
        level = 0,
        N = 0,
        n = 2,
        k = n/2,
        C = 0,
        itemsInBufferContainer = n,

        masterI =0,
        masterJ =k,
        masterL =0;

    function sortIteration() {
        loop(masterI,masterJ,masterL).then(function (res) {
            var I = res['i'], J = res['j'], L = res['l'];

            C++;
            n = (C+1) * itemsInBufferContainer;
            k = n/2 + (C) * itemsInBufferContainer/2;
            masterI = (C) * itemsInBufferContainer;
            masterJ = k;
            masterL = L
console.log(buffer)
console.log(init)
            if (C > Math.floor(N / itemsInBufferContainer)) {
                for(var x = J; x < N; x++){
                    buffer[x].val = init[L++].val
                }
                setTimeout(function () {
                    console.log('----------------------------')
                    console.log(buffer)
                    init = buffer;
                    $('.graph').html($('.buffer').html())
                    $('.buffer').remove()
                    buffer = {};
                    level++;
                    initBuffer(itemsInBufferContainer)
                    C=0
                    itemsInBufferContainer = itemsInBufferContainer * 2
                    n = itemsInBufferContainer
                    k = n/2 + C;
                    masterI = 0;
                    masterJ = k;
                    masterL = 0;
                    if(k >= N) {
                        $('.buffer').remove()
                        helper.getStepButton().off('click',sortIteration);
                    }
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
                    if (I < k && J < n) {
                        return resolve(loop(I, J, L));
                    } else {
                        if (J < n) {
                            // var x = L
                            // interval = setInterval(function (){
                            //     if(typeof init[J] !== 'undefined') {
                            //         var idJ= J, idL = L;
                            //         $('.buffer #'+idL+'.bar-block').replaceWith(helper.createBar(0,init[idJ].val,{
                            //             'withNumbers': true,
                            //             'noOrder': true,
                            //             'customBarBlockClasses': 'buffer-container',
                            //             'noBorder': true,
                            //         }))
                            //         buffer[x++].val = init[J++].val
                            //         L++;
                            //     }
                            //     console.log(x,itemsInBufferContainer)
                            //     if(x >= itemsInBufferContainer){
                            //         return clearInterval(interval)
                            //     }
                            // },animationSpeed)
                            for(var x = L; x < n; x++){
                                if(typeof init[J] !== 'undefined') {
                                    var idJ = J;

                                    buffer[x].val = init[idJ].val
                                    buffer[x].div = moveToBuffer(x,idJ)
                                    init[idJ].div.addClass('merged')

                                    J++;
                                    L++;
                                }
                            }
                            resolve({'i':I,'j':J,'l':L});
                        } else {
                            // var x = L
                            // interval = setInterval(function (){
                            //     if(typeof init[I] !== 'undefined') {
                            //         var idI= I, idL = L;
                            //         $('.buffer #'+idL+'.bar-block').replaceWith(helper.createBar(0,init[idI].val,{
                            //             'withNumbers': true,
                            //             'noOrder': true,
                            //             'customBarBlockClasses': 'buffer-container',
                            //             'noBorder': true,
                            //         }))
                            //         buffer[x++].val = init[I++].val
                            //         L++;
                            //     }
                            //     console.log(x,itemsInBufferContainer)
                            //     if(x >= itemsInBufferContainer){
                            //         return clearInterval(interval)
                            //     }
                            // },animationSpeed)
                            //
                            for(var x = L; x < n; x++){
                                if(typeof init[I] !== 'undefined') {
                                    var idI= I;

                                    buffer[x].val = init[idI].val
                                    buffer[x].div = moveToBuffer(x,idI)
                                    init[idI].div.addClass('merged')

                                    I++;
                                    L++;
                                }
                            }
                            resolve({'i':I,'j':J,'l':L});
                        }
                    }
                },animationSpeed)
            })
        });
    }

    function loopCode(I,J,L) {
        console.log('iter')
        return new Promise(function (resolve) {
            setTimeout(function () {
                if (I < k && J < n) {
                    if(typeof init[J] === 'undefined'){
                        buffer[L].val = init[I].val;
                        buffer[L].div = moveToBuffer(L,I)
                        init[I].div.addClass('merged')

                        return resolve({'i':++I,'j':J,'l':++L});
                    }
                    if(typeof init[I] === 'undefined'){
                        buffer[L].val = init[J].val;
                        buffer[L].div = moveToBuffer(L,J)
                        init[J].div.addClass('merged')

                        return resolve({'i':I,'j':++J,'l':++L});
                    }
                    if(init[I].val <= init[J].val) {
                        buffer[L].val = init[I].val;
                        buffer[L].div =  moveToBuffer(L,I)
                        init[I].div.addClass('merged')

                        resolve({'i':++I,'j':J,'l':++L});
                    } else {
                        buffer[L].val = init[J].val;
                        buffer[L].div = moveToBuffer(L,J)
                        init[J].div.addClass('merged')

                        resolve({'i':I,'j':++J,'l':++L});
                    }
                } else {
                    C++;
                    resolve({'i':I,'j':J,'l':L});
                }
            }, animationSpeed);
        });
    }

    function moveToBuffer(L,X) {
        var $bar = helper.createBar(0,init[X].val,{
            'withNumbers': true,
            'noOrder': true,
            'customBarBlockClasses': 'buffer-container',
            'noBorder': true,
        });
        $('.buffer #'+L+'.bar-block .bar').last().replaceWith($bar)

        return $bar;
    }

    function initBuffer(itemsInBufferContainer) {
        var $bufferContainer,
            bufferContainers = [],
            $buffer = $('<div/>',{
                'class': 'buffer d-flex justify-content-around '
            }),
            bufferContainerIndex = -1;


        for(var i = 0; i < N; i++) {
            buffer[i] = {
                div: helper.createBar(i,i,{
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container',
                    'noBorder': true,
                    'height': '0'
                }),
                val: 0
            }
        }

        for(var i = 0; i <= N; i++) {
            console.log(itemsInBufferContainer)
            var bufferContainerBarIndex = itemsInBufferContainer ?  i%(2 * itemsInBufferContainer) : i%(2 * (level + 1))

            if(bufferContainerBarIndex === 0) {
                if(typeof $bufferContainer !== 'undefined') {
                    bufferContainers.push($bufferContainer);
                    $bufferContainer = undefined;
                }
                $bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 d-flex justify-content-around',
                    'id': ++bufferContainerIndex
                });
            }
            if(typeof buffer[i] === 'undefined'){
                $bufferContainer.append(helper.createBar(i,i,{
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container',
                    'noBorder': true,
                    'height': '0'
                }))
            } else {
                $bufferContainer.append(buffer[i].div)
            }
        }
        bufferContainers.push($bufferContainer);
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

            initMergeSortCode();
            N = graphContainer.find('.bar-block').length;
            graphContainer.find('.bar-block').each(function(index,$div) {
                init[index] = {
                    div:$($div),
                    val:parseInt($(this).attr('id')),
                };
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
