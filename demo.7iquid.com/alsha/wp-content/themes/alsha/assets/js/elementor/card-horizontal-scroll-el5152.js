(function ($) {

    "use strict";
    
    var cardHorizontalScrollHandle = ( $scope) => { 
        
        var $holder = $scope.find( '.alsha-card-horizontal-scroll-el' );
        if (!$holder.length) {
            return;
        }

        var cardHorizontalScrollHandler = elementorModules.frontend.handlers.Base.extend({
            onInit: function() {
                this.animate();
            },
            animate: function() {
                gsap.registerPlugin(ScrollTrigger);
                gsap.defaults({overwrite: 'auto'});
                gsap.config({nullTargetWarn: false});

                $holder.each( function () {
                    var $thisHolder = $( this );
                    initHorizontalScrollItem($thisHolder);
                });

                function initHorizontalScrollItem($thisHolder) {
                    var boxes = $thisHolder.find('.card-item-wrap')[0];
                    if (!boxes) return;

                    var boxesDiv = gsap.utils.toArray($thisHolder.find('.card-item'));
                    if (!boxesDiv.length) return;

                    let mm = gsap.matchMedia();

                    mm.add("(min-width: 1025px)", () => {
                        
                        function calculateHoverPadding() {
                            let maxNormalHeight = 0;

                            boxesDiv.forEach(card => {
                                card.style.removeProperty('--hover-padding');
                                var normalHeight = card.offsetHeight;
                                if (normalHeight > maxNormalHeight) {
                                    maxNormalHeight = normalHeight;
                                }
                            });

                            boxesDiv.forEach(card => {
                                card.style.setProperty('--hover-padding', maxNormalHeight + 'px');
                            });
                        }

                        calculateHoverPadding();
                        window.addEventListener('resize', calculateHoverPadding);

                        let scrollTimeout;

                        let mainTimeline = gsap.timeline({
                            scrollTrigger: {
                                trigger: $thisHolder[0],
                                start: 'center center',
                                end: () => `+=${window.innerWidth + boxes.scrollWidth}`,
                                pin: true,
                                scrub: !0,
                                invalidateOnRefresh: true,
                                onUpdate: (self) => {
                                    let velocity = Math.abs(self.getVelocity());
                                    
                                    let distance = velocity / 60;
                                    let finalDistance = Math.abs(Math.round(1.75 * distance) / 100);
                                    let getDistance = Math.min(Math.max(finalDistance, 0), 1);
                                    let targetScale = 1 - getDistance / 2;

                                    gsap.to(boxesDiv, {
                                        scale: targetScale,
                                        overwrite: "auto",
                                        duration: 0, 
                                        ease: "power1.out"
                                    });

                                    clearTimeout(scrollTimeout);
                                    scrollTimeout = setTimeout(() => {
                                        gsap.to(boxesDiv, {
                                            scale: 1.0,
                                            overwrite: "auto",
                                            duration: 0
                                        });
                                    }, 50);
                                }
                            }
                        });

                        mainTimeline.to(boxes, {
                            x: () => -(window.innerWidth + boxes.scrollWidth),
                            ease: "none"
                        }, 0);

                        return () => {
                            window.removeEventListener('resize', calculateHoverPadding);
                            boxesDiv.forEach(card => {
                                card.style.removeProperty('--hover-padding');
                            });
                        };
                    });
                }
            }
        });

        elementorFrontend.elementsHandler.addHandler(cardHorizontalScrollHandler, { $element: $scope });
    };

    $( window ).on( 'elementor/frontend/init', function() {
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_card_horizontal_scroll.default', cardHorizontalScrollHandle ); 
    });

})(jQuery);