( function( $ ) {

    "use strict"; 

    var itemScrollAnimation = function( $scope, $ ) {
        if ( typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined' ) {
            return;
        }

        var $el = $scope.find( '.alsha-el' ).first();

        var settings = $el.data( 'item-scroll-settings' ) || {};

        var $items = $scope.find( '.alsha-item-scroll-animation' );

        if ( !settings.scroll_animation || !$items.length ) {
            return;
        }

        gsap.registerPlugin( ScrollTrigger );

        var scrub = parseFloat( settings.scrub ) || 0;

        var isList = $scope.find( '.alsha-list' ).length > 0;

        var fromVars = {
            x: parseFloat( settings.x ) || 0,
            y: parseFloat( settings.y ) || 0,
            rotate: parseFloat( settings.rotate ) || 0,
            scale: parseFloat( settings.scale ) || 1,
            opacity: settings.opacity !== undefined ? parseFloat( settings.opacity ) : 0,
            filter: 'blur(' + ( parseFloat( settings.blur ) || 0 ) + 'px)'
        };

        var triggerOffsetY = parseFloat( settings.y ) || 0;

        var scrollStart = function() {
            return 'top-=' + triggerOffsetY + ' bottom';
        };

        var toVars = {
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            opacity: 1,
            filter: 'blur(0px)',
            delay: parseFloat( settings.delay ) || 0,
            duration: parseFloat( settings.duration ) || 1,
            ease: settings.ease || 'none'
        };

        if ( isList ) {
            $items.each( function() {
                var item = this;

                gsap.fromTo( item, fromVars, {
                    ...toVars,
                    scrollTrigger: {
                        trigger: item,
                        toggleActions: "play none none reset",
                        start: scrollStart,
                        end: 'bottom bottom',
                        scrub: scrub > 0 ? scrub : false,
                        markers: false
                    }
                } );
            } );

        } else {

            var trigger = $el[0];

            if ( settings.custom_trigger ) {
                var $trigger = $scope.find( settings.custom_trigger );

                if ( !$trigger.length ) {
                    $trigger = $( settings.custom_trigger );
                }

                if ( $trigger.length ) {
                    trigger = $trigger[0];
                }
            }

            gsap.fromTo( $items.toArray(), fromVars, {
                ...toVars,
                stagger: parseFloat( settings.stagger ) || 0,
                scrollTrigger: {
                    trigger: trigger,
                    toggleActions: "play none none reset",
                    start: scrollStart,
                    end: 'bottom bottom',
                    scrub: scrub > 0 ? scrub : false,
                    // markers: true
                }
            } );
        }
    };
 
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_posts.default', itemScrollAnimation );   
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_service_list.default', itemScrollAnimation );         
    } );

} )( jQuery );