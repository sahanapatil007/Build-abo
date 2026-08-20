(function ($) {
"use strict";

var alshaTitleScrollEffectHandle = function ($scope, $) {

    document.fonts.ready.then(function(){

        var text = $scope.find('.alsha-title-scroll-effect .title-text')[0];

        if(!text) return;

        var split = new SplitText(text, { type: "lines" });

        $(split.lines).each(function(){

            var trigger = this;
            gsap.to(this,{
                backgroundPositionX: '0%',
                ease: 'ease',
                scrollTrigger: {
                    trigger: this,
                    start: "top center",
                    end: "bottom center",
                    scrub: 2,
                    // markers: true

                }
            });
        });

        ScrollTrigger.refresh();
    });
};


// Elementor
$(window).on('elementor/frontend/init', function(){

    elementorFrontend.hooks.addAction(
        'frontend/element_ready/alsha_title_scroll_effect.default',
        alshaTitleScrollEffectHandle
    );
});

})(jQuery);