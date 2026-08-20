(function ($) {

    "use strict";

    $.fn.alshaSwiperCarousel = function ( $scope) {
        
        if( $( this).length < 1){
            return false;
        }

        var carousel = $( this),
            pagination = $scope.find( ".swiper-pagination"),
            nav_next = $scope.find( ".swiper-nav-button-next"),
            nav_prev = $scope.find( ".swiper-nav-button-prev"),
            data = carousel.data(), 
            settings = data.settings,
            carousel_settings = {
                slidesPerView: 2.4,
                spaceBetween: 30,         
                speed: settings.animation_speed,                
                navigation: {
                    nextEl: nav_next[0],
                    prevEl: nav_prev[0],
                },  
                grid: {
                  rows: 2, 
                  fill: 'row',          
                },     
                pagination: {
                    el: pagination[0],
                    clickable: true,
                    formatFractionCurrent: function(number) {
                        return number.toString().padStart(2, '0');
                    },
                    formatFractionTotal: function(number) {
                        return number.toString().padStart(2, '0');
                    }
                },
                on: {
      
                    slideChange: function (swiper){ 
                        carousel.css('--alsha-progress-val', 0);
                    },
                    autoplayTimeLeft: function(s, time, progress) {                 
              
                        var progressBarWidth = (1 - progress) * 100 + "%";

                        carousel.css('--alsha-progress-val', progressBarWidth);
                    }
                }
            };

        if( pagination.hasClass( 'progressbar')){
            carousel_settings.pagination.el = pagination[0];
            carousel_settings.pagination.type = 'progressbar';                 
        }

        if( pagination.hasClass( 'fraction')){
            carousel_settings.pagination.el = pagination[0];
            carousel_settings.pagination.type = 'fraction';                 
        }

        $( '.alsha-navigation-carousel').each( function () {
            
            var selector = $( this);

            var carousel_ids = selector.data( 'ids');
   
            var array_ids = carousel_ids.split( ",").map( function( item) {

                return item.trim();
            });

            var scope_id = $scope[0].id;

            if ( array_ids.includes( scope_id)){

                nav_next = selector.find( ".nav-next");
                nav_prev = selector.find( ".nav-prev");
                pagination = selector.find( ".swiper-pagination");

                carousel_settings.navigation.nextEl = nav_next[0];
                carousel_settings.navigation.prevEl = nav_prev[0];

                if( selector.hasClass( 'nav-1')){
                    carousel_settings.pagination.el = pagination[0];
                    carousel_settings.pagination.type = 'fraction';                 
                }

                if( selector.hasClass( 'nav-2')){
                    carousel_settings.pagination.el = pagination[0];
                    carousel_settings.pagination.type = 'progressbar';                 
                }
            }
        });    

        if( settings.loop == 'on'){
            carousel_settings['loop'] = true;     
        }

        if( settings.autoHeight == 'on'){
            carousel_settings['autoHeight'] = true;  
        }
        
        if( settings.centeredSlides == 'on'){
            carousel_settings['centeredSlides'] = true;     
        }

        if( settings.autoplay == 'on'){
            carousel_settings['autoplay'] = {
                delay : settings.autoplay_speed,
            }
        }

        if( settings.effect == 'fade'){
            carousel_settings['effect'] =  "fade";
            carousel_settings['fadeEffect'] = {
                crossFade: true
            }
        }  

        carousel_settings.breakpoints = {};

        
        if( settings.slidesPerGroup == 'on'){
            Object.keys( settings.breakpoints).reverse().forEach(breakpoint => {           
           
                carousel_settings.breakpoints[settings.breakpoints[breakpoint].node] = {
                    grid: {
                        rows: settings.breakpoints[breakpoint].row,
                        fill: "row",
                    },
                    slidesPerView: settings.breakpoints[breakpoint].value,
                    slidesPerGroup: settings.breakpoints[breakpoint].value,
                    spaceBetween: settings.breakpoints[breakpoint].spacing

                };
            }); 
        }else{
            Object.keys( settings.breakpoints).reverse().forEach(breakpoint => {           
           
                carousel_settings.breakpoints[settings.breakpoints[breakpoint].node] = {
                    grid: {
                        rows: settings.breakpoints[breakpoint].row,
                        fill: "row",
                    },
                    slidesPerView: settings.breakpoints[breakpoint].value,
                    spaceBetween: settings.breakpoints[breakpoint].spacing

                };
            }); 
        }

        carousel.each( function(index, element) {
            
            var swiper = new Swiper(carousel[0], carousel_settings);  
        
            if( settings.autoplay === 'on' && settings.pause_on_hover === 'on'){
                $( this).on({
                    mouseenter: function mouseenter() {
                        this.swiper.autoplay.stop();
                    },
                    mouseleave: function mouseleave() {
                        this.swiper.autoplay.start();
                    }
                });
            } 
        });
    };
})(jQuery);