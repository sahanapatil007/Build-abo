(function ($) {

    class itemEntranceAnimation extends elementorModules.frontend.handlers.Base {

        animate() {
            this.destroy();

            if (!this.$element.hasClass('alsha-scrolling-effects-on')) {
                return;
            }

            const data = this.getElementSettings();
            const el = this.$element[0];

            let fromVars = {
                autoAlpha: parseFloat(data.alsha_el_motion_effect_opacity) || 0,
                scale: parseFloat(data.alsha_el_motion_effect_scale) || 1,
                rotate: data.alsha_el_motion_effect_rotate || 0,
            };

            let toVars = {
                scrollTrigger: {
                    trigger: data.alsha_el_motion_effect_custom_trigger || el,
                    toggleActions: "play none none reset",
                    start: "top bottom",
                    end: "center center",
                    scrub: data.alsha_el_motion_effect_scrub || false,
                    markers: false,
                },
                autoAlpha: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: 0,
                filter: "blur(0px)",
                delay: parseFloat(data.alsha_el_scroll_effect_delay) || 0.2,
                duration: parseFloat(data.alsha_el_scroll_effect_duration) || 0.5,
                ease: data.alsha_el_scroll_effect_ease || 'power3.inOut'
            };

            if (data.alsha_el_motion_effect_x?.size !== '') {
                fromVars.x = data.alsha_el_motion_effect_x.size;
            }

            if (data.alsha_el_motion_effect_y?.size !== '') {
                fromVars.y = data.alsha_el_motion_effect_y.size;
            }

            if (data.alsha_el_motion_effect_filter_blur?.size !== '') {
                fromVars.filter = "blur(" + data.alsha_el_motion_effect_filter_blur.size + "px)";
            }

            gsap.set(el, fromVars);

            this.tween = gsap.to(el, toVars);
            this.scrollTrigger = this.tween.scrollTrigger;
        }
        destroy() {
            const el = this.$element[0];

            if (this.scrollTrigger) {
                this.scrollTrigger.kill();
                this.scrollTrigger = null;
            }

            if (this.tween) {
                this.tween.kill();
                this.tween = null;
            }

            if (el) {
                gsap.set(el, { clearProps: "all" });
            }
        }

        onInit() {
            super.onInit();
            requestAnimationFrame(() => {
                this.animate();
            });
        }

        onElementChange(propertyName) {

            const motionProps = [
                'alsha_el_motion_effect_x',
                'alsha_el_motion_effect_y',
                'alsha_el_scroll_effect_delay',
                'alsha_el_scroll_effect_duration',
                'alsha_el_scroll_effect_ease',
                'alsha_el_motion_effect_filter_blur',
                'alsha_el_motion_effect_scale',
                'alsha_el_motion_effect_opacity',
                'alsha_el_motion_effect_scrub',
                'alsha_el_motion_effect_rotate',
                'alsha_el_motion_effect_custom_trigger'
            ];

            if (motionProps.some(prop => propertyName.includes(prop))) {  

                setTimeout(() => {
                    requestAnimationFrame(() => {
                        this.animate();
                    });
                }, 200);
 
                return;
            }

            if (propertyName === 'alsha_el_scroll_animation') {

               requestAnimationFrame(() => {
                    this.animate();
                });
            }
        }

        onDestroy() {
            this.destroy();
        }
    }

    $( window ).on( 'elementor/frontend/init', function() {
        const addEffectHandler = ( $element ) => {
            elementorFrontend.elementsHandler.addHandler( itemEntranceAnimation, { $element } );
        };
        elementorFrontend.hooks.addAction( 'frontend/element_ready/global', addEffectHandler);
    } );

})(jQuery);
