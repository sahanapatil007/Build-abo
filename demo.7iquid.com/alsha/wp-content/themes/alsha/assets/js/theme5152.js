;(function ($) {

    "use strict";

    var scroll_top, header_height = 84, header_top_height, scroll_pos = 0, wp_admin_bar = 0, header_offset, backToTop = $(".alsha-scroll-top"), relative = $('.alsha-scroll-top.relative'), relativeTop = 0, relativeHeight = 0;

    var window_height;
    var window_width;
    var scroll_status = '';
    var lastScrollTop = 0;
    var lenis;

    $( document ).ready( function() {

        window_height = $(window).height();

        if( relative.length > 0){
            relativeTop = $('.alsha-scroll-top.relative').offset().top;
            relativeHeight = $('.alsha-scroll-top.relative').outerHeight();
        }
        
        alsha_panel_anchor_toggle();    

        alsha_scroll_to_top();

        alsha_get_admin_bar_height();

        alsha_header_height();

        $( 'body').css( 'opacity', 1);

        alsha_mobile_menu();
        
        alsha_smother_scroll();

        alsha_header_sticky();

        alsha_one_page_scroll();

        alshaButtonHandle();
    });

    $( window).on( 'resize', function () {

        alsha_get_admin_bar_height();

        alsha_header_height();
    });

    var alshaButtonHandle = function () {

        $('.alsha-button.default').each(function () {

            var $button = $(this);

            var text = $button.find('.button-text')[0];

            if (!text || typeof SplitText === 'undefined') {
                return;
            }

            var split = $button.data('alshaButtonSplit');

            if (!split) {
                split = new SplitText(text, {
                    type: 'words,chars',
                    wordsClass: 'button-word',
                    charsClass: 'button-char'
                });

                $button.data('alshaButtonSplit', split);
            }

            var chars = split.chars;

            function animateText(isHovering) {
                gsap.killTweensOf(chars);

                var staggerFrom = isHovering ? 'end' : 'start';

                gsap.timeline()
                .to(chars, {
                    scale: 0,
                    autoAlpha: 0,
                    duration: 0.2,
                    transformOrigin: 'center center',
                    stagger: {
                        each: 0.015,
                        from: staggerFrom
                    },
                    ease: 'power2.in'
                })
                .to(chars, {
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.2,
                    stagger: {
                        each: 0.02,
                        from: staggerFrom
                    },
                    ease: 'back.out(1.7)'
                });
            }

            $button
                .off('.alshaButton')
                .on('mouseenter.alshaButton', function () {
                    animateText(-1);
                })
                .on('mouseleave.alshaButton', function () {
                    animateText(1);
                });
        });
    };

    function alshaOrbitButton($scope) {
        $scope.find(".type-3").each(function () {
            var $button = $(this);

            if (!$button.find(".alsha-orbit-track").length) {
                $button.append(
                    '<span class="alsha-orbit-track">' +
                        '<span class="alsha-orbit-dot"></span>' +
                    '</span>'
                );
            }

            $button
                .off("mouseenter.alshaOrbit mouseleave.alshaOrbit")
                .on("mouseenter.alshaOrbit", function () {
                    $(this).addClass("is-active");
                })
                .on("mouseleave.alshaOrbit", function () {
                    $(this).removeClass("is-active");
                });
        });
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/alsha_button.default',
            alshaOrbitButton
        );
    });

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction(
            'frontend/element_ready/alsha_button.default',
            alshaButtonHandle
        );
    });

    var getSamePageAnchor = ( link) => {

        const location = window.location;

        const $link = $(link);

        if (
            $link.prop('protocol') !== location.protocol ||
            $link.prop('host') !== location.host ||
            $link.prop('pathname') !== location.pathname ||
            $link.prop('search') !== location.search
        ) {
            return false;
        }

        return $link.prop('hash');
    }


    var scrollToHash = ( _offset, hash, e) => {

        const $elem = hash ? $(hash) : null;

        if ($elem && $elem.length) {

            if (e) e.preventDefault();

            gsap.to( window, { duration: 2, scrollTo: { y: $elem.offset().top, offsetY: _offset}, ease: "power2"});

        }
    }

    var alsha_one_page_scroll = () =>{

        var _offset = 0;
        
        $( 'a').on('click', function (e) {

            const hash = getSamePageAnchor(this);

            _offset = $( this).data( 'onepage-offset') ? $( this).data( 'onepage-offset') : 0;
    
            scrollToHash( _offset, hash, e);

            $.magnificPopup.close();
        });
    }

    var alsha_smother_scroll = () => {

        if( $( 'body').hasClass( 'alsha-smooth-scroll') && !$( 'body').hasClass( 'elementor-editor-active')){
            
            let lenis = null;
            let lenisTicker = null;

            const initLenis = () => {
                if (window.innerWidth >= 1025) {
                    if (!lenis) {
                        lenis = new Lenis({
                            smooth: true,
                            lerp: 0.085,
                            wheelMultiplier: 1,     
                            autoRaf: false
                        });

                        lenisTicker = (time) => {
                            lenis.raf(time * 1000)
                        };

                        gsap.ticker.add(lenisTicker);
                        gsap.ticker.lagSmoothing(0);
                    }
                } else {
                    if (lenis) {
                        gsap.ticker.remove(lenisTicker);
                        lenis.destroy();
                        lenis = null;
                        lenisTicker = null;
                    }
                }
            };

            initLenis();
            window.addEventListener('resize', initLenis);
        }   
    }

    $.fn.alshaShowMagnificPopup = function () {
        $.magnificPopup.open({
            items: {
                src: $( this)
            },
            type: 'inline',
            removalDelay: 500, //delay removal by X to allow out-animation
            tClose: 'Close',
            callbacks: {
                beforeOpen: function () {
                    this.st.mainClass ='mfp-move-horizontal';
                    $( 'html').addClass( 'mfp-is-open');
                },
                open: function () {
                    // Will fire when this exact popup is opened
                    // this - is Magnific Popup object
                },
                close: function () {

                    $( 'html').removeClass( 'mfp-is-open');
      
                    if ( typeof lenis !== 'undefined' && lenis) {
                        lenis.start();
                    }    
                }
                // e.t.c.
            },
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">Close</button>'
        });
    };

    $( window).on('scroll', function () {

        scroll_top = $(window).scrollTop();

        window_height = $(window).height();

        alsha_scroll_to_top();

        alsha_header_sticky();

    });

    var alsha_get_admin_bar_height = () =>{

        if( $( '#wpadminbar').length > 0){
            wp_admin_bar = $( '#wpadminbar').outerHeight();
        }        

        $( 'body').css( { '--admin-bar-height': wp_admin_bar+'px'});
    }

    var alsha_header_height = () =>{

        if( $( '#pxl-header').length > 0){
            header_height = $( '#pxl-header').outerHeight();
        }

        if( $( '.alsha-site-header-sticky').length > 0){

            var header_stiky_height = $( '.alsha-site-header-sticky').outerHeight();

            $( '.alsha-site-header-sticky').css( { '--alsha-header-height': ( header_stiky_height)+'px'})
        }
        header_top_height = $( '.pxl-header-top').outerHeight();
  
        $( 'body').css( { '--alsha-header-height': ( header_height)+'px', '--alsha-header-top-height': ( header_top_height)+'px', }); 
    }

    function alsha_header_sticky() {

        if( $( '.alsha-header-sticky').hasClass( 'action-scroll-up')){

            if( scroll_pos > scroll_top && header_height * 5 <= scroll_top){  

                $( '.alsha-header-sticky').addClass( 'is-sticky');           

            }else{

                $( '.alsha-header-sticky').removeClass( 'is-sticky');

            }
      
            scroll_pos = scroll_top;

        }else if( $( '.alsha-header-sticky').hasClass( 'action-scroll-down')){
            
            if( scroll_pos < scroll_top && header_height * 5 <= scroll_top){  

                $( '.alsha-header-sticky').addClass( 'is-sticky');           

            }else{

                $( '.alsha-header-sticky').removeClass( 'is-sticky');

            }

            scroll_pos = scroll_top;
        }else{

            if( header_height * 5 <= scroll_top){  

                $( '.alsha-header-sticky').addClass( 'is-sticky');           

            }else{

                $( '.alsha-header-sticky').removeClass( 'is-sticky');

            }
        }
    }

    function alsha_mobile_menu(){
        
        $( '.alsha-mobile-menu li.menu-item-has-children').append( '<span class="holder"></span>' );


        $( document).on('click','.holder',function() {
            var el = $( this ).closest( 'li' );
            if ( el.hasClass( 'open' ) ) {
                el.removeClass( 'open' );
                el.find( 'li' ).removeClass( 'open' );
                el.find( 'ul' ).slideUp();
            } else {
                el.addClass( 'open' );
                el.children( 'ul' ).slideDown();
                el.siblings( 'li' ).children( 'ul' ).slideUp();
                el.siblings( 'li' ).removeClass( 'open' );
                el.siblings( 'li' ).find( 'li' ).removeClass( 'open' );
                el.siblings( 'li' ).find( 'ul' ).slideUp();
            }
        });
    }

    function alsha_panel_anchor_toggle(){

        $(document).on('click','.alsha-anchor',function(e){

            e.preventDefault();

            e.stopPropagation(); 

            if ( typeof lenis !== 'undefined' && lenis) {
                lenis.stop();
            }                   

            var target = $(this).attr('data-target');
     
            $( target).alshaShowMagnificPopup();
        });
    }

    //* Scroll To Top
    function alsha_scroll_to_top() {

        if( backToTop.hasClass( 'fixed')){

            if ( scroll_top > window_height) {

                $('.alsha-scroll-top').addClass('on').removeClass('off');

            } else {

                $('.alsha-scroll-top').addClass('off').removeClass('on');
        
            }
        }
        $(document).on('click','.alsha-scroll-top',function(e){
            e.preventDefault();
            e.stopPropagation();
            $('html, body').stop().animate({ scrollTop: 0}, 2000);
        });
    }

})(jQuery);