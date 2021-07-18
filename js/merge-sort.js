define(['helper'], function (helper) {
    var init = {},
        buffer = {},
        animationSpeed = 500,
        level, maxValue, N, n, k, C, itemsInBufferContainer, masterI, masterJ, masterL;

    function sortIteration() {
        helper.getStepButton().off('click', sortIteration)


        $('.graph #' + (C * 2) + '.buffer-container').addClass('merged')
        $('.graph #' + (C * 2 + 1) + '.buffer-container').addClass('merged')
        loop(masterI,masterJ,masterL).then(function (res) {
            var I = res['i'], J = res['j'], L = res['l'];

            $('.graph #' + (C * 2) + '.buffer-container').addClass('border-black')
            $('.graph #' + (C * 2) + '.buffer-container').removeClass('merged border-buffer')
            $('.graph #' + (C * 2 + 1) + '.buffer-container').addClass('border-black')
            $('.graph #' + (C * 2 + 1) + '.buffer-container').removeClass('merged border-buffer')
            C++;
            n = (C+1) * itemsInBufferContainer;
            k = n/2 + (C) * itemsInBufferContainer/2;
            masterI = (C) * itemsInBufferContainer;
            masterJ = k;
            masterL = L

            if (C >= Math.ceil(N / itemsInBufferContainer)) {
                for(var x = J; x < N; x++){
                    buffer[x].val = init[L++].val
                    $('.graph').find('.bar-block[data-index="'+L+'"]').css('visibility','hidden')
                }

                setTimeout(function () {


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

                    helper.getStepButton().on('click',sortIteration)
                    if(k >= N) {
                        $('.buffer').remove()
                        $('.graph .buffer-container').removeClass('border border-buffer')
                        helper.getStepButton().off('click',sortIteration);
                    }
                },animationSpeed * 2);
            } else {
                helper.getStepButton().on('click',sortIteration)
            }
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
                            for(var x = L; x < n; x++){
                                if(typeof init[J] !== 'undefined') {
                                    var idJ = J;

                                    $('.graph').find('.bar-block[data-index="'+idJ+'"]').css('visibility','hidden')
                                    buffer[x].val = init[idJ].val
                                    buffer[x].div = moveToBuffer(x,idJ)

                                    J++;
                                    L++;
                                }
                            }
                            resolve({'i':I,'j':J,'l':L});
                        } else {
                            for(var x = L; x < n; x++){
                                if(typeof init[I] !== 'undefined') {
                                    var idI= I;

                                    $('.graph').find('.bar-block[data-index="'+idI+'"]').css('visibility','hidden')
                                    buffer[x].val = init[idI].val
                                    buffer[x].div = moveToBuffer(x,idI)

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

        return new Promise(function (resolve) {
            $('.graph').find('.bar-block[data-index="'+I+'"]').css('background','rgba(255,255,255,0.22)')
            $('.graph').find('.bar-block[data-index="'+J+'"]').css('background','rgba(255,255,255,0.1)')
            setTimeout(function () {
                if (I < k && J < n) {
                    if(typeof init[J] === 'undefined' && typeof init[I] !== 'undefined'){
                        buffer[L].val = init[I].val;
                        buffer[L].div = moveToBuffer(L,I)
                        $('.graph').find('.bar-block[data-index="'+I+'"]').css('visibility','hidden')

                        return resolve({'i':++I,'j':J,'l':++L});
                    }
                    if(typeof init[I] === 'undefined' && typeof init[J] !== 'undefined'){
                        buffer[L].val = init[J].val;
                        buffer[L].div = moveToBuffer(L,J)
                        $('.graph').find('.bar-block[data-index="'+J+'"]').css('visibility','hidden')

                        return resolve({'i':I,'j':++J,'l':++L});
                    }
                    if(typeof init[I] === 'undefined' && typeof init[J] === 'undefined'){
                        return resolve({'i':k,'j':n,'l':++L})
                    }
                    if(init[I].val <= init[J].val) {
                        buffer[L].val = init[I].val;
                        buffer[L].div =  moveToBuffer(L,I)
                        $('.graph').find('.bar-block[data-index="'+I+'"]').css('visibility','hidden')

                        return resolve({'i':++I,'j':J,'l':++L});
                    } else {
                        buffer[L].val = init[J].val;
                        buffer[L].div = moveToBuffer(L,J)
                        $('.graph').find('.bar-block[data-index="'+J+'"]').css('visibility','hidden')

                        return resolve({'i':I,'j':++J,'l':++L});
                    }
                } else {
                    C++;
                    resolve({'i':I,'j':J,'l':L});
                }
            }, typeof init[I] === 'undefined' && typeof init[J] === 'undefined' ? 0 : animationSpeed);
        });
    }

    function moveToBuffer(L,X) {
        var $bar = helper.createBar(L,init[X].val,{
            'withNumbers': N < 31,
            'noOrder': true,
            'customBarBlockClasses': 'buffer-container',
            'noBorder': true,
            'isOversize': N < 31
        });
        $('.buffer #'+L+'.bar-block').last().replaceWith($bar)

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

        for(var i = 0; i < N; i++) {
            var bufferContainerBarIndex = itemsInBufferContainer ?  i%(2 * itemsInBufferContainer) : i%(2 * (level + 1))

            if(bufferContainerBarIndex === 0) {
                if(typeof $bufferContainer !== 'undefined') {
                    bufferContainers.push($bufferContainer);
                    $bufferContainer = undefined;
                }
                $bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 d-flex justify-content-around border-buffer',
                    'id': ++bufferContainerIndex
                });
            }
            if(typeof buffer[i] === 'undefined'){
                $bufferContainer.append(helper.createBar(i,1000,{
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'buffer-container',
                    'noBorder': true,
                }).removeClass('d-flex'))
            } else {
                $bufferContainer.append(buffer[i].div)
            }
        }
        for(var i = N; i < Math.ceil(N/2)*2; i++) {
            var bufferContainerBarIndex = itemsInBufferContainer ?  i%(2 * itemsInBufferContainer) : i%(2 * (level + 1)),
                extraBar = helper.createBar(i, 1000, {
                'withNumbers': false,
                'noOrder': true,
                'customBarBlockClasses': 'buffer-container d-none',
            }).removeClass('d-flex');

            if(bufferContainerBarIndex === 0) {
                if(typeof $bufferContainer !== 'undefined') {
                    bufferContainers.push($bufferContainer);
                    $bufferContainer = undefined;
                }
                $bufferContainer = $('<div/>', {
                    'class': 'buffer-container w-100 d-flex justify-content-around border-buffer',
                    'id': ++bufferContainerIndex
                });
            }
            if(typeof buffer[i] === 'undefined'){
                $bufferContainer.append(extraBar)
            } else {
                $bufferContainer.append(buffer[i].div)
            }
            buffer[i] = {
                div:$(extraBar),
                val:maxValue,
            };
            $bufferContainer.append(extraBar);
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
            init = {},
            level = 0,
            N = 0,
            n = 2,
            k = n/2,
            C = 0,
            itemsInBufferContainer = n,
            masterI = 0,
            masterJ = k,
            masterL = 0;

            initMergeSortCode();
            graphContainer.find('.bar-block').each(function(index,$div) {
                init[index] = {
                    div:$($div),
                    val:parseInt($(this).attr('id')),
                };
            });
            N = graphContainer.find('.bar-block').length;
            maxValue = Math.max.apply( null, Object.values( init ).map( c => c.val ) )
            for(var i = N; i < Math.ceil(N/n)*n; i++) {
                var extraBar = helper.createBar(i, 1000, {
                    'withNumbers': false,
                    'noOrder': true,
                    'customBarBlockClasses': 'd-none'
                }).removeClass('d-flex');
                init[i] = {
                    div:$(extraBar),
                    val:maxValue,
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
        }
    };
});
