define([], function () {
    let size = 0,
        max = 0;

    return {
        initCode: function (codeStructure, $codeField) {
            $.each(codeStructure, function (index, value) {
                $codeField.append(
                    $('<div/>', {
                        'class': 'step ' + index,
                        'text': value.line
                    }).css({
                        'margin-left': value.tab * 10
                    })
                )
            });
        },
        initCollection: function (collectionSize, maxValue, barOptions = {}, preCollection = 'random', isTree = false) {
            let that = this,
                $graph = $('.graph'),
                level,
                nodes = [];

            size = collectionSize > 300 ? 300 : collectionSize;
            max = preCollection !== 'collection' ? this.readCookie('max') : maxValue;
            level = 0;

            $graph.css('flex-direction', isTree ? 'column' : 'row');
            if (isTree) {
                let collectionArr = this.getCollectionArr(size, $.inArray(preCollection, ['random', 'collection']) ? collectionSize : maxValue, preCollection, isTree);

                for (let i = 0; i < size; i++) {
                    let $level = that.createLevel(level);

                    for (let j = 0; (j < Math.pow(2, i)) && (j + Math.pow(2, i) <= size); j++) {
                        if (collectionArr[j + Math.pow(2, i) - 1]) {
                            let tempNode = that.createNode(j + Math.pow(2, i) - 1, collectionArr[j + Math.pow(2, i) - 1], {}, size);

                            nodes[j + Math.pow(2, i) - 1] = tempNode;
                            $level.append(tempNode)
                        }
                    }
                    if (!$level.is(':empty')) {
                        level++;
                        $graph.append($level);
                    }
                }
                let $lastLevel = $graph.children().last(),
                    countInLastLevel = $lastLevel.children().length;

                for (let i = 0; i < Math.pow(2, level - 1) - countInLastLevel; i++) {
                    $lastLevel.append(that.createNode(i, null, {}, size))
                }

                for (let i = 0; i < size; i++) {
                    for (let j = 0; (j < Math.pow(2, i)) && (j + Math.pow(2, i) <= size); j++) {
                        if (typeof nodes[Math.floor((j + Math.pow(2, i) - 2) / 2)] != 'undefined') {
                            let line = this.createLine(i, j);

                            $graph.append(line);
                            this.adjustLine(
                                nodes[j + Math.pow(2, i) - 1],
                                nodes[Math.floor((j + Math.pow(2, i) - 2) / 2)],
                                $graph.find('#line-' + (j + Math.pow(2, i) - 1))
                            );
                        }
                    }
                }
            } else {
                $.each(this.getCollectionArr(size, maxValue, preCollection), function (index, value) {
                    $graph.append(that.createBar(index, value, $.extend(barOptions, {'isOversize': size < 31})));
                });
            }

            return $graph;
        },
        getUniqueRandom: function (collection, maxValue) {
            let random = Math.ceil(Math.random() * maxValue);

            if (maxValue < 0) {
                return 0;
            }
            if ($.inArray(random, collection) < 0) {
                return random;
            }

            return this.getUniqueRandom(collection, maxValue)
        },
        getCollectionArr: function (collectionSize, maxValue, preCollection = 'random', isTree = false) {
            let collection = [];

            if (preCollection === 'collection') {
                JSON.parse(this.readCookie('collection') ?? '[]').forEach(function (e, id) {
                    collection.push(parseInt(e))
                });
            } else if (preCollection === 'descending') {
                for (var i = maxValue; i > 0; i--) {
                    collection.push(i);
                }
            } else {
                let maxCollection = preCollection === 'random' ? collectionSize : maxValue;

                for (let i = 1; i <= maxCollection; i++) {
                    if (preCollection === 'unique-random') {
                        collection.push(this.getUniqueRandom(collection, maxValue));
                    }
                    if (preCollection === 'random') {
                        collection.push(Math.ceil(Math.random() * maxValue));
                    }
                    if (preCollection === 'ascending') {
                        collection.push(i);
                    }
                }
            }

            return this.setCollection(collection);
        },
        createBar: function (index, value, customOptions = {}) {
            let $bar,
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
            options = $.extend(options, customOptions);
            $bar = $('<div/>', {
                'class': 'bar ' + options.customBarClasses,
            }).css({
                'height': options.height ?? (0.85 * 100 * value / this.getMaxValue()) + '%',
                'background-color': options.backgroundColor ?? this.getHslValue(100 * value / this.getMaxValue(), 100, 350),
                'width': options.barWidth ?? this.getBarWidth(),
                'top': options.glueToTop ? '25px' : 'unset',

            });

            if (options.onlyBar) {
                return $bar;
            }

            return $('<div/>', {
                'id': options.barBlockId ?? (value !== null ? value : 'empty'),
                'class': 'bar-block d-flex justify-content-center ' + (options.noBorder ? '' : 'border-black ') + options.customBarBlockClasses,
                'text': (options.withNumbers ?? false) || options.isOversize ? value : '',
                'data-index': index
            }).css({
                'color': this.getHslValue(100 * value / this.getMaxValue(), 100, 350),
                'order': options.noOrder ? null : index
            }).append($bar);
        },
        getBarWidth: function () {
            let $graphContainer = $('.graph'),
                graphContainerWidth = $graphContainer.innerWidth(),
                barWidthInContainer = graphContainerWidth / size;

            return barWidthInContainer > 10 ? 10 : barWidthInContainer - barWidthInContainer * 0.85;
        },
        createLevel: function (level) {
            return $('<div/>', {
                'class': 'level',
                'level-id': level
            }).css({
                'width': '100%',
                'height': '60px',
                'display': 'flex',
                'position': 'relative',
                'justify-content': 'space-around',
            });
        },
        createNode: function (index, value, customOptions, size = 1) {
            let $node,
                options = {
                    'customBarClasses': ''
                };

            options = $.extend(options, customOptions);

            $node = $('<div/>', {
                'class': 'node ' + options.customBarClasses,
                'text': value ?? ''
            }).css({
                'height': '30px',
                'width': '30px',
                'border': '2px solid',
                'border-color': this.getHslValue(100 * Math.floor((index + 1) / 2), 100, 350),
                'color': 'white',
                'display': 'flex',
                'justify-content': 'center',
                'align-items': 'center',
                'background': 'black',
                'z-index': 1
            });

            if (value === null) {
                $node.css('visibility', 'hidden')
            }

            return $node;
        },
        createLine: function (i, j) {
            return $('<div/>', {'id': 'line-' + (j + Math.pow(2, i) - 1)})
                .css({
                    'position': 'absolute',
                    'width': '2px',
                    'background-color': this.getHslValue(100 * Math.floor((j + Math.pow(2, i)) / 2), 100, 350)
                });
        },
        getMaxValue: function () {
            return max;
        },
        getStepButton: function () {
            return $('.next');
        },
        copyObj: function (obj) {
            return $.extend(true, {}, obj);
        },
        getHslValue: function (percent, start, end) {
            let a = percent / 100,
                b = (end - start) * a,
                c = b + start;

            return 'hsl(' + c + ', 100%, 50%)';
        },
        changeCodeHighlight: function (ids, time) {
            setTimeout(function () {
                $('.code .highlight').removeClass('highlight');
                $.each(Array.isArray(ids) ? ids : [ids], function (index, value) {
                    $('.step.' + value).addClass('highlight');
                });
            }, time);
        },
        darkenBars: function ($object, callback = null, brightenBars = false) {
            $object.animate({opacity: brightenBars ? 1 : 0.2}, 100, callback);
        },
        createCookie: function (name, value, days) {
            let expires;

            if (days) {
                let date = new Date();

                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },
        readCookie: function (name) {
            let nameEQ = encodeURIComponent(name) + "=",
                ca = document.cookie.split(';');

            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];

                while (c.charAt(0) === ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }

            return null;
        },
        setCollection: function (collection) {
            collection = collection
                .map(function (e, i) {
                    return parseInt(e) ?? 0;
                })
                .filter(function (e, i) {
                    return !Number.isNaN(e) && $('.numerical-fields input#max-input').attr('max') > e && $('.numerical-fields input#size-input').attr('max') > i;
                });

            this.createCookie('collection', JSON.stringify(collection))
            $('.collection-input')[0].value = collection ?? '';

            return collection;
        },
        setNumericalInputEvent: function (inputName) {
            let that = this, val;

            $('.numerical-fields input#' + inputName + '-input').on('change', function ($e) {
                val = $e.currentTarget.value;
                that.createCookie(inputName, $e.currentTarget.value)
            });

            return val;
        },
        adjustLine: function (from, to, line) {
            let fromTop = from.offset().top + from.width() / 2,
                toTop = to.offset().top + to.height() / 2,
                fromLeft = from.offset().left + from.width() / 2,
                toLeft = to.offset().left + to.width() / 2,
                toFromTop = Math.abs(toTop - fromTop),
                toFromLeft = Math.abs(toLeft - fromLeft),
                H = Math.sqrt(toFromTop * toFromTop + toFromLeft * toFromLeft),
                ANG = 180 / Math.PI * Math.acos(toFromTop / H),
                $graphicalSection = $('.graphical-section'),
                top, left;

            if (toTop > fromTop) {
                top = (toTop - fromTop) / 2 + fromTop;
            } else {
                top = (fromTop - toTop) / 2 + toTop;
            }
            if (toLeft > fromLeft) {
                left = (toLeft - fromLeft) / 2 + fromLeft;
            } else {
                left = (fromLeft - toLeft) / 2 + toLeft;
            }

            if (
                (fromTop < toTop && fromLeft < toLeft) ||
                (toTop < fromTop && toLeft < fromLeft) ||
                (fromTop > toTop && fromLeft > toLeft) ||
                (toTop > fromTop && toLeft > fromLeft)
            ) {
                ANG *= -1;
            }

            top -= H / 2;
            top -= ($graphicalSection.offset().top + parseInt($('.graph-block').css('margin-top')));
            left -= $graphicalSection.offset().left

            line.css({
                '-webkit-transform': 'rotate(' + ANG + 'deg)',
                '-moz-transform': 'rotate(' + ANG + 'deg)',
                '-ms-transform': 'rotate(' + ANG + 'deg)',
                '-o-transform': 'rotate(' + ANG + 'deg)',
                '-transform': 'rotate(' + ANG + 'deg)',
                'top': top + 'px',
                'left': left + 'px',
                'height': H + 'px'
            });
        }
    }
});