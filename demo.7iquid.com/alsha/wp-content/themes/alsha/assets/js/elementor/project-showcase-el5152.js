(function ($) {
    "use strict";

    var projectShowcaseHandle = function ($scope) {
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        var el = $scope.find(".alsha-project-showcase-el")[0];

        if (!el) {
            return;
        }

        var stage = el.querySelector(":scope > .project-stage");

        if (!stage) {
            return;
        }

        var items = gsap.utils.toArray(stage.querySelectorAll(":scope > .project-item-7"));
        var panels = items.map(function (item) {
            return item.querySelector(".project-panel");
        }).filter(Boolean);

        if (panels.length < 2) {
            return;
        }

        el.style.setProperty("--project-count", panels.length);

        var mm = gsap.matchMedia();

        mm.add("(min-width: 1025px)", function () {
            var backgrounds = panels.map(function (panel) {
                return panel.querySelector(".project-background");
            });

            var contents = panels.map(function (panel) {
                return panel.querySelector(".project-content");
            });

            if (!backgrounds.every(Boolean) || !contents.every(Boolean)) {
                return;
            }

            gsap.set(items, {
                position: "absolute",
                inset: 0
            });

            panels.forEach(function (panel, index) {
                var background = panel.querySelector(".project-background");
                var title = panel.querySelector(".project-title");
                var media = panel.querySelector(".project-media");
                var copy = panel.querySelector(".post-excerpt, .project-copy");
                var count = panel.querySelector(".project-count");

                gsap.set([title, media, copy, count], {
                    willChange: "transform, opacity"
                });

                gsap.set(background, {
                    zIndex: index + 1,
                    willChange: "clip-path"
                });
            });

            gsap.set(backgrounds, {
                clipPath: "inset(100% 0 0 0)"
            });

            gsap.set(backgrounds[0], {
                clipPath: "inset(0% 0 0 0)"
            });

            gsap.set(contents, {
                autoAlpha: 0,
                y: 0
            });

            gsap.set(contents[0], {
                autoAlpha: 1,
                y: 0
            });

            var scene = gsap.timeline({
                scrollTrigger: {
                    trigger: el,
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 0.9,
                    snap: {
                        snapTo: 1 / (panels.length - 1),
                        duration: {
                            min: 0.35,
                            max: 0.8
                        },
                        delay: 0.08,
                        ease: "power2.out"
                    }
                }
            });

            panels.forEach(function (panel, index) {
                if (index === 0) {
                    return;
                }

                var at = index - 1;

                scene
                    .to(backgrounds[index], {
                        clipPath: "inset(0% 0 0 0)",
                        duration: 1,
                        ease: "none"
                    }, at)
                    .to(contents[index - 1], {
                        autoAlpha: 0,
                        y: -14,
                        duration: 0.12,
                        ease: "none"
                    }, at + 0.42)
                    .fromTo(contents[index], {
                        autoAlpha: 0,
                        y: 14
                    }, {
                        autoAlpha: 1,
                        y: 0,
                        duration: 0.12,
                        ease: "none"
                    }, at + 0.56);
            });

            ScrollTrigger.refresh();

            return function () {
                scene.kill();

                ScrollTrigger.getAll().forEach(function (trigger) {
                    if (trigger.trigger === el) {
                        trigger.kill();
                    }
                });

                gsap.set([items, backgrounds, contents], {
                    clearProps: "all"
                });
            };
        });
        
        let mouseX = 0;

        let mouseY = 0;   

        let isActive = false;

        const $cursor = $('.alsha-custom-cursor');

        $(document).on('mousemove', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            if (isActive) {
                $cursor.css({
                    left: mouseX,
                    top: mouseY
                });
            }
            requestAnimationFrame(animateCursor);
        }
     
        animateCursor();

        $( document).on('mouseenter', '.post-featured-image', function() {
            isActive = true;
            $cursor.addClass('active').css('opacity', 1);
        });

     
        $( document).on('mouseleave',  '.post-featured-image', function() {
            isActive = false;
            $cursor.removeClass('active').css('opacity', 0);
        });
    };

    var projectShowcaseLayout02 = function ($scope) {

        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
            return;
        }

        var $el = $scope.find(".alsha-project-showcase-el.layout-2").first();

        if (!$el.length) {
            return;
        }

        var $content = $el.find(".content-block").first();
        var $carousel = $el.find(".posts-carousel").first();
        var $backgroundWrap = $el.find(".featured-image-block").first();
        var $backgroundInner = $el.find(".featured-image-inner").first();
        var $backgrounds = $el.find(".featured-image-inner > .post-featured-image");

        if (!$content.length || !$carousel.length || !$backgroundWrap.length || $backgrounds.length < 2) {
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        var total = $backgrounds.length;
        var currentIndex = -1;

        gsap.set($el[0], {
            position: "relative",
            overflow: "hidden"
        });

        gsap.set($backgroundWrap[0], {
            position: "absolute",
            inset: 0,
            zIndex: 1,
            overflow: "hidden"
        });

        gsap.set($backgroundInner[0], {
            position: "absolute",
            inset: 0
        });

        gsap.set($backgrounds.toArray(), {
            position: "absolute",
            inset: 0,
            autoAlpha: 1,
            clipPath: "inset(100% 0 0 0)",
            overflow: "hidden",
            willChange: "clip-path"
        });

        gsap.set($backgrounds.find("img").toArray(), {
            width: "100%",
            height: "100%",
            objectFit: "cover"
        });

        $backgrounds.each(function (index) {
            gsap.set(this, {
                zIndex: index + 1
            });
        });

        gsap.set($backgrounds.eq(0)[0], {
            clipPath: "inset(0% 0 0 0)"
        });

        gsap.set($content[0], {
            position: "relative",
            zIndex: 5
        });

        function getSwiper() {
            return $carousel[0] && $carousel[0].swiper ? $carousel[0].swiper : null;
        }

        function setActive(index) {
            if (index === currentIndex) {
                return;
            }

            currentIndex = index;

            var swiper = getSwiper();

            if (swiper) {
                if (swiper.params.loop && swiper.slideToLoop) {
                    swiper.slideToLoop(index, 700);
                } else {
                    swiper.slideTo(index, 700);
                }
            }

            $backgrounds.removeClass("is-active");
            $backgrounds.eq(index).addClass("is-active");

            $el.find(".swiper-pagination.fraction").text(
                String(index + 1).padStart(2, "0") + " / " + String(total).padStart(2, "0")
            );
        }

        setActive(0);

        var scene = gsap.timeline({
            scrollTrigger: {
                trigger: $el[0],
                pin: $el[0],
                start: "top top",
                end: "+=" + (window.innerHeight * (total - 1)),
                scrub: 1,
                snap: {
                    snapTo: 1 / (total - 1),
                    duration: {
                        min: 0.35,
                        max: 0.8
                    },
                    delay: 0.08,
                    ease: "power2.out"
                },
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: function (self) {
                    var index = Math.round(self.progress * (total - 1));

                    index = Math.max(0, Math.min(total - 1, index));

                    setActive(index);
                }
            }
        });

        $backgrounds.each(function (index) {
            if (index === 0) {
                return;
            }

            scene.fromTo(this, {
                clipPath: "inset(100% 0 0 0)",
                scale: 1.08
            }, {
                clipPath: "inset(0% 0 0 0)",
                scale: 1,
                duration: 1,
                ease: "none"
            }, index - 1);
        });

        ScrollTrigger.refresh();
    };
    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_project_showcase.default",
            projectShowcaseHandle
        );
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_project_showcase.default",
            projectShowcaseLayout02
        );
    });
})(jQuery);