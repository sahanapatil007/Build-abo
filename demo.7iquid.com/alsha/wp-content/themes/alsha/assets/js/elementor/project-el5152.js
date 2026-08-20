( function( $ ) {
    "use strict";  
    var projectHandle = function( $scope, $ ) {
 
        var offset = 0;
        var cat = 'all';
        var found_posts = project_el.found_posts;

        $( document).on( 'click', '.load-more-button', function(){

            var _this = $( this), posts_per_page = parseInt(project_el.posts_per_page);
   
            offset += posts_per_page;
   
            $.ajax({
                type: 'POST',
                url: main_data.ajaxurl,
                dataType: 'json',
                data: {
                    action: 'load_project_item',
                    post_per_page: posts_per_page,
                    offset: offset,
                    order:  project_el.order,             
                    orderby:  project_el.orderby,
                    category: cat,
                    tax_query: project_el.tax_query,
                    image_size: project_el.image_size,
                    item_layout: project_el.item_layout,
                    ajax_nonce: main_data.nonce             
                },
                beforeSend: function(){
                    _this.addClass( 'is-loading');
                },
                success: function( res) {
                
                    _this.removeClass( 'is-loading');

                    $( '.alsha-grid').append( res.html).hide().fadeIn("slow");  

                    if( ( offset + posts_per_page) >= found_posts){           
                        _this.closest( '.load-more-post').hide();
                    }
            
                }
            })
        })

        $( document).on( 'click', '.categories-filter .filter-item:not( .active)', function(){
            
            var _this = $( this), filter = _this.data( 'filter'), posts_per_page = parseInt( project_el.posts_per_page);
            
            $( '.categories-filter .filter-item').removeClass( 'active');

            $( this).addClass( 'active');
           
            $.ajax({
                type: 'POST',
                url: main_data.ajaxurl,
                dataType: 'json',
                data: {
                    action: 'load_project_grid',
                    post_per_page: posts_per_page,                
                    order:  project_el.order,             
                    orderby:  project_el.orderby, 
                    category: filter.slug,
                    image_size: project_el.image_size,
                    item_layout: project_el.item_layout,
                    ajax_nonce: main_data.nonce           
                },
                beforeSend: function(){
                    $( '.alsha-project-el').css({
                        "opacity": "0.7",
                        "pointer-events": "none",
                    })
                },
                success: function( res) {
                    offset = 0;
                    cat = filter.slug;
                    found_posts = res.found_posts;
                    $( '.alsha-project-el').removeAttr( 'style');
                    $( '.project-wrap').html( res.html).hide().fadeIn("slow");  
                }
            })
        });

        let mouseX = 0;
        let mouseY = 0;
        let isActive = false;
        let animationFrame = null;

        const $cursor = $scope.find('.alsha-custom-cursor');

        $scope.on('mousemove.projectCursor', function(e) {
            mouseX = e.clientX;
            mouseY = e.clientY;

            if (isActive && !animationFrame) {
                animationFrame = requestAnimationFrame(function() {
                    $cursor.css({
                        left: mouseX,
                        top: mouseY
                    });

                    animationFrame = null;
                });
            }
        });

        $scope.on(
            'mouseenter.projectCursor',
            '.post-featured-image',
            function() {
                isActive = true;
                $cursor.addClass('active').css('opacity', 1);
            }
        );

        $scope.on(
            'mouseleave.projectCursor',
            '.post-featured-image',
            function() {
                isActive = false;
                $cursor.removeClass('active').css('opacity', 0);
            }
        );

        $scope.on('mouseleave.projectCursor', function() {
            isActive = false;
            $cursor.removeClass('active').css('opacity', 0);
        });
    };
 
    // Make sure you run this code under Elementor.
    $( window ).on( 'elementor/frontend/init', function() {
    
        elementorFrontend.hooks.addAction( 'frontend/element_ready/alsha_project.default', projectHandle );        
    } );
} )( jQuery );