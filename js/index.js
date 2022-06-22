require(['helper',
    'insertion',
    'counting',
    'quicksort',
    'mergesort',
    'heapsort',
    'radixsort'], function (helper, insertion, counting, quicksort, mergesort, heapsort, radixsort) {
    let maxValue = helper.readCookie('max') != null ? helper.readCookie('max') : 7,
        collectionSize = helper.readCookie('size') != null ? helper.readCookie('size') : 7,
        animationSpeed = helper.readCookie('speed') != null ? helper.readCookie('speed') : 500,
        preCollection = helper.readCookie('preCollection') ?? 'random',
        barOptions = {},
        playInterval,
        sort;

    window.onhashchange = function () {
        clearInterval(playInterval);
        $('.header ul li').removeClass('current');
        $(location.hash.toString()).closest('li').addClass('current');
        changeSortPage(true);
    };

    $(document).ready(function () {
        $('.numerical-fields input#size-input').val(collectionSize)
        $('.numerical-fields input#size-input').on('change', function ($e) {
            collectionSize = $e.currentTarget.value;
            helper.createCookie('size', $e.currentTarget.value)
        }).trigger('change');
        $('.numerical-fields input#max-input').val(maxValue)
        $('.numerical-fields input#max-input').on('change', function ($e) {
            maxValue = $e.currentTarget.value;
            helper.createCookie('max', $e.currentTarget.value)
        }).trigger('change');
        $('.numerical-fields input#speed-input').val(animationSpeed)
        $('.numerical-fields input#speed-input').on('change', function ($e) {
            animationSpeed = $e.currentTarget.value;
            helper.createCookie('speed', $e.currentTarget.value)
            sort && sort.setAnimationSpeed($e.currentTarget.value)
        }).trigger('change');

        $('.control-buttons #play').on('click', function () {
            playInterval = setInterval(function () {
                helper.getStepButton().trigger('click');
            }, sort.getAnimationSpeed());
        });

        $('.control-buttons #stop').on('click', function (e) {
            clearInterval(playInterval);
        })

        $('#control-panel .modal-header .shrink-modal').on('click', function () {
            $(this).hide();
            $('#control-panel .modal-body').hide();
            $('#control-panel .modal-header .expand-modal').show();
        })

        $('#control-panel .modal-header .expand-modal').on('click', function () {
            $(this).hide();
            $('#control-panel .modal-body').show();
            $('#control-panel .modal-header .shrink-modal').show();
        })

        $('.header ul li').removeClass('current');
        $(location.hash.toString()).closest('li').addClass('current');

        $(".modal").draggable({
            handle: ".modal-header"
        });

        changeSortPage(true);
        setGenerateButtonsEvents();

        $('.numerical-fields input#size-input')[0].value = collectionSize;
        $('.numerical-fields input#max-input')[0].value = maxValue;
        $('.numerical-fields input#speed-input')[0].value = animationSpeed;
    });

    $(window).resize(function () {
        let $tree = $('.graph.tree'), $nodes = $tree.find('.node'), size = $nodes.length, nodes = [];

        $('.graph .bar').css('width', helper.getBarWidth())
        $('.counter-container .bar').css('width', helper.getBarWidth())
        $('.slot').css('width', helper.getBarWidth())

        $.each($nodes, function (i, e) {
            nodes[$(e).attr('node-id')] = $(e)
        });

        if (size > 0) {
            for (let i = 0; i < size; i++) {
                for (let j = 0; (j < Math.pow(2, i)) && (j + Math.pow(2, i) <= size); j++) {
                    if (typeof nodes[Math.floor((j + Math.pow(2, i) - 2) / 2)] != 'undefined' && typeof nodes[j + Math.pow(2, i) - 1] !== 'undefined') {
                        helper.adjustLine(
                            nodes[j + Math.pow(2, i) - 1],
                            nodes[Math.floor((j + Math.pow(2, i) - 2) / 2)],
                            $tree.find('#line-' + (j + Math.pow(2, i) - 1))
                        );
                    }
                }
            }
        }
    });

    function generateEventFunc(type, withSetCollection = false, maxValueSize = false) {
        preCollection = type;
        helper.createCookie('preCollection', type)

        if (maxValueSize) {
            if (type == 'collection') {
                let collectionInput = $('.collection-input')[0].value.trim().split(/[\s,]+/);

                maxValue = Math.max(...collectionInput.map(function (x) {
                    return parseInt(x, 10);
                }))
                collectionSize = collectionInput.length;
            } else {
                collectionSize = maxValue = $('.numerical-fields input#size-input')[0].value;
            }
            $('.numerical-fields input#size-input').val(collectionSize)
            $('.numerical-fields input#max-input').val(maxValue)
        } else {
            collectionSize = $('.numerical-fields input#size-input')[0].value;
        }
        if (withSetCollection) {
            setCollection($('.collection-input')[0].value.trim().split(/[\s,]+/));
        }
        changeSortPage(true);
    }

    function setGenerateButtonsEvents() {
        let obj = {
            'collection': {'withSetCollection': true, 'maxSizeValue': true},
            'random': {'withSetCollection': true, 'maxSizeValue': false},
            'unique-random': {'withSetCollection': true, 'maxSizeValue': true},
            'ascending': {'withSetCollection': false, 'maxSizeValue': true},
            'descending': {'withSetCollection': false, 'maxSizeValue': true}
        };

        Object.keys(obj).forEach(function (type) {
            $('.modal-body #' + type).on('click', function () {
                generateEventFunc(type, obj[type]['withSetCollection'], obj[type]['maxSizeValue']);
            });
        });
    }

    function setCollection(collection) {
        collection = helper.setCollection(collection)
        helper.createCookie('max', maxValue = collection.length > 0 ? Math.max(...collection) : 0)
    }

    function changeSortPage(preload = false) {
        let hash = location.hash.toString(), isTree = false,
            cookieCollectionSize = JSON.parse(helper.readCookie('collection') ?? '{}').length;

        clearInterval(playInterval);
        helper.setComparisonCounter(0);
        $('.numerical-fields input#speed-input').value = animationSpeed
        $(hash).addClass('current');
        $('.code-container').empty();
        $('.graph').empty().removeAttr('style');
        $('.next').unbind();
        $('.counter-container').remove();
        $('.buffer').remove();
        $('.graph-block .sorted').remove();
        $('.partition').remove();
        $('.graph.tree').remove();
        $('body').attr('id', '').attr('id', hash.replace('#', ''))

        $('.numerical-fields input#max-input').trigger('change')
        $('.numerical-fields input#size-input').trigger('change')
        $('.numerical-fields input#speed-input').trigger('change')

        $('.collection-input')[0].value = cookieCollectionSize ?? '';

        switch (hash) {
            case '#insertion-sort':
                barOptions = {
                    'withNumbers': true
                };
                sort = insertion;
                break;
            case '#counting-sort':
                barOptions = {
                    'withNumbers': true
                };
                sort = counting;
                break;
            case '#quicksort':
                barOptions = {
                    'withNumbers': true
                };
                sort = quicksort;
                break;
            case '#mergesort':
                sort = mergesort;
                barOptions = {
                    'withNumbers': true,
                    'noOrder': true,
                    'noBorder': true,
                    'customBarBlockClasses': 'border-buffer'
                }
                break;
            case '#heapsort':
                sort = heapsort;
                isTree = true;
                barOptions = {
                    'withNumbers': true,
                }
                break;
            case '#radixsort':
                sort = radixsort;
                barOptions = {
                    'withNumbers': true,
                    'multidigit': true,
                    'fillWithZeros': true
                }
                break;
            default:
                console.log('homepage')
                return;
        }
        sort
            .init(
                helper.initCollection(
                    collectionSize,
                    maxValue,
                    barOptions,
                    preload ? preCollection : 'random',
                    isTree
                )
            )
            .setAnimationSpeed(animationSpeed);

    }
});
