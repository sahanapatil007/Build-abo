(function ($) {

    "use strict";
    
    var imageCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".image-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };


    $( window ).on( 'elementor/frontend/init', function() {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_image_carousel.default', imageCarouselHandle ); 

    } );

})(jQuery);