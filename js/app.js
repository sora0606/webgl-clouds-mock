import * as THREE from 'three';

import vertex from "./shader/vertex.glsl"
import fragment from "./shader/fragment.glsl"

import dat from "dat.gui";
import smoke from "/img/smoke.png"

export default class Sketch {
    constructor(opstions) {
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x55cde6, 0.001);

        this.container = opstions.dom;
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(this.scene.fog.color);

        this.container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            1,
            1000.0
        );
        this.camera.position.set(0.0, 0.0, 1.0);
        this.camera.rotation.set(1.16, -0.12, 0.27);

        this.time = 0;

        this.isPlaying = true;

        this.loader = new THREE.TextureLoader();
        this.clouds = [];

        this.addLight();
        this.addObjects();
        // this.resize();
        this.render();
        // this.setupResize();
        // this.settings();
    }

    settings() {
        let that = this;
        this.settings = {
            progress: 0,
        };

        this.gui = new dat.GUI();
        this.gui.add(this.settings, "progress", 0.0, 1.0, 0.01);
    }

    setupResize() {
        window.addEventListener('resize', this.resize.bind(this));
    }

    resize() {
        this.width = this.container.offsetWidth;
        this.height = this.container.offsetHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = this.width / this.height;

        this.camera.updateProjectionMatrix();
    }

    addObjects() {
        let that = this;
        this.loader.load(smoke, (texture) => {
            this.geometry = new THREE.PlaneGeometry(500.0, 500.0);
            this.material = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true
            });

            for(let p = 0; p < 10; p++){
                const cloud = new THREE.Mesh(this.geometry, this.material);
                cloud.position.set(
                    Math.random() * 800 - 400,
                    Math.random() * 800 - 400,
                    Math.random() * 500 - 500
                );
                cloud.rotation.x = 1.16;
                cloud.rotation.y = -0.12;
                cloud.rotation.z = Math.random() * 2 * Math.PI;
                cloud.material.opacity = 0.55;
                this.clouds.push(cloud);
                this.scene.add(cloud);
            }
        });
    }

    addLight(){
        const ambient = new THREE.AmbientLight(0xffffff);
        this.scene.add(ambient);

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0.0, 0.0, 1.0);
        this.scene.add(directionalLight);
    }

    stop() {
        this.isPlaying = false;
    }

    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.render();
        }
    }

    render() {
        if (!this.isPlaying) return;
        this.time += 0.01;

        this.clouds.forEach((cloud) => {
            cloud.rotation.z -= 0.0003;
        })

        requestAnimationFrame(this.render.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

new Sketch({
    dom: document.getElementById("container")
});