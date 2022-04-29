import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';

let camera, scene, renderer;

class App {

	init() {

		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.25, 100);
		camera.position.set(0, 0, 100);
		camera.lookAt(0, 0, 0);

		renderer = new THREE.WebGLRenderer({ antialias: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.toneMapping = THREE.ACESFilmicToneMapping;
		renderer.toneMappingExposure = 1;
		renderer.outputEncoding = THREE.sRGBEncoding;
		document.body.appendChild(renderer.domElement);

		const controls = new OrbitControls(camera, renderer.domElement);

	}

	draw() {
		camera.position.set(- 1.8, 0.6, 2.7);
		new RGBELoader()
			.setPath('./src/assets/textures/equirectangular/')
			.load('royal_esplanade_1k.hdr', function (texture) {

				texture.mapping = THREE.EquirectangularReflectionMapping;

				scene.background = texture;
				scene.environment = texture;

			});

		const loader = new GLTFLoader().setPath('./src/assets/models/gltf/DamagedHelmet/glTF/');
		loader.load('DamagedHelmet.gltf', function (gltf) {

			scene.add(gltf.scene);


		});

		animate();
	}

}

function animate() {
	requestAnimationFrame(animate);

	renderer.render(scene, camera);
};

export default App;
