( function( $ ) {

    "use strict"; 

    var infiniteSlideHandle = function( $scope, $ ) {
        
        const _item = $scope.find('.infinite-slide-item');

        var wrapper = $scope.find('.infinite-slide'),
            data = wrapper.data( 'slide'),
            settings = {
                repeat: -1,
                speed: parseFloat( data.speed) || 1,
                direction: data.direction,
                pauseOnHover: false
            };

        if (!_item || _item.length === 0) {
            return;
        }

        if( data.pause_on_hover == 'on'){
            settings['pauseOnHover'] = true;     
        } 

        $scope.find('.infinite-slide').imagesLoaded(function(){
            const boxes = gsap.utils.toArray(_item);
            const loop = loopSlider( boxes, settings);
        });
    };
 
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        // elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_image_infinite_slide.default', infiniteSlideHandle );         
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_infinite_slide.default', infiniteSlideHandle );         
    } );
} )( jQuery );