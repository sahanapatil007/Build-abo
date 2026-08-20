;(function ($) {

    "use strict";

    $( document ).ready( function() {

        $( 'body').on( 'click', '.posts-orderby', function( e){

            $( '.posts-orderby').toggleClass( 'opened');

        });

        $( document).on( 'click touch mouseup', function(event) {
            
            if ( !$(event.target).closest( ".posts-orderby button").length) {
                $( '.posts-orderby').removeClass( 'opened');              
            }
        });
    });

})(jQuery);