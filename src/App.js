import * as THREE from 'three';
import { PerspectiveCamera } from 'three';

import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer, controls;

let objects = [];
let cameras = [];

function objectVisualize(object) {
	const axes = new THREE.AxesHelper();
	axes.material.depthTest = false;
	axes.renderOrder = 1;
	object.add(axes)

	const box = new THREE.BoxHelper(object, 0xffff00);
	scene.add(box);
}

function cameraVisualize(obj) {
	const helper = new THREE.CameraHelper(obj);
	scene.add(helper);
}

class App {

	init() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		camera.position.set(8, 4, 10);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setClearColor(0xAAAAAA);
		renderer.shadowMap.enabled = true;
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
		camera.position.set(8, 4, 10);
		camera.lookAt(0, 0, 0);

		// map
		const groundGeometry = new THREE.PlaneGeometry(50, 50);
		const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
		const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
		groundMesh.rotation.x = Math.PI * -.5;
		groundMesh.receiveShadow = true;
		scene.add(groundMesh);

		const carWidth = 4;
		const carHeight = 1;
		const carLength = 8;

		//tank object frame
		const tank = new THREE.Object3D();
		scene.add(tank);

		//tank body
		const bodyGeometry = new THREE.BoxGeometry(carWidth, carHeight, carLength);
		const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA });
		const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
		bodyMesh.position.y = 1.4;
		bodyMesh.castShadow = true;
		tank.add(bodyMesh);

		//tank camera
		const tankCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		tankCamera.position.y = 3;
		tankCamera.position.z = -6;
		tankCamera.rotation.y = Math.PI;
		bodyMesh.add(tankCamera);

		//tank wheel
		const wheelRadius = 1;
		const wheelThickness = .5;
		const wheelSegments = 30;
		const wheelGeometry = new THREE.CylinderGeometry(
			wheelRadius,     // top radius
			wheelRadius,     // bottom radius
			wheelThickness,  // height of cylinder
			wheelSegments);
		const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
		const wheelPositions = [
			[-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
			[carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
			[-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
			[carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
			[-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
			[carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
		];
		const wheelMeshes = wheelPositions.map((position) => {
			const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
			mesh.position.set(...position);
			mesh.rotation.z = Math.PI * .5;
			mesh.castShadow = true;
			bodyMesh.add(mesh);
			return mesh;
		});

		const domeRadius = 2;
		const domeWidthSubdivisions = 12;
		const domeHeightSubdivisions = 12;
		const domePhiStart = 0;
		const domePhiEnd = Math.PI * 2;
		const domeThetaStart = 0;
		const domeThetaEnd = Math.PI * .5;
		const domeGeometry = new THREE.SphereGeometry(
			domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
			domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
		const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
		domeMesh.castShadow = true;
		bodyMesh.add(domeMesh);
		domeMesh.position.y = .5;

		const turretWidth = .1;
		const turretHeight = .1;
		const turretLength = carLength * .75 * .2;
		const turretGeometry = new THREE.BoxGeometry(
			turretWidth, turretHeight, turretLength);
		const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
		const turretPivot = new THREE.Object3D();
		turretMesh.castShadow = true;
		turretPivot.scale.set(5, 5, 5);
		turretPivot.position.y = .5;
		turretMesh.position.z = turretLength * 0.5;
		turretPivot.add(turretMesh);
		bodyMesh.add(turretPivot);

		const turretCamera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
		turretCamera.position.y = .75 * .2;
		turretMesh.add(turretCamera);

		cameraVisualize(turretCamera)


		function animate(time) {
			console.log(time)
			requestAnimationFrame(animate);

			time *= 0.001;

			controls.update()

			wheelMeshes.forEach((obj) => {
				obj.rotation.x = time;
			});


			renderer.render(scene, camera);
		};
		animate();
	}

}



export default App;
