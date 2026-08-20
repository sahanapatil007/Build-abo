( function ( $) {

    "use strict";

    var counter = ( $scope, $ ) => { 

        var _selector = $scope.find( ".counter-number-value"),
            _data = _selector.data(),
            _settings = {
                scrollTrigger: {
                    trigger: _selector[0],    
                    markers: false,                        
                    toggleActions: "play none none reset",
                    start: "30px bottom", 
                    end: "bottom bottom"     
                },
                duration: _data.duration, 
                ease: "power3.out",
                textContent: _data.start,
                snap : {
                    textContent: 1
                }
            };

        if( _data.delimiter == 'yes'){
            _settings.modifiers = {
                textContent: value => formatNumber(value, 0)
            }
        }

        gsap.registerPlugin( ScrollTrigger);

        gsap.from( _selector[0], _settings);

        function formatNumber(value, decimals) {
            let s = (+value).toLocaleString('en-US').split(".");
            return decimals ? s[0] + "." + ((s[1] || "") + "00000000").substr(0, decimals) : s[0];
        }
    };

    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_counter.default', counter );        
    } );

})(jQuery);