(function ($) {

    "use strict";
    
    function sep_grid_refresh($scope){
        var iso = new Isotope( $scope.find('.project-masonry-wrap')[0], {
            itemSelector: '.grid-item',
            layoutMode: 'fitRows',
            fitRows: {
                gutter: 0
            },           
            masonry: {
                columnWidth: '.grid-sizer',
            },
         
        });
        var filtersElem = $scope.find('.categories-filter');
        filtersElem.on('click', function (event) {
            var filterValue = event.target.getAttribute('data-filter');
            iso.arrange({filter: filterValue});
        });

        var filterItem = $scope.find('.filter-item');
        filterItem.on('click', function (e) {
            filterItem.removeClass('active');
            $(this).addClass('active');            
        });

    }
    var alshaProjectMasonrylHandle = function( $scope, $ ) {
        $scope.find('.project-masonry-wrap').imagesLoaded(function(){
            if($(document).find('.elementor-editor-active').length > 0){
                let oldHTMLElement = HTMLElement;
                window.HTMLElement = window.parent.HTMLElement;
                sep_grid_refresh($scope);
                window.HTMLElement = oldHTMLElement;
            }else{
                sep_grid_refresh($scope);
            }
        });
    };


    $( window ).on( 'elementor/frontend/init', function() {

        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_project_masonry.default', alshaProjectMasonrylHandle );   

    } );

})(jQuery);