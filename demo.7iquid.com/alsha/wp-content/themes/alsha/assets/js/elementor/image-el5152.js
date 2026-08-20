(function ($) {
    "use strict";

    var imageRevealHandle = function ($scope) {

        var $elements = $scope.find(
            ".alsha-image-el[data-reveal-settings]"
        );

        if (!$elements.length) {
            return;
        }

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        $scope.find(".alsha-image-el").each(function () {
            var el = this;
            var img = el.querySelector("img");

            if (!img) {
                return;
            }

            var settings = $(el).data("reveal-settings") || {};
            var direction = settings.direction || "none";
            var scrub = settings.scrub === "on";
            var duration = Number(settings.duration) || 1.2;
            var ease = settings.ease || "power3.out";
            var delay = parseFloat(settings.delay) || 0;

            ScrollTrigger.getAll().forEach(function (trigger) {
                if (trigger.trigger === el) {
                    trigger.kill();
                }
            });

            gsap.killTweensOf(img);

            if (direction === "none") {
                gsap.set(img, {
                    clipPath: "none",
                    clearProps: "willChange"
                });

                return;
            }

            var fromClip = "inset(0 0 0 0)";

            if (direction === "left") {
                fromClip = "inset(0 100% 0 0)";
            }

            if (direction === "right") {
                fromClip = "inset(0 0 0 100%)";
            }

            if (direction === "top") {
                fromClip = "inset(0 0 100% 0)";
            }

            if (direction === "bottom") {
                fromClip = "inset(100% 0 0 0)";
            }

            if (direction === "center") {
                fromClip = "inset(0 50% 0 50%)";
            }

            gsap.fromTo(
                img,
                {
                    clipPath: fromClip,
                    willChange: "clip-path"
                },
                {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: duration,
                    delay: scrub ? 0 : delay,
                    ease: ease,
                    scrollTrigger: {
                        trigger: el,
                        start: "top bottom",
                        end: "bottom bottom",
                        scrub: scrub ? 1 : false,
                        toggleActions: "play none none reset"
                    }
                }
            );
        });
    };

    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_image.default",
            imageRevealHandle
        );
    });
})(jQuery);