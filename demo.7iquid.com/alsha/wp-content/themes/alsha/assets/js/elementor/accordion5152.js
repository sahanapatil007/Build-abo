( function( $ ) {

    var accordion = function( $scope, $ ) {

        $scope.find( '.alsha-accordion-el .accordion-item.is-active .accordion-item-content').slideDown();
        
        $scope.find( '.alsha-accordion-el .accordion-item').on( 'click', function(){

            var data = $( this).data( 'target');

            if( !$( this).hasClass( 'is-active')){

                $scope.find( '.accordion-item.is-active .accordion-item-content').slideUp();

                $scope.find( '.accordion-item.is-active').removeClass( 'is-active');                

                $( this).addClass( 'is-active');

                $( this).find( '.accordion-item-content').slideDown();
            }else{
                $scope.find( '.accordion-item.is-active').removeClass( 'is-active');
                $( this).find( '.accordion-item-content').slideUp();
            }
        });

        var st = $scope.find( ".scrolling-effect");
  
        st.each( function(index, el) {        

            var settings = {
                scrollTrigger: {
                    trigger: el,    
                    markers: false, 
                    scrub: 3,         
                    toggleActions: "play none none reverse",
                    start: "30px bottom", 
                    end: "bottom bottom",
                    // delay: 3,
                },
                duration: 2, 
                ease: "power3.out",
            };

            if( $(el).hasClass('fade') ){
                settings.opacity = 0;
            }
            if( $(el).hasClass( 'fromRight') ){
                settings.opacity = 0;
                settings.x = "80";
            }
            if( $(el).hasClass( 'fromLeft') ){
                settings.opacity = 0;
                settings.x = "-80";
            }
            if( $(el).hasClass( 'fromBottom') ){
                settings.opacity = 0;
                settings.y = "100";
            }
            if( $(el).hasClass( 'fromTop') ){
                settings.opacity = 0;
                settings.y = "-80";
            }
            if( $(el).hasClass( 'zoomIn') ){
                settings.opacity = 0;
                settings.scale = 0.5;
            } 
            
            gsap.from( el, settings);
        });
    };

    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_accordion.default', accordion );
    } );
} )( jQuery );