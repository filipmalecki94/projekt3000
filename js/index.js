require(['helper','insertion','counting','quicksort'], function (helper, insertion, counting, quicksort) {
    var maxValue = 10,
        collectionSize = 50;

    $(document).ready(function () {
        changeSortPage();
    });

    $(window).resize(function (){
        $('.bar').css('width',helper.getBarWidth())
        $('.slot').css('width',helper.getBarWidth())
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
        $('.counter').remove();
        $('.graph-block .sorted').remove();
        $('body').attr('class','').addClass(hash.replace('#',''))
        switch (hash){
            case '#insertion-sort':
                insertion.init(helper.initCollection(collectionSize, maxValue))
                break;
            case '#counting-sort':
                counting.init(helper.initCollection(collectionSize, maxValue))
                break;
            case '#quicksort':
                quicksort.init(helper.initCollection(collectionSize, maxValue))
                break;
            default:
                console.log('homepage')
                break
        }
    }
});
