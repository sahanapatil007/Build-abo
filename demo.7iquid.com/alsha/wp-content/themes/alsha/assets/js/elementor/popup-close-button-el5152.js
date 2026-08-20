( function( $ ) {

    "use strict";  

    var alshaHandle = function( $scope, $ ) {

        $scope.find( ".close-button").on("click", function(e){

            e.preventDefault();

            $.magnificPopup.close();            
        });
    };
 
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_popup_close_button.default', alshaHandle );        
    } );
} )( jQuery );