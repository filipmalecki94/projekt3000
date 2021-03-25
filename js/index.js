require(['helper','insertion','quicksort'], function (helper, insertion, quicksort) {
    var maxValue = 10,
        collectionSize = 10;

    $(document).ready(function () {
        changeSortPage();
    });

    $(window).resize(function (){
        $('.bar').css('width',helper.getBarWidth())
    });

    window.onhashchange = function () {
        $('.main-menu a').removeClass('current');
        $(location.hash.toString()).addClass('current');
        changeSortPage();
    };

    function changeSortPage() {
        var hash = location.hash.toString();

        $(hash).addClass('current');
        $('.code-block').empty();
        $('.graph').empty();
        $('.next').unbind();
        switch (hash){
            case '#insertion-sort':
                insertion.init(helper.initCollection(collectionSize, maxValue, true))
                break;
            case '#counting-sort':
                break;
            case '#quicksort':
                quicksort.init(helper.initCollection(collectionSize, maxValue))
                break;
            default:
                console.log('x')
                break
        }
    }
});
