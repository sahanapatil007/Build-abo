(function ($) {

    "use strict";
    
    var postsCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".posts-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };


    $( window ).on( 'elementor/frontend/init', function() {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_posts_carousel.default', postsCarouselHandle );   

    } );

})(jQuery);