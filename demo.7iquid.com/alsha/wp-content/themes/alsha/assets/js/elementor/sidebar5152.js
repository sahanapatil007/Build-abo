(function ($) {

    "use strict";
    var sidebar = ( $scope, $ ) => { 

        $( document).on( 'click', '.sidebar-button', function(){

            $scope.find( '.alsha-sidebar-el').alshaShowMagnificPopup();
            
        });

    };

    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_sidebar.default', sidebar );        
    } );
})(jQuery);