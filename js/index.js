var maxValue = 10,
    collectionSize = 5;

$(document).ready(function () {
    $(location.hash.toString()).addClass('current');
    initInsertSort();
});

$(window).resize(function (){
    $('.bar').css('width',getBarWidth())
});

window.onhashchange = function () {
   $('.main-menu a').removeClass('current');
   $(location.hash.toString()).addClass('current');
};

function initInsertSort() {
    initCollection(true);
    initInsertionSortCode();
}

function initInsertionSortCode() {
    var $codeField = $('<div/>',{
                        'class': 'code m-1'
                    }),
        codeStructure = [
        {'line' : 'int i,key,j;','tab':0},
        {'line' : 'for(i = 1; i < n; i++) {', 'tab' : 0},
        {'line' : 'key = arr[i];', 'tab' : 1},
        {'line' : 'j = i - 1;', 'tab' : 1},
        {'line' : 'while(j >= 0 && arr[j] > key) {', 'tab' : 1},
        {'line' : 'arr[j + 1] = arr[j];', 'tab' : 2},
        {'line' : 'j = j - 1;', 'tab' : 2},
        {'line' : '}', 'tab' : 1},
        {'line' : 'arr[j + 1] = key;', 'tab' : 1},
        {'line' : '}', 'tab' : 0},
    ];

    $.each(codeStructure,function (index,value){
        console.log(value.line)
        $codeField.append(
            $('<div/>',{
                'class' : 'step ' + index,
                'text' : value.line
            }).css({
                'margin-left' : value.tab * 10
            })
        )
    });

    $('.code-block').append($codeField);
}

function initCollection ($withNull = false) {
    $.each(getCollectionArr(), function (index, value){
        $('.graph').append(createBar(value));
    });
    if($withNull){
        $('.graph').append(createBar(null));
    }
}

function getCollectionArr() {
    var collection = [];

    for(var i=0; i < collectionSize; i++){
        collection.push(Math.floor(Math.random() * maxValue) + 1);
    }

    return collection;
}

function createBar (value) {
    return $('<div/>',{
            'id': value !== null ? value : 'empty',
            'class':'bar-block d-flex justify-content-center',
            'text': collectionSize < 50 ? value : ''
        }).css({
            'color':
                getHslValue( 100 * value / getMaxValue(), 0, 300)
        }).append(
            $('<div/>',{
                'class':'bar',
            }).css({
                'height':(0.85 * 100 * value / getMaxValue()) + '%',
                'background-color': getHslValue( 100 * value / getMaxValue(), 0, 300),
                'width': getBarWidth()
            })
        );
}

function getBarWidth () {
    var $graphContainer = $('.graph'),
        graphContainerWidth = $graphContainer.innerWidth(),
        barWidthInContainer = graphContainerWidth/collectionSize;

    return barWidthInContainer > 10 ? 10 : barWidthInContainer - barWidthInContainer * 0.85;
}

function getMaxValue() {
    return maxValue;
}

function getHslValue(percent, start, end) {
    var a = percent / 100,
        b = (end - start) * a,
        c = b + start;

    return 'hsl(' + c + ', 100%, 50%)';
}