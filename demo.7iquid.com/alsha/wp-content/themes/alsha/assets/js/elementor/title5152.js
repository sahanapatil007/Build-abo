( function ($) {

    "use strict";
    var title = ( $scope, $ ) => { 

        var _selector = $scope.find( '.alsha-title-el'),
            _data = _selector.data(),
            split, split_type_set;


        if( _data.split != 'none' && !$('body').hasClass("rtl")){

            split = new SplitText( $scope.find( '.title-text'), { 
                type: "words, chars, lines", 
                linesClass: "line",
                wordsClass: "word",
                charsClass: "char"
            });   

            var gradientChars = $scope.find( ".text-gradient > .word > *");

            var offset = 0;

            gradientChars.each( function(i, char) {
                const _char = $( char);
                const parent = _char.parent();

                _char.css("background-size", parent.outerWidth() + "px 100%");

                offset += _char.prev().outerWidth() || 0;

                _char.css("background-position", ( parent.outerWidth() - offset) + "px 0%");
            });

            var settings = {
                scrollTrigger: {
                    trigger: $scope.find( '.title-text'),
                    toggleActions: "play none none reset", //play reset play reset 
                    start: "top bottom  ",
                    markers: false,
                },
                delay: _data.delay,
                duration: _data.animateduration,         
                ease: _data.ease,
                stagger: _data.stagger,
                filter: "blur(10px)",
            };

            if( _data.split == 'chars'){      
                split_type_set = split.chars;
            }

            if( _data.split == 'words'){           
                split_type_set = split.words;
            }

            if( _data.split == 'lines'){         
                split_type_set = split.lines;
            } 

            if( _data.animate == 'in-fade'){
                settings.opacity = 0;
            }
            if( _data.animate == 'in-right'){
                settings.opacity = 0;
                settings.x = "50";
            }
            if( _data.animate == 'in-left'){
                settings.opacity = 0;
                settings.x = "-50";
            }
            if( _data.animate == 'in-up'){
                settings.opacity = 0;
                settings.y = "80";
            }
            if( _data.animate == 'in-down'){
                settings.opacity = 0;
                settings.y = "-80";
            }
            if( _data.animate == 'in-rotate'){
                settings.opacity = 0;
                settings.rotateX = "50deg";
            }
            if( _data.animate == 'in-scale'){
                settings.opacity = 0;
                settings.scale = "0.5";
            }

            settings.onStart = function () {
                _selector.closest( '.alsha-scrolling-effects').removeClass('alsha-hidden');
            };
  
            var alsha_anim = gsap.from( split_type_set, settings);               
        }
    };

    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_title.default', title);        
    } );
})(jQuery);