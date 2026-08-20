(function ($) {

    "use strict";
    
    var teamCarouselHandle = ( $scope) => { 

        var carousel = $scope.find( ".team-carousel");
        
        carousel.alshaSwiperCarousel( $scope);
        
    };


    $( window ).on( 'elementor/frontend/init', function() {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_team_carousel.default', teamCarouselHandle ); 

    } );

})(jQuery);