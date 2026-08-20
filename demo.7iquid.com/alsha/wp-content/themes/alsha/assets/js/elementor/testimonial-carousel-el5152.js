(function ($) {

    "use strict";
    
    var testimonialCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".testimonial-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };

    var testimonialCarouselLayout03Handle = ( $scope) => { 

        var carousel = $scope.find( ".testimonial-carousel-layout-3");      
        
        var nav_next = $scope.find( ".swiper-nav-button-next"),
            nav_prev = $scope.find( ".swiper-nav-button-prev");
        var swiper = new Swiper(carousel[0], {
            effect: 'creative',
                navigation: {
                    nextEl: nav_next[0],
                    prevEl: nav_prev[0],
                },
                slidesPerView: 2,
                centeredSlides: true,
                loop: true,
                speed: 750,
                creativeEffect: {
                    crossFade: true,
                    limitProgress: 3,
                    perspective: 0,
                    shadowPerProgress: 0,
                    prev: {
                    translate: ['-60%', 0, 0],
                      scale: 0.9,
                      // opacity: 0,
                    },
                    next: {
                      translate: ['60%', 0, 0],
                      scale: 0.9,
                      // opacity: 0.6,
                    },
                    simulateTouch: false,
                },
            pagination: {
                el: ".swiper-pagination",
            },
            breakpoints: {
                0: {
                    slidesPerView: 1
                },
                768: {
                    slidesPerView: 1.4
                },
                1025: {
                    slidesPerView: 2
                }
            }
        });  
        
    };


    $( window ).on( 'elementor/frontend/init', function() {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_testimonial_carousel.default', testimonialCarouselHandle ); 

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_testimonial_carousel.default', testimonialCarouselLayout03Handle ); 

    } );

})(jQuery);