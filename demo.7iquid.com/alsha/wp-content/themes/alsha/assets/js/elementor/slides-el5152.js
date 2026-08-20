(function ($) {
    "use strict";

    class CanvasSlider {
        constructor($scope) {
            this.$scope = $scope;
            
            this.config = {
                speed: 800,
                transitionSpeed: 0.04,
                numColumns: 12
            };

            this.state = {
                currentIdx: 0,
                targetIdx: 0,
                transitionProgress: 1,
                images: []
            };

            if (!this.initDOM()) return;
            
            this.initEvents();
            this.loadAssets().then(() => {
                this.initSwiper();
                this.animate();
            });
        }

        initDOM() {
            this.$canvas = this.$scope.find('#bg-canvas');
            if (!this.$canvas.length) return false;

            this.canvas = this.$canvas[0];
            this.ctx = this.canvas.getContext('2d');
            this.$imgElements = this.$scope.find('.swiper-slide img');
            this.swiperContainer = this.$scope.find('.alsha-slides')[0];
            this.containerElement = this.$scope.find('.alsha-slides-el')[0] || this.canvas.parentElement;

            this.settings = {};
            if (this.swiperContainer) {
                this.settings = $(this.swiperContainer).data('settings') || {};
            }

            this.resizeCanvas();
            return true;
        }

        initEvents() {
            $(window).on('resize', () => this.resizeCanvas());
        }

        resizeCanvas() {
            const $container = $(this.canvas).parent();
            this.canvas.width = $container.width();
            this.canvas.height = $container.height();
        }

        loadAssets() {
            return new Promise((resolve) => {
                let loadedCount = 0;
                const totalImages = this.$imgElements.length;

                if (totalImages === 0) resolve();

                this.$imgElements.each((index, imgTag) => {
                    const img = new Image();
                    img.src = $(imgTag).attr('src');
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount === totalImages) resolve();
                    };
                    this.state.images[index] = img;
                });
            });
        }

        initSwiper() {
            if (!this.swiperContainer) return;

            const autoplayEnabled = this.settings.autoplay === 'on';
            const pauseOnHover = this.settings.pause_on_hover === 'on';

            this.swiper = new Swiper(this.swiperContainer, {
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                loop: true,
                speed: this.config.speed,
                autoplay: autoplayEnabled
                    ? {
                        delay: Number(this.settings.autoplay_speed) || 5000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: pauseOnHover
                    }
                    : false,
                pagination: {
                    el: this.$scope.find(".swiper-pagination.progressbar")[0],
                    type: "progressbar"
                },
                wrapperClass: 'swiper-wrapper',
                slideClass: 'swiper-slide',
                on: {
                    init: (swiper) => {
                        this.initContentAnimation(swiper);
                    },
                    slideChangeTransitionStart: (swiper) => {
                        if (typeof gsap === "undefined") return;

                        const slides = swiper.slides;
                        gsap.set($(slides).find(".title, .description"), {
                            y: 40,
                            opacity: 0
                        });
                    },
                    slideChangeTransitionEnd: (swiper) => {
                        this.animateContent(swiper);
                    },
                    slideChange: (swiper) => {
                        this.state.targetIdx = swiper.realIndex;
                        this.state.transitionProgress = 0;
                    }
                }
            });
        }

        drawImageCover(img, opacity) {
            if (!img || !img.complete) return;
            
            this.ctx.save();
            this.ctx.globalAlpha = opacity;

            const style = window.getComputedStyle(this.containerElement);
            const imgSizePercent = parseFloat(style.getPropertyValue('--alsha-canvas-img-size')) || 100;
            const imgXPercent = parseFloat(style.getPropertyValue('--alsha-canvas-img-x')) || 50;
            const imgYPercent = parseFloat(style.getPropertyValue('--alsha-canvas-img-y')) || 50;

            const imgRatio = img.width / img.height;
            const canvasRatio = this.canvas.width / this.canvas.height;
            let startX, startY, renderW, renderH;

            if (canvasRatio > imgRatio) {
                renderW = this.canvas.width;
                renderH = this.canvas.width / imgRatio;
            } else {
                renderW = this.canvas.height * imgRatio;
                renderH = this.canvas.height;
            }

            renderW = renderW * (imgSizePercent / 100);
            renderH = renderH * (imgSizePercent / 100);

            startX = (this.canvas.width - renderW) * (imgXPercent / 100);
            startY = (this.canvas.height - renderH) * (imgYPercent / 100);

            this.ctx.drawImage(img, startX, startY, renderW, renderH);
            this.ctx.restore();
        }

        render() {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            const { currentIdx, targetIdx, transitionProgress, images } = this.state;

            if (currentIdx === targetIdx) {
                if (images[currentIdx]) {
                    this.drawImageCover(images[currentIdx], 1);
                }
            } else {
                if (images[currentIdx]) {
                    this.drawImageCover(images[currentIdx], 1 - transitionProgress);
                }
                if (images[targetIdx]) {
                    this.drawImageCover(images[targetIdx], transitionProgress);
                }
            }
        }

        animate() {
            if (this.state.transitionProgress < 1) {
                this.state.transitionProgress += this.config.transitionSpeed;
                if (this.state.transitionProgress > 1) {
                    this.state.transitionProgress = 1;
                    this.state.currentIdx = this.state.targetIdx;
                }
            }

            this.render();
            requestAnimationFrame(() => this.animate());
        }
        initContentAnimation(swiper) {
            if (typeof gsap === "undefined") return;

            const $contents = this.$scope.find(".slide-content");

            gsap.set($contents.find(".title, .description"), {
                y: 40,
                opacity: 0
            });

            this.animateContent(swiper);
        }

        animateContent(swiper) {
            if (typeof gsap === "undefined") return;

            const activeSlide = swiper.slides[swiper.activeIndex];
            if (!activeSlide) return;

            const title = activeSlide.querySelector(".title");
            const description = activeSlide.querySelector(".description");

            gsap.killTweensOf([title, description]);

            gsap.fromTo(
                title,
                {
                    y: 42,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power3.out",
                    delay: 0.15
                }
            );

            gsap.fromTo(
                description,
                {
                    y: 34,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.75,
                    ease: "power3.out",
                    delay: 0.28
                }
            );
        }
    }

    $(window).on('elementor/frontend/init', function () {
        elementorFrontend.hooks.addAction('frontend/element_ready/alsha_slides.default', ($scope) => {
            new CanvasSlider($scope);
        });
    });

})(jQuery);
