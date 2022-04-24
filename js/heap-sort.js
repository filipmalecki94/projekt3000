define(['helper'], function (helper) {
    var collection = [],animationSpeed = 100;

    function sortIteration() {
        helper.getStepButton().off('click',sortIteration);
    }

    function initQuicksortCode() {

    }

    return {
        init: function (graphContainer) {

            return this;
        },
        sortIteration: function () {
            return sortIteration
        },
        setAnimationSpeed: function (newAnimationSpeed) {
            if (newAnimationSpeed > animationSpeed) {
                animationSpeed = newAnimationSpeed;
            }

            return this;
        },
        getAnimationSpeed: function () {
            return animationSpeed;
        }
    };
});
