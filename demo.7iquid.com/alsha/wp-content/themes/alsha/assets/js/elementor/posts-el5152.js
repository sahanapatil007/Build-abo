(function ($) {
    "use strict";

    var postElementHandle = function ($scope) {

        var $wrap = $scope.find(".alsha-posts-el");
        var $items = $wrap.find(".post-item.layout-6");

        if (!$items.length) {
            return;
        }

        var $defaultItem = $items.first();

        function setItemOrder() {
            $items.each(function (index) {
                var $item = $(this);
                var target = $item.data("target");
                var order = index + 1;

                this.style.setProperty("--alsha-item-order", order);

                if (target) {
                    $wrap.find(target).each(function () {
                        this.style.setProperty("--alsha-item-order", order);
                    });
                }
            });
        }

        function setHeights() {
            $items.each(function () {
                var $excerpt = $(this).find(".post-excerpt");

                if (!$excerpt.length) {
                    return;
                }

                var innerHeight = $excerpt.get(0).scrollHeight;

                this.style.setProperty("--excerpt-height", innerHeight + "px");
            });
        }

        function activateItem($item) {
            var target = $item.data("target");

            $items.removeClass("is-active");
            $item.addClass("is-active");

            $wrap.find(".featured-image-wrap .post-featured-image").removeClass("is-active");

            if (target) {
                $wrap.find(target).addClass("is-active");
            }
        }

        setItemOrder();
        setHeights();

        activateItem($defaultItem);

        $items.on("mouseenter", function () {
            activateItem($(this));
        });

        $(window).on("resize", function () {
            setHeights();
        });
    };

    var postElementHandleLayout7 = function ($scope) {
        var $wrap = $scope.find(".alsha-posts-el");
        var $items = $wrap.find(".post-item.layout-7");

        if (!$items.length) {
            return;
        }

        function setHeights() {
            $items.each(function () {
                var $excerpt = $(this).find(".post-excerpt");
                var innerHeight = $excerpt.get(0).scrollHeight;

                this.style.setProperty("--excerpt-height", innerHeight + "px");
            });
        }

        setHeights();

        $(window).on("resize", function () {
            setHeights();
        });
    };

    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_posts.default",
            postElementHandle
        );

        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_posts.default",
            postElementHandleLayout7
        );
    });
})(jQuery);