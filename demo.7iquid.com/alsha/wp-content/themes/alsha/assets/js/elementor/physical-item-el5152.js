(function ($) {
    "use strict";

    function alshaEscape(value) {
        return String(value || "").replace(/[&<>"']/g, function (char) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#039;"
            }[char];
        });
    }

    function getItemData(value) {
        var data = {
            title: "",
            image: ""
        };

        if (typeof value === "string") {
            data.title = value;
            return data;
        }

        if (!value || typeof value !== "object") {
            return data;
        }

        data.title = value.title || value.text || value.name || "";

        if (typeof value.image === "string") {
            data.image = value.image;
        } else if (value.image && value.image.url) {
            data.image = value.image.url;
        } else if (value.image_url) {
            data.image = value.image_url;
        } else if (value.url) {
            data.image = value.url;
        }

        return data;
    }

    function alshaHandle($scope) {
        if (typeof Matter === "undefined") return;

        var Engine = Matter.Engine,
            Render = Matter.Render,
            Runner = Matter.Runner,
            Bodies = Matter.Bodies,
            Composite = Matter.Composite,
            Mouse = Matter.Mouse,
            MouseConstraint = Matter.MouseConstraint,
            Events = Matter.Events,
            Body = Matter.Body;

        var logoArea = $scope.find(".alsha-physical-item-el")[0];

        if (!logoArea) return;

        var instance = logoArea.__alshaPhysicsInstance;

        if (instance) {
            if (instance.render) {
                Render.stop(instance.render);

                if (instance.render.canvas) {
                    instance.render.canvas.remove();
                }

                instance.render.textures = {};
            }

            if (instance.runner) {
                Runner.stop(instance.runner);
            }

            if (instance.engine) {
                Composite.clear(instance.engine.world, false);
                Engine.clear(instance.engine);
            }

            logoArea.querySelectorAll(".pxl-throwable-element").forEach(function (el) {
                el.remove();
            });
        }

        var settings = [];

        try {
            settings = JSON.parse(
                (logoArea.getAttribute("data-settings") || "[]").replace(/&quot;/g, '"')
            );
        } catch (e) {
            settings = [];
        }

        if (!settings.length) return;

        var w = logoArea.offsetWidth;
        var h = logoArea.offsetHeight;

        var circleSize = parseFloat(
            getComputedStyle(logoArea).getPropertyValue("--circle-size")
        ) || 180;

        var engine = Engine.create();

        engine.world.gravity.x = 0;
        engine.world.gravity.y = 0.55;

        var render = Render.create({
            element: logoArea,
            engine: engine,
            options: {
                width: w,
                height: h,
                background: "transparent",
                wireframes: false,
                pixelRatio: window.devicePixelRatio || 1
            }
        });

        var wallOptions = {
            isStatic: true,
            render: {
                visible: false
            }
        };

        var ceiling = Bodies.rectangle(w / 2, -30, w, 60, wallOptions);
        var ground = Bodies.rectangle(w / 2, h + 30, w, 60, wallOptions);
        var leftWall = Bodies.rectangle(-30, h / 2, 60, h, wallOptions);
        var rightWall = Bodies.rectangle(w + 30, h / 2, 60, h, wallOptions);

        var presets = [
            { x: 0.10, y: 0.68, scale: 1 },
            { x: 0.28, y: 0.78, scale: 1 },
            { x: 0.43, y: 0.56, scale: 1 },
            { x: 0.55, y: 0.78, scale: 1 },
            { x: 0.67, y: 0.47, scale: 1 },
            { x: 0.76, y: 0.78, scale: 1 },
            { x: 0.91, y: 0.78, scale: 1 }
        ];

        var shapes = [];

        settings.forEach(function (value, index) {
            var item = getItemData(value);

            var preset = presets[index] || {
                x: 0.15 + index * 0.1,
                y: 0.2,
                scale: 1
            };

            var radius = ((preset.scale || 1) * circleSize) / 2;

            var shape = Bodies.circle(w * preset.x, h * preset.y, radius, {
                restitution: 0.28,
                friction: 0.12,
                frictionAir: 0.025,
                render: {
                    visible: false
                }
            });

            var textElement = document.createElement("p");

            textElement.className = "pxl-throwable-element";
            textElement.style.setProperty("--circle-size", radius * 2 + "px");

            if (item.image) {
                textElement.classList.add("has-image");

                textElement.innerHTML =
                    '<img class="physical-item-image" src="' +
                    alshaEscape(item.image) +
                    '" alt="' +
                    alshaEscape(item.title) +
                    '">' +
                    '<span class="span-element-rot">' +
                    alshaEscape(item.title) +
                    "</span>";
            } else {
                textElement.innerHTML =
                    '<span class="span-element-rot">' +
                    alshaEscape(item.title) +
                    "</span>";
            }

            logoArea.appendChild(textElement);

            setTimeout(function () {
                Body.applyForce(shape, shape.position, {
                    x: (Math.random() - 0.5) * 0.035,
                    y: Math.random() * 0.04 + 0.035
                });
            }, Math.random() * 900);

            shapes.push({
                body: shape,
                element: textElement
            });
        });

        var mouse = Mouse.create(render.canvas);

        var mouseControl = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.16,
                render: {
                    visible: false
                }
            }
        });

        Composite.add(engine.world, [
            ground,
            ceiling,
            leftWall,
            rightWall,
            mouseControl
        ].concat(shapes.map(function (item) {
            return item.body;
        })));

        Render.run(render);

        var runner = Runner.create();

        Runner.run(runner, engine);

        Events.on(engine, "afterUpdate", function () {
            shapes.forEach(function (item) {
                var body = item.body;
                var element = item.element;

                element.style.left = body.position.x + "px";
                element.style.top = body.position.y + "px";
                element.style.transform =
                    "translate(-50%, -50%) rotate(" + body.angle + "rad)";
            });
        });

        logoArea.__alshaPhysicsInstance = {
            engine: engine,
            render: render,
            runner: runner
        };
    }

    function debounce(fn, delay) {
        var timer;

        return function () {
            clearTimeout(timer);
            timer = setTimeout(fn, delay);
        };
    }

    $(window).on("elementor/frontend/init", function () {
        elementorFrontend.hooks.addAction(
            "frontend/element_ready/alsha_physical_item.default",
            function ($scope) {
                alshaHandle($scope);

                var scopeId = $scope.data("id") || "default";

                var rerun = debounce(function () {
                    alshaHandle($scope);
                }, 250);

                $(window)
                    .off("resize.alshaPhysical-" + scopeId)
                    .on("resize.alshaPhysical-" + scopeId, rerun);
            }
        );
    });
})(jQuery);