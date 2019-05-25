/* 2017-11-29 09:19:59 | 修改 木遥（QQ：346819890） */
//模块：
mars3d.widget.bindClass(mars3d.widget.BaseWidget.extend({
    options: {
        //弹窗
        view: {
            type: "window",
            url: "view.html",
            windowOptions: {
                width: 240,
                height: 100
            }
        },
    },
    drawControl: null,
    particles: null,
    //初始化[仅执行1次]
    create: function () {
        this.particles = [];
        var that = this;
        this.drawControl = new mars3d.Draw({
            viewer: this.viewer,
            hasEdit: false,
            onStopDrawing: function (entity) {
                that.createParticle(entity);
            }
        });
    },
    viewWindow: null,
    //每个窗口创建完成后调用
    winCreateOK: function (opt, result) {
        this.viewWindow = result;
    },
    //激活插件
    activate: function () {
        //this.viewer.scene.debugShowFramesPerSecond = true;
    },
    //释放插件
    disable: function () {
        this.viewWindow = null;
        //this.viewer.scene.debugShowFramesPerSecond = false;
        //this.clear();
    },
    createFire: function (options) {
        this.drawControl.startDraw({
            type: "point",
            style: {}
        });
    },
    createParticle: function (entity) {
        var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(entity.position.getValue());
        this.drawControl.deleteEntity(entity);


        //
        var viewModel = {
            emissionRate: 5.0,
            gravity: 0.0,
            minimumParticleLife: 1.0,
            maximumParticleLife: 1.0,
            minimumSpeed: 1.0,
            maximumSpeed: 4.0,
            startScale: 1.0,
            endScale: 5.0,
            particleSize: 25.0,
            transX: 2.5,
            transY: 4.0,
            transZ: 1.0,
            heading: 0.0,
            pitch: 0.0,
            roll: 0.0,
            fly: true,
            spin: true,
            show: true
        };
         
        var emitterModelMatrix = new Cesium.Matrix4();
        var translation = new Cesium.Cartesian3();
        var rotation = new Cesium.Quaternion();
        var hpr = new Cesium.HeadingPitchRoll();
        var trs = new Cesium.TranslationRotationScale();
        function computeEmitterModelMatrix() {
            hpr = Cesium.HeadingPitchRoll.fromDegrees(viewModel.heading, viewModel.pitch, viewModel.roll, hpr);

            trs.translation = Cesium.Cartesian3.fromElements(viewModel.transX, viewModel.transY, viewModel.transZ, translation);
            trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

            return Cesium.Matrix4.fromTranslationRotationScale(trs, emitterModelMatrix);
        }
         
        var particleSystem = this.viewer.scene.primitives.add(new Cesium.ParticleSystem({
            image: this.path + '/img/fire.png',
            startColor: Cesium.Color.RED.withAlpha(0.7),
            endColor: Cesium.Color.YELLOW.withAlpha(0.3),
            startScale: viewModel.startScale,
            endScale: viewModel.endScale,
            minimumParticleLife: viewModel.minimumParticleLife,
            maximumParticleLife: viewModel.maximumParticleLife,
            minimumSpeed: viewModel.minimumSpeed,
            maximumSpeed: viewModel.maximumSpeed,
            imageSize: new Cesium.Cartesian2(viewModel.particleSize, viewModel.particleSize),
            // Particles per second.
            emissionRate: viewModel.emissionRate,
            bursts: [
                // these burst will occasionally sync to create a multicolored effect
                new Cesium.ParticleBurst({ time: 5.0, minimum: 10, maximum: 100 }),
                new Cesium.ParticleBurst({ time: 10.0, minimum: 50, maximum: 100 }),
                new Cesium.ParticleBurst({ time: 15.0, minimum: 200, maximum: 300 })
            ],
            lifetime: 16.0,
            emitter: new Cesium.CircleEmitter(2.0),
            modelMatrix: modelMatrix,
            emitterModelMatrix: computeEmitterModelMatrix()
        }));
        this.particles.push(particleSystem);
          
    }, 
    clear: function () {
        for (var i = 0; i < this.particles.length; i++) {
            this.viewer.scene.primitives.remove(this.particles[i]);
        }
        this.particles = [];

        this.removeRain();
        this.removeSnow();
    },
    //雪
    snowPrimitive: null,
    removeSnow: function () {

        if (this.snowPrimitive) {
            this.viewer.scene.primitives.remove(this.snowPrimitive);
            this.snowPrimitive = null;
        }
    },
    addSnow: function () {
        this.removeRain();
        this.removeSnow();

        var scene = this.viewer.scene;
        var snowParticleSize = scene.drawingBufferWidth / 100.0;
        var snowRadius = 100000.0;
        var minimumSnowImageSize = new Cesium.Cartesian2(snowParticleSize, snowParticleSize);
        var maximumSnowImageSize = new Cesium.Cartesian2(snowParticleSize * 2.0, snowParticleSize * 2.0);
        var snowSystem;

        var snowGravityScratch = new Cesium.Cartesian3();
        var snowUpdate = function (particle, dt) {
            snowGravityScratch = Cesium.Cartesian3.normalize(particle.position, snowGravityScratch);
            Cesium.Cartesian3.multiplyByScalar(snowGravityScratch, Cesium.Math.randomBetween(-30.0, -300.0), snowGravityScratch);
            particle.velocity = Cesium.Cartesian3.add(particle.velocity, snowGravityScratch, particle.velocity);

            var distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
            if (distance > snowRadius) {
                particle.endColor.alpha = 0.0;
            } else {
                particle.endColor.alpha = snowSystem.endColor.alpha / (distance / snowRadius + 0.1);
            }
        };

        snowSystem = new Cesium.ParticleSystem({
            modelMatrix: new Cesium.Matrix4.fromTranslation(scene.camera.position),
            minimumSpeed: -1.0,
            maximumSpeed: 0.0,
            lifetime: 15.0,
            emitter: new Cesium.SphereEmitter(snowRadius),
            startScale: 0.5,
            endScale: 1.0,
            image: this.path + 'img/snowflake_particle.png',
            emissionRate: 7000.0,
            startColor: Cesium.Color.WHITE.withAlpha(0.0),
            endColor: Cesium.Color.WHITE.withAlpha(1.0),
            minimumImageSize: minimumSnowImageSize,
            maximumImageSize: maximumSnowImageSize,
            updateCallback: snowUpdate
        });
        this.snowPrimitive = scene.primitives.add(snowSystem);

        // 
        scene.skyAtmosphere.hueShift = -0.8;
        scene.skyAtmosphere.saturationShift = -0.7;
        scene.skyAtmosphere.brightnessShift = -0.33;

        scene.fog.density = 0.001;
        scene.fog.minimumBrightness = 0.8;

    },
    // 雨
    rainPrimitive: null,
    removeRain: function () {
        if (this.rainPrimitive) {
            this.viewer.scene.primitives.remove(this.rainPrimitive);
            this.rainPrimitive = null;
        }
    },
    addRain: function () {
        this.removeRain();
        this.removeSnow();

        var scene = this.viewer.scene;
        var rainParticleSize = scene.drawingBufferWidth / 80.0;
        var rainRadius = 100000.0;
        var rainImageSize = new Cesium.Cartesian2(rainParticleSize, rainParticleSize * 2.0);

        var rainSystem;

        var rainGravityScratch = new Cesium.Cartesian3();
        var rainUpdate = function (particle, dt) {
            rainGravityScratch = Cesium.Cartesian3.normalize(particle.position, rainGravityScratch);
            rainGravityScratch = Cesium.Cartesian3.multiplyByScalar(rainGravityScratch, -1050.0, rainGravityScratch);

            particle.position = Cesium.Cartesian3.add(particle.position, rainGravityScratch, particle.position);

            var distance = Cesium.Cartesian3.distance(scene.camera.position, particle.position);
            if (distance > rainRadius) {
                particle.endColor.alpha = 0.0;
            } else {
                particle.endColor.alpha = rainSystem.endColor.alpha / (distance / rainRadius + 0.1);
            }
        };

        rainSystem = new Cesium.ParticleSystem({
            modelMatrix: new Cesium.Matrix4.fromTranslation(scene.camera.position),
            speed: -1.0,
            lifetime: 15.0,
            emitter: new Cesium.SphereEmitter(rainRadius),
            startScale: 1.0,
            endScale: 0.0,
            image: this.path + 'img/circular_particle.png',
            emissionRate: 9000.0,
            startColor: new Cesium.Color(0.27, 0.5, 0.70, 0.0),
            endColor: new Cesium.Color(0.27, 0.5, 0.70, 0.98),
            imageSize: rainImageSize,
            updateCallback: rainUpdate
        });
        this.rainPrimitive = scene.primitives.add(rainSystem);

        // 
        scene.skyAtmosphere.hueShift = -0.97;
        scene.skyAtmosphere.saturationShift = 0.25;
        scene.skyAtmosphere.brightnessShift = -0.4;

        scene.fog.density = 0.00025;
        scene.fog.minimumBrightness = 0.01;
    },













}));