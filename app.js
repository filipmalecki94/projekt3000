requirejs.config({
    baseUrl: 'js',
    paths: {
        app: '../app',
        insertion: 'insertion-sort',
        counting: 'counting-sort',
        quicksort: 'quick-sort',
        mergesort: 'merge-sort',
        heapsort: 'heap-sort',
        helper: 'helper'
    }
});
requirejs(['index']);
