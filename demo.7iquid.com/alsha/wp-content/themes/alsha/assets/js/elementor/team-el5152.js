(function ($) {

    "use strict";

    function sep_grid_refresh($scope) {
        var masonryWrap = $scope.find('.alsha-masonry-wrap');

        if (!masonryWrap.length) {
            return;
        }

        var iso = new Isotope(masonryWrap[0], {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            fitRows: {
                gutter: 0
            },
            masonry: {
                columnWidth: '.grid-sizer',
            },
        });

        var filtersElem = $scope.find('.alsha-masonry-filter');

        filtersElem.on('click', function (event) {
            var filterValue = event.target.getAttribute('data-filter');

            if (filterValue) {
                iso.arrange({
                    filter: filterValue
                });
            }
        });

        var filterItem = $scope.find('.filter-item');

        filterItem.on('click', function () {
            filterItem.removeClass('active');
            $(this).addClass('active');
        });
    }

    var alshateamMasonrylHandle = function ($scope, $) {
        var masonryWrap = $scope.find('.alsha-masonry-wrap');

        if (!masonryWrap.length) {
            return;
        }

        masonryWrap.imagesLoaded(function () {
            if ($(document).find('.elementor-editor-active').length > 0) {
                let oldHTMLElement = HTMLElement;
                window.HTMLElement = window.parent.HTMLElement;
                sep_grid_refresh($scope);
                window.HTMLElement = oldHTMLElement;
            } else {
                sep_grid_refresh($scope);
            }
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/alsha_team.default',
            alshateamMasonrylHandle
        );
    });

})(jQuery);