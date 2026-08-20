(function ($) {

    "use strict";
    
    var projectCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".posts-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };

    var projectShowcaseCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".project-showcase-carousel");
        
        var nav_next = $scope.find( ".swiper-nav-button-next"),
            nav_prev = $scope.find( ".swiper-nav-button-prev");
        var swiper = new Swiper(carousel[0], {
            effect: "coverflow",
            navigation: {
                nextEl: nav_next[0],
                prevEl: nav_prev[0],
            },
            loop: true,
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            speed: 750,
            coverflowEffect: {
                rotate: 15,
                stretch: 10,
                depth: 200,
                modifier: 5,
                slideShadows: false,
            },
            pagination: {
                el: ".swiper-pagination",
            },
        });    
    };


    $( window ).on( 'elementor/frontend/init', function() {

        // elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_posts_carousel.default', projectCarouselHandle );   
         
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_project_carousel.default', projectCarouselHandle );    
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_project_showcase.default', projectCarouselHandle );    
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_project_carousel.default', projectShowcaseCarouselHandle );    

    } );

})(jQuery);