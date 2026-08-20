(function ($) {
    "use strict";

    var tabsHandle = function ($scope, $) {
        var $tabs = $scope.find('.alsha-tabs-el');
        var scopeId = $scope.data('id');
        var eventName = 'mousedown.alshaTabs-' + scopeId;
        var titleSwiper = null;
        var $titleCarousel = $scope.find('.tab-title-carousel');

        function initTitleSwiper() {
            if (typeof Swiper === 'undefined') {
                return;
            }

            if (window.innerWidth >= 1200) {
                if (titleSwiper) {
                    titleSwiper.destroy(true, true);
                    titleSwiper = null;
                }

                return;
            }

            if (titleSwiper || !$titleCarousel.length) {
                return;
            }

            titleSwiper = new Swiper($titleCarousel[0], {
                slidesPerView: 'auto',
                spaceBetween: 16,
                freeMode: true,
                watchSlidesProgress: true,
                slideToClickedSlide: true,
                pagination: {
                    el: $titleCarousel.find('.swiper-pagination')[0],
                    type: 'progressbar'
                }
            });
        }

        initTitleSwiper();

        $(window).on('resize.alshaTabsTitleSwiper-' + scopeId, function () {
            initTitleSwiper();
        });
        function refreshTabScrollTrigger($content) {
            if (!$content.length) {
                return;
            }

            var $animatedItems = $content.find(
                '.alsha-image-el[data-reveal-settings], .alsha-scrolling-effects-on'
            );

            if (!$animatedItems.length) {
                if (typeof ScrollTrigger !== 'undefined') {
                    setTimeout(function () {
                        ScrollTrigger.refresh(true);
                    }, 350);
                }

                return;
            }

            var $tabContents = $scope.find('.tabs-content');

            function isInsideTabs(el) {
                return el && (
                    $tabContents.is(el) ||
                    $tabContents.has(el).length
                );
            }

            if (typeof ScrollTrigger !== 'undefined') {
                ScrollTrigger.getAll().forEach(function (trigger) {
                    var triggerEl = trigger.trigger;
                    var endTriggerEl = trigger.vars && trigger.vars.endTrigger;

                    if (isInsideTabs(triggerEl) || isInsideTabs(endTriggerEl)) {
                        trigger.kill();
                    }
                });
            }

            if (typeof gsap !== 'undefined') {
                $content.find('.alsha-image-el img').each(function () {
                    gsap.killTweensOf(this);
                    gsap.set(this, {
                        clearProps: 'clipPath,willChange,transform,opacity,visibility'
                    });
                });

                $content.find('.alsha-scrolling-effects-on').each(function () {
                    gsap.killTweensOf(this);
                    gsap.set(this, {
                        clearProps: 'transform,opacity,visibility,filter'
                    });
                });
            }

            requestAnimationFrame(function () {
                if (
                    typeof elementorFrontend !== 'undefined' &&
                    elementorFrontend.elementsHandler &&
                    elementorFrontend.elementsHandler.runReadyTrigger
                ) {
                    $content
                        .find('.elementor-widget-alsha_image, .alsha-scrolling-effects-on')
                        .each(function () {
                            elementorFrontend.elementsHandler.runReadyTrigger($(this));
                        });
                }

                setTimeout(function () {
                    $(window).trigger('resize');

                    if (typeof ScrollTrigger !== 'undefined') {
                        ScrollTrigger.refresh(true);
                    }
                }, 450);
            });
        }

        $scope
            .find('.tabs-title-item.is-active .description')
            .slideDown();

        $scope.find('.tabs-title-item').on('click', function () {
            var $this = $(this);
            var target = $this.attr('data-tab');
            var $target = $scope.find(target);

            if (!$this.hasClass('is-active')) {
                $scope
                    .find('.tabs-title-item.is-active')
                    .removeClass('is-active');

                $this.addClass('is-active');

                $scope.find('.description').slideUp(200);

                $this
                    .find('.description')
                    .delay(500)
                    .slideDown(200);

                $scope
                    .find('.tabs-content')
                    .removeClass('is-active');

                $target.addClass('is-active');

                refreshTabScrollTrigger($target);
            }
        });

        refreshTabScrollTrigger(
            $scope.find('.tabs-content.is-active').first()
        );


        $tabs.on('click', function () {
            $tabs.addClass('is-viewer-enabled');
        });


        $(document)
            .off(eventName)
            .on(eventName, function (event) {
                var clickedInside =
                    $tabs.is(event.target) ||
                    $tabs.has(event.target).length > 0;

                if (!clickedInside) {
                    $tabs.removeClass('is-viewer-enabled');
                }
            });
    };

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/alsha_tabs.default',
            tabsHandle
        );
    });
})(jQuery);
