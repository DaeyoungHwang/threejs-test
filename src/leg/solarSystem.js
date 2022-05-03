import * as THREE from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer, controls;

let objects = [];

class App {

    init() {

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.25, 200);
        camera.position.set(0, 0, 100);
        camera.lookAt(0, 0, 0);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1;
        renderer.outputEncoding = THREE.sRGBEncoding;
        document.body.appendChild(renderer.domElement);

        controls = new TrackballControls(camera, renderer.domElement)

        controls.rotateSpeed = 5.0;
        controls.zoomSpeed = 5.0;
        controls.panSpeed = 2;
        controls.noZoom = false;
        controls.noPan = false;
        controls.staticMoving = true;
        controls.dynamicDampingFactor = 0.3;

        const light = new THREE.DirectionalLight(0xFFFFFF, 1);
        const light2 = new THREE.DirectionalLight(0xFFFFFF, 1);

        light.position.set(-1, 2, 4);
        scene.add(light);

        light2.position.set(2, -1, -4);
        scene.add(light2);

    }

    draw() {
        camera.position.set(0, 100, 0);
        camera.lookAt(0, 0, 0);

        // 하나의 geometry로 모든 태양, 지구, 달을 생성
        const radius = 1;
        const widthSegments = 6;
        const heightSegments = 6;
        const sphereGeometry = new THREE.SphereGeometry(
            radius, widthSegments, heightSegments);

        const solarSystem = new THREE.Object3D();
        scene.add(solarSystem);
        objects.push(solarSystem);

        const sunMaterial = new THREE.MeshPhongMaterial({ emissive: 0xFFFF00 });
        const sunMesh = new THREE.Mesh(sphereGeometry, sunMaterial);
        sunMesh.scale.set(5, 5, 5);  // 태양의 크기를 키움
        solarSystem.add(sunMesh);
        objects.push(sunMesh);

        // single point light 추가
        const color = 0xFFFFFF;
        const intensity = 10;
        const sunLight = new THREE.PointLight(color, intensity);
        scene.add(sunLight)

        const earthOrbit = new THREE.Object3D();
        earthOrbit.position.x = 10;
        solarSystem.add(earthOrbit);
        objects.push(earthOrbit);

        // 지구 추가

        const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233FF, emissive: 0x112244 });
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        earthOrbit.add(earthMesh);
        objects.push(earthMesh);

        const moonOrbit = new THREE.Object3D();
        moonOrbit.position.x = 2;
        earthOrbit.add(moonOrbit);

        const moonMaterial = new THREE.MeshPhongMaterial({ color: 0x888888, emissive: 0x222222 });
        const moonMesh = new THREE.Mesh(sphereGeometry, moonMaterial);
        moonMesh.scale.set(.5, .5, .5);
        moonOrbit.add(moonMesh);
        objects.push(moonMesh);

        objects.forEach((node) => {
            const axes = new THREE.AxesHelper();
            axes.material.depthTest = false;
            axes.renderOrder = 1;
            node.add(axes);
        });


        animate();
    }

}

function animate(time) {
    console.log(time)
    requestAnimationFrame(animate);

    time *= 0.001;

    controls.update()

    objects.forEach((obj) => {
        obj.rotation.y = time;
    });


    renderer.render(scene, camera);
};

export default App;
