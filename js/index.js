var maxValue = 10,
    collectionSize = 5;

$(document).ready(function () {
    changeSortPage();
});

$(window).resize(function (){
    $('.bar').css('width',getBarWidth())
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
            initInsertSort();
            break;
        case '#counting-sort':
            break;
        case '#quicksort':
            initQuicksort();
            break;
        default:
            console.log('x')
            break
    }
}

function initInsertSort() {
    initCollection(true);
    initInsertionSortCode();
}

function initQuicksort() {
    initCollection();
    initQuicksortCode();
}

function initInsertionSortCode() {
    var $codeField = $('<div/>',{'class': 'code m-1'}),
        codeStructure = [
        {'line' : 'int <span style="color: red">i</span>,<span style="color: green">key</span>,<span style="color: blue">j</span>;','tab':0},
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

    initCode(codeStructure,$codeField);
    $('.code-block').append($codeField);
}

function initQuicksortCode() {
    var $codeFieldSort = $('<div/>',{'class': 'code m-1 h-50'}),
        $codeFieldPartition = $('<div/>',{'class': 'code m-1 h-50'}),
        codeStructureSort = [
            {'line' : 'if(low < high) {', 'tab' : 0},
            {'line' : 'int pi = partition(arr, low, high);', 'tab' : 1},
            {'line' : '&nbsp;', 'tab' : 1},
            {'line' : 'quickSort(arr, pi + 1, high);', 'tab' : 1},
            {'line' : 'quickSort(arr, low, pi - 1);', 'tab' : 1},
            {'line' : '}', 'tab' : 0},
        ],
        codeStructurePartition = [
            {'line' : 'int pivot = arr[high];', 'tab' : 0},
            {'line' : 'int i = (low - 1);', 'tab' : 0},
            {'line' : '&nbsp;', 'tab' : 0},
            {'line' : 'for(int j = low; j <= high-1; j++) {', 'tab' : 0},
            {'line' : 'if(arr[j] < pivot) {', 'tab' : 1},
            {'line' : 'i++;', 'tab' : 2},
            {'line' : 'swap(&arr[i}, &arr[j]);', 'tab' : 2},
            {'line' : '}', 'tab' : 1},
            {'line' : '}', 'tab' : 0},
            {'line' : 'swap(&arr[i+1},&arr[high];', 'tab' : 0},
            {'line' : 'return (i+1);', 'tab' : 0},
        ];

        initCode(codeStructureSort,$codeFieldSort);
        initCode(codeStructurePartition,$codeFieldPartition);
        $('.code-block').append($codeFieldPartition).append($codeFieldSort)
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

function initCode(codeStructure,$codeField) {
    $.each(codeStructure,function (index,value){
        $codeField.append(
            $('<div/>',{
                'class' : 'step ' + index,
                'html' : value.line
            }).css({
                'margin-left' : value.tab * 10
            })
        )
    });

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