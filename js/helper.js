define([], function () {
    var size = 0,
        max = 0;

    return {
        initCode: function (codeStructure, $codeField) {
            $.each(codeStructure,function (index,value){
                $codeField.append(
                    $('<div/>',{
                        'class' : 'step ' + index,
                        'text' : value.line
                    }).css({
                        'margin-left' : value.tab * 10
                    })
                )
            });
        },
        initCollection: function  (collectionSize, maxValue, barOptions = {}, preCollection = 'random') {
            var that = this,
                $graph = $('.graph');

            size = collectionSize > 300 ? 300 : collectionSize;
            max = preCollection !== 'collection' ? this.readCookie('max') : maxValue;
            $.each(this.getCollectionArr(size, maxValue, preCollection), function (index, value){
                $graph.append(that.createBar(index, value,$.extend(barOptions,{'isOversize': size < 31})));
            });

            return $graph;
        },
        getUniqueRandom: function (collection, maxValue){
            var random = Math.ceil(Math.random() * maxValue);
            if(maxValue < 0){
                return 0;
            }
            if($.inArray(random, collection) < 0) {
                return random;
            }

            return this.getUniqueRandom(collection, maxValue)
        },
        getCollectionArr: function (collectionSize, maxValue, preCollection = 'random') {
            var collection = [];

            if(preCollection === 'collection') {
                JSON.parse(this.readCookie('collection') ?? '{}').forEach(function (e,id){
                    collection.push(parseInt(e))
                });
            } else if(preCollection === 'descending') {
                for(var i = maxValue; i > 0; i--) {
                    collection.push(i);
                }
            } else {
                var maxCollection = preCollection === 'random' ? collectionSize : maxValue;

                for(var i=1; i <= maxCollection; i++){
                    if(preCollection === 'unique-random') {
                        collection.push(this.getUniqueRandom(collection, maxValue));
                    }
                    if(preCollection === 'random') {
                        collection.push(Math.ceil(Math.random() * maxValue));
                    }
                    if(preCollection === 'ascending') {
                        collection.push(i);
                    }
                }
            }

            return this.setCollection(collection);
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
                    'barBlockId': null,
                    'backgroundColor': null,
                    'noBorder': null,
                    'isOversize': false,
                    'noOrder': index
                };
            options = $.extend(options,customOptions);
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
                'id': options.barBlockId ?? (value !== null ? value : 'empty'),
                'class':'bar-block d-flex justify-content-center ' + (options.noBorder ? '' : 'border-black ')
                     + options.customBarBlockClasses,
                'text': (options.withNumbers ?? false) || options.isOversize ? value : '',
                'data-index': index
            }).css({
                'color': this.getHslValue( 100 * value / this.getMaxValue(), 100, 350),
                'order': options.noOrder ? null : index
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
        },
        darkenBars: function($object, callback = null, brightenBars = false) {
            $object.animate({opacity: brightenBars ? 1 : 0.2}, 100, callback);
        },
        createCookie(name, value, days) {
            var expires;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },
        readCookie(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ')
                    c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0)
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },
        setCollection(collection) {
            collection = collection
                .map(function (e,i) {
                    return parseInt(e) ?? 0;
                })
                .filter(function (e,i) {
                    return !Number.isNaN(e) && $('.numerical-fields input#max-input').attr('max') > e && $('.numerical-fields input#size-input').attr('max') > i;
                });

            this.createCookie('collection', JSON.stringify(collection))
            $('.collection-input')[0].value =  collection ?? '';

            return collection;
        },
        setNumericalInputEvent (inputName) {
            let that = this, val;

            $('.numerical-fields input#'+inputName+'-input').on('change',function ($e) {
                val = $e.currentTarget.value;
                that.createCookie(inputName, $e.currentTarget.value)
            });

            return val;
        }
    }
});