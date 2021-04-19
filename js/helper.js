define([], function () {
    var size = 0,
        max = 0;

    return {
        initCode: function (codeStructure, $codeField) {
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
        },
        initCollection: function  (collectionSize, maxValue, $withNull = false) {
            var that = this,
                $graph = $('.graph');

            size = collectionSize;
            max = maxValue;
            $.each(this.getCollectionArr(collectionSize, maxValue), function (index, value){
                $graph.append(that.createBar(value));
            });
            if($withNull){
                $graph.append(that.createBar(null));
            }

            return $graph;
        },
        getCollectionArr: function (collectionSize, maxValue) {
            var collection = [];

            for(var i=0; i < collectionSize; i++){
                collection.push(Math.ceil(Math.random() * maxValue));
            }

            return collection;
        },
        createBar: function  (value) {
            return $('<div/>',{
                'id': value !== null ? value : 'empty',
                'class':'bar-block d-flex justify-content-center',
                'text': size < 50 ? value : ''
            }).css({
                'color':
                    this.getHslValue( 100 * value / this.getMaxValue(), 0, 300)
            }).append(
                $('<div/>',{
                    'class':'bar',
                }).css({
                    'height':(0.85 * 100 * value / this.getMaxValue()) + '%',
                    'background-color': this.getHslValue( 100 * value / this.getMaxValue(), 0, 300),
                    'width': this.getBarWidth()
                })
            );
        },
        getBarWidth: function  () {
            var $graphContainer = $('.graph'),
                graphContainerWidth = $graphContainer.innerWidth(),
                barWidthInContainer = graphContainerWidth/size;

            return barWidthInContainer > 10 ? 10 : barWidthInContainer - barWidthInContainer * 0.85;
        },
        getMaxValue: function () {
            return max;
        },
        getStepButton: function () {
            return $('.next');
        },
        copyObj: function (obj) {
            return $.extend(true,{},obj);
        },
        getHslValue: function (percent, start, end) {
            var a = percent / 100,
                b = (end - start) * a,
                c = b + start;

            return 'hsl(' + c + ', 100%, 50%)';
        },
        changeCodeHighlight: function (id,time) {
            setTimeout(function(){
                $('.code .highlight').removeClass('highlight');
                $('.step.'+id).addClass('highlight');
            },time);
        }
    }
});