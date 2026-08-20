( function( $ ) {

    "use strict";  

    var alshaHandle = function($scope, $) {
        const $mask = $scope.find('.alsha-background-el');

        $mask.on('mousemove', function(e) {
            const rect = this.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gsap.to(this, {
                '--mouse-x': `${x}px`,
                '--mouse-y': `${y}px`,
                duration: .75,
                ease: 'sine.out'
            });
        });
    };
 
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_background.default', alshaHandle );        
    } );
} )( jQuery );