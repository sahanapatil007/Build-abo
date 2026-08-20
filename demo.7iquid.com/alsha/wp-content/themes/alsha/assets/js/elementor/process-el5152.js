(function ($) {
    "use strict";

    var alshaHandle = function( $scope, $ ) {

        var $images = $scope.find(".featured-image");

        $scope.find( ".progress-bar").each( function() {   
  
            gsap.to( $( this)[0], {
                '--tab-progress': '100%',
                ease: 'none',

                scrollTrigger: { 
                    trigger: $( this)[0],
                    scrub: 1,
                    start: "top center",
                    end: 'bottom center',
                    markers: false,
                }
            });
        });

        $scope.find(".process-item").each(function (index) {

            const el = this;   
            const $el = $(this);

            gsap.to(el, {
                ease: 'none',
                scrollTrigger: {
                    trigger: el,
                    scrub: 1,
                    start: "top center",
                    markers: false,
                    onEnter: function () {
                        $el.addClass('is-active');

                        $images.removeClass('is-active');
                        $images.eq(index).addClass('is-active');
                    },
                    onLeaveBack: function () {
                        $el.removeClass('is-active');

                        $images.removeClass('is-active');
                        $images.eq(index - 1).addClass('is-active');
                    }
                }
            });
        });
    };

    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_process.default",
            alshaHandle
        );
    });
})(jQuery);