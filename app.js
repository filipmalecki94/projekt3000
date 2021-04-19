requirejs.config({
    baseUrl: 'js',
    paths: {
        app: '../app',
        insertion: 'insertion-sort',
        counting: 'counting-sort',
        quicksort: 'quick-sort',
        helper: 'helper'
    }
});
requirejs(['index']);
