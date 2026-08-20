(function ($) {

    "use strict";
    var copyClipboard = ( $scope, $ ) => { 

        var $temp = $("<input>");

        var $url = $(location).attr('href');

        $scope.find( '.alsha-share-button-el').on( 'click', '.copy-clipboard-button', function(){

            var _this = $( this);

            $( "body").append( $temp);

            $temp.val( $url).select();

            document.execCommand( "copy");

            _this.addClass( 'active');

            setTimeout( function () {

                _this.removeClass( 'active');

            }, 700);

            $temp.remove();
        });

    };

    $( window ).on( 'elementor/frontend/init', function() {
        // Swipers
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_share_button.default', copyClipboard );        
    } );
})(jQuery);