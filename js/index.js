require(['helper',
    'insertion',
    'counting',
    'quicksort',
    'mergesort',
    'heapsort'], function (helper, insertion, counting, quicksort, mergesort, heapsort) {
    var maxValue = helper.readCookie('max') ?? $('.numerical-fields input#max-input')[0].value ?? 25,
        collectionSize = helper.readCookie('size') ?? $('.numerical-fields input#size-input')[0].value ?? 25,
        animationSpeed = helper.readCookie('speed') ?? $('.numerical-fields input#speed-input')[0].value ?? 1000,
        preCollection = helper.readCookie('preCollection') ?? 'random',
        barOptions = {},
        playInterval,
        sort;

    window.onhashchange = function () {
        $('.main-menu a').removeClass('current');
        $(location.hash.toString()).addClass('current');
        changeSortPage(true);
    };

    $('.modal-expand').on('click', function (e) {
        $(this).closest('.modal-dialog').toggleClass('expand')
    })

    $('.control-buttons #play').on('click',function (e){
        playInterval = setInterval(function (){
            helper.getStepButton().trigger('click');
        }, sort.getAnimationSpeed())
    })
    $('.control-buttons #stop').on('click',function (e){
        clearInterval(playInterval);
    })

    $(document).ready(function () {
        $('.numerical-fields input#size-input').on('change',function ($e) {
            collectionSize = $e.currentTarget.value;
            helper.createCookie('size', $e.currentTarget.value)
        });
        $('.numerical-fields input#max-input').on('change',function ($e) {
            maxValue = $e.currentTarget.value;
            helper.createCookie('max', $e.currentTarget.value)
        });
        $('.numerical-fields input#speed-input').on('change',function ($e) {
            animationSpeed = $e.currentTarget.value;
            helper.createCookie('speed', $e.currentTarget.value)
        });
        $('.numerical-fields input#size-input')[0].value = collectionSize;
        $('.numerical-fields input#max-input')[0].value = maxValue;
        $('.numerical-fields input#speed-input')[0].value = animationSpeed;
        $('.collection-input')[0].value = JSON.parse(helper.readCookie('collection') ?? '{}')
        setGenerateButtonsEvents();
        changeSortPage();
    });

    $(window).resize(function (){
        $('.graph .bar').css('width',helper.getBarWidth())
        $('.counter-container .bar').css('width',helper.getBarWidth())
        $('.slot').css('width',helper.getBarWidth())
    });

    function generateEventFunc(type, withSetCollection = false, maxValueSize = false) {
        preCollection = type;
        helper.createCookie('preCollection', type)

        maxValue = $('.numerical-fields input#max-input')[0].value;
        if(maxValueSize) {
            collectionSize = maxValue;
        } else {
            collectionSize = $('.numerical-fields input#size-input')[0].value;
        }
        if(withSetCollection) {
            setCollection($('.collection-input')[0].value.trim().split(/[\s,]+/));
        }
        changeSortPage(true);
    }

    function setGenerateButtonsEvents() {
        let obj = {
                'collection':{'withSetCollection':true, 'maxSizeValue':false},
                'random':{'withSetCollection':false, 'maxSizeValue':false},
                'unique-random':{'withSetCollection':false, 'maxSizeValue':true},
                'ascending':{'withSetCollection':false, 'maxSizeValue':true},
                'descending':{'withSetCollection':false, 'maxSizeValue':true}
            };

        Object.keys(obj).forEach(function(type) {
            $('.modal-body #'+type).on('click',function () {
               generateEventFunc(type, obj[type]['withSetCollection'], obj[type]['maxValueSize']);
            });
        });
    }

    function setCollection(collection) {
        collection = helper.setCollection(collection)
        collectionSize = collection.length
        // maxValue = collection.length > 0 ? Math.max(...collection) : 0
        helper.createCookie('max',maxValue = collection.length > 0 ? Math.max(...collection) : 0)
    }

    function changeSortPage(preload = false) {
        var hash = location.hash.toString(), isTree = false;

        barOptions = null;
        clearInterval(playInterval);
        $('.numerical-fields input#speed-input').value = animationSpeed
        $(hash).addClass('current');
        $('.code-block').empty();
        $('.graph').empty();
        $('.next').unbind();
        $('.counter-container').remove();
        $('.buffer').remove();
        $('.graph-block .sorted').remove();
        $('.partition').remove();
        $('body').attr('class','').addClass(hash.replace('#',''))

        switch (hash){
            case '#insertion-sort':
                sort = insertion;
                break;
            case '#counting-sort':
                sort = counting;
                break;
            case '#quicksort':
                sort = quicksort;
                break;
            case '#mergesort':
                sort = mergesort;
                barOptions = {
                    'withNumbers': false,
                    'noOrder': true,
                    'noBorder': true,
                    'customBarBlockClasses': 'border-buffer'
                }
                break;
            case '#heapsort':
                sort = heapsort;
                isTree = true;
                break;
            default:
                console.log('homepage')
                return;
        }
        sort
            .init(
                helper.initCollection(
                    collectionSize,
                    maxValue,
                    barOptions,
                    preload ? preCollection : 'collection',
                    isTree
                )
            )
            .setAnimationSpeed(animationSpeed);

    }
});
