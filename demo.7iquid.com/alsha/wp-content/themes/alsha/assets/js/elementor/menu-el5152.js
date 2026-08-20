(function ($) {
    "use strict";

    var menuElementHandle = function ($scope) {

            $scope.find('.alsha-menu-el.menu-type-3').each(function () {
            var $menuWrap = $(this);
            var $menu = $menuWrap.find('> .alsha-menu');

            if (!$menu.length) {
                return;
            }

            var $defaultCurrent = $menu.find(
                '> .current-menu-item,' +
                '> .current-menu-parent,' +
                '> .current-menu-ancestor'
            ).first();

            if (!$defaultCurrent.length) {
                $defaultCurrent = $menu.find('> li:first-child');
            }

            var $marker = $menuWrap.children('.alsha-divider-move');

            if (!$marker.length) {
                $marker = $('<span class="alsha-divider-move"></span>');
                $menuWrap.append($marker);
            }

            function moveMarker($item) {
                if (!$item.length) {
                    return;
                }

                $marker.css({
                    left: $item.position().left,
                    width: $item.outerWidth(),
                    display: 'block'
                }).addClass('active');
            }

            moveMarker($defaultCurrent);
            $defaultCurrent.addClass('alsha-shape-active');

            $menu.find('> li')
                .off('.alshaMenu')
                .on('mouseenter.alshaMenu', function () {
                    var $self = $(this);

                    moveMarker($self);

                    $menu.find('> li')
                        .removeClass('alsha-shape-active');

                    $self.addClass('alsha-shape-active');
                });

            $menu
                .off('mouseleave.alshaMenu')
                .on('mouseleave.alshaMenu', function () {
                    moveMarker($defaultCurrent);

                    $menu.find('> li')
                        .removeClass('alsha-shape-active');

                    $defaultCurrent.addClass('alsha-shape-active');
                });
        });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/alsha_nav_menu.default',
            menuElementHandle
        );
    });

})(jQuery);