require(['helper',
    'insertion',
    'counting',
    'quicksort',
    'mergesort'], function (helper, insertion, counting, quicksort, mergesort) {
    var maxValue = helper.readCookie('max') ?? $('.numerical-fields input#max-input')[0].value ?? 25,
        collectionSize = helper.readCookie('size') ?? $('.numerical-fields input#size-input')[0].value ?? 25,
        animationSpeed = helper.readCookie('speed') ?? $('.numerical-fields input#speed-input')[0].value ?? 1000,
        preCollection = helper.readCookie('preCollection') ?? 'random',
        barOptions = {}, playInterval;

    window.onhashchange = function () {
        $('.main-menu a').removeClass('current');
        $(location.hash.toString()).addClass('current');
        changeSortPage(true);
    };

    $("#control-panel").draggable({
        handle: ".modal-header"
    });

    $('.control-buttons #play').on('click',function (){
        playInterval = setInterval(function (){
            helper.getStepButton().trigger('click');
        }, 1000)
    })
    $('.control-buttons #stop').on('click',function (){
        clearInterval(playInterval);
    })

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

    function setCollection(collection) {
        collection = helper.setCollection(collection)

        collectionSize = collection.length
        maxValue = collection.length > 0 ? Math.max(...collection) : 0
    }

    $('.collection-field .generate-collection').on('click',function () {
        preCollection = 'collection';
        helper.createCookie('preCollection', 'collection')
        setCollection($('.collection-input')[0].value.trim().split(/[\s,]+/))
        changeSortPage();
    });
    $('.generate-buttons #random').on('click',function () {
        preCollection = 'random';
        helper.createCookie('preCollection', 'random')
        changeSortPage();
        setCollection($('.collection-input')[0].value.trim().split(/[\s,]+/))
    });
    $('.generate-buttons #ascending').on('click',function () {
        preCollection = 'ascending';
        collectionSize = maxValue;
        helper.createCookie('preCollection', 'ascending')
        changeSortPage();
    });
    $('.generate-buttons #descending').on('click',function () {
        preCollection = 'descending';
        collectionSize = maxValue;
        helper.createCookie('preCollection', 'descending')
        changeSortPage();
    });

    $(document).ready(function () {
        $('.numerical-fields input#size-input')[0].value = collectionSize;
        $('.numerical-fields input#max-input')[0].value = maxValue;
        $('.numerical-fields input#speed-input')[0].value = animationSpeed;
        $('.collection-input')[0].value = JSON.parse(helper.readCookie('collection'))
        changeSortPage();
    });

    $(window).resize(function (){
        $('.graph .bar').css('width',helper.getBarWidth())
        $('.counter-container .bar').css('width',helper.getBarWidth())
        $('.slot').css('width',helper.getBarWidth())
    });

    function changeSortPage(loadFromCookie = false) {
        var hash = location.hash.toString(),
            sort;

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
            default:
                console.log('homepage')
                return;
        }

            sort.init(helper.initCollection(collectionSize, maxValue, barOptions,loadFromCookie ? 'collection' : preCollection))
                .setAnimationSpeed(animationSpeed);

    }
});
