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
        initCollection: function  (collectionSize, maxValue) {
            var that = this,
                $graph = $('.graph');

            size = collectionSize > 300 ? 300 : collectionSize;
            max = maxValue;
            $.each(this.getCollectionArr(size, maxValue), function (index, value){
                $graph.append(that.createBar(index, value,{'isOversize': size < 31}));
            });

            return $graph;
        },
        getCollectionArr: function (collectionSize, maxValue) {
            var collection = [];

            for(var i=0; i < collectionSize; i++){
                collection.push(Math.ceil(Math.random() * maxValue));
            }

            return collection;
        },
        createBar: function  (index, value, customOptions = {}) {
            var $bar,
                options = {
                    'withNumbers': null,
                    'glueToTop': false,
                    'height': null,
                    'barWidth': null,
                    'onlyBar': false,
                    'customBarClasses': '',
                    'customBarBlockClasses': '',
                    'backgroundColor': null,
                    'noBorder': null,
                    'isOversize': false,
                };
            $.extend(options,customOptions);
           $bar = $('<div/>',{
                    'class':'bar ' + options.customBarClasses,
                }).css({
                    'height': options.height ?? (0.85 * 100 * value / this.getMaxValue()) + '%',
                    'background-color': options.backgroundColor ?? this.getHslValue( 100 * value / this.getMaxValue(), 100, 350),
                    'width': options.barWidth ?? this.getBarWidth(),
                    'top': options.glueToTop ? '25px' : 'unset',

                });

            if(options.onlyBar){
                return $bar;
            }
            return $('<div/>',{
                'id': value !== null ? value : 'empty',
                'class':'bar-block d-flex justify-content-center ' +
                    (options.noBorder ?? 'border-black ') + options.customBarBlockClasses,
                'text': (options.withNumbers ?? false) || options.isOversize ? value : '',
                'data-index': index
            }).css({
                'color': this.getHslValue( 100 * value / this.getMaxValue(), 100, 350),
                'order': index
            }).append($bar);
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
        changeCodeHighlight: function (ids,time) {
            setTimeout(function() {
                $('.code .highlight').removeClass('highlight');
                $.each(Array.isArray(ids) ? ids : [ids], function (index, value) {
                    $('.step.' + value).addClass('highlight');
                });
            }, time);
        }
    }
});