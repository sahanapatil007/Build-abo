(function ($) {

    "use strict";
    
    var projectCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".process-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };
  var processCarouselScrollPin = function ($scope) {
    if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
        return;
    }

    gsap.registerPlugin(ScrollTrigger);

    var $el = $scope.find(".alsha-process-carousel-el").first();
    var $carousel = $el.find(".process-carousel").first();

    if (!$el.length || !$carousel.length) {
        return;
    }

    var $scrollWrap = $el.closest(".process-scroll-wrap").first();

    if (!$scrollWrap.length) {
        $scrollWrap = $el.closest(".e-con-boxed, section.elementor-section").first();
    }

    if (!$scrollWrap.length) {
        return;
    }

    var oldTrigger = $el.data("process-scroll-trigger");

    if (oldTrigger) {
        oldTrigger.kill();
    }

    var swiper = null;
    var total = 0;
    var currentIndex = -1;

    function getSwiper() {
        return $carousel[0] && $carousel[0].swiper ? $carousel[0].swiper : null;
    }

    function getTotal() {
        return $carousel.find(".process-item.swiper-slide:not(.swiper-slide-duplicate)").length ||
            $carousel.find(".process-item.swiper-slide").length;
    }

    function goToSlide(index) {
        if (!swiper || !total) {
            return;
        }

        index = Math.max(0, Math.min(total - 1, index));

        if (index === currentIndex) {
            return;
        }

        currentIndex = index;

        if (swiper.params.loop && typeof swiper.slideToLoop === "function") {
            swiper.slideToLoop(index, swiper.params.speed || 750);
        } else {
            swiper.slideTo(index, swiper.params.speed || 750);
        }
    }

    function init() {
        swiper = getSwiper();
        total = getTotal();

        if (!swiper || total < 2) {
            return false;
        }

        if (swiper.autoplay && typeof swiper.autoplay.stop === "function") {
            swiper.autoplay.stop();
        }

        goToSlide(0);

        var trigger = ScrollTrigger.create({
            trigger: $scrollWrap[0],
            start: "top top",
            end: function () {
                return "+=" + window.innerHeight * total;
            },
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: function (self) {
                var index = Math.floor(self.progress * total);

                if (index >= total) {
                    index = total - 1;
                }

                goToSlide(index);
            }
        });

        $el.data("process-scroll-trigger", trigger);

        ScrollTrigger.refresh();

        return true;
    }

    if (init()) {
        return;
    }

    var count = 0;
    var timer = setInterval(function () {
        count++;

        if (init() || count > 30) {
            clearInterval(timer);
        }
    }, 100);
};


    $( window ).on( 'elementor/frontend/init', function() {

        // elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_posts_carousel.default', projectCarouselHandle );   
         
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_process_carousel.default', projectCarouselHandle );    
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_process_carousel.default', processCarouselScrollPin );    

    } );

})(jQuery);