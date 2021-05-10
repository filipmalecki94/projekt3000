require(['helper',
    'insertion',
    'counting',
    'quicksort'], function (helper, insertion, counting, quicksort) {
    var maxValue = 20,
        collectionSize = 10,
        animationSpeed = 50;

    window.onhashchange = function () {
        $('.main-menu a').removeClass('current');
        $(location.hash.toString()).addClass('current');
        changeSortPage();
    };

    $(document).ready(function () {
        changeSortPage();
    });

    $(window).resize(function (){
        $('.graph .bar').css('width',helper.getBarWidth())
        $('.counter-container .bar').css('width',helper.getBarWidth())
        $('.slot').css('width',helper.getBarWidth())
    });

    function changeSortPage() {
        var hash = location.hash.toString(),
            sort;

        $(hash).addClass('current');
        $('.code-block').empty();
        $('.graph').empty();
        $('.next').unbind();
        $('.counter-container').remove();
        $('.graph-block .sorted').remove();
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
            default:
                console.log('homepage')
                return;
        }
        sort.init(helper.initCollection(collectionSize, maxValue))
            .setAnimationSpeed(animationSpeed);
    }
});
