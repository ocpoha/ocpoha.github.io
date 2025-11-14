import * as THREE from 'three';  
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { initRenderer, initStats, addGeometry } from '../util.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const renderer = initRenderer();

let camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 0;
camera.position.y = 30;
camera.position.z = 120;
camera.lookAt(scene.position);
scene.add(camera);

let orbitControls = new OrbitControls(camera, renderer.domElement);
orbitControls.enableDamping = true;
const stats = initStats();

scene.add(new THREE.AmbientLight(0xffffff));

const textureLoader = new THREE.TextureLoader();

const sun = new THREE.SphereGeometry(10);
const sunMaterial = new THREE.MeshBasicMaterial({color: 0xffff00});
const sunMesh = new THREE.Mesh(sun, sunMaterial);
sunMesh.position.set(0, 0, 0);
scene.add(sunMesh);

const mercuryBase = new THREE.Object3D();
scene.add(mercuryBase);
const mercury = new THREE.SphereGeometry(1.5, 20, 20)
const mercuryMesh = addGeometry(mercuryBase, mercury,
                        textureLoader.load('./Mercury.jpg'));
mercuryMesh.position.set(0, 0, -20);
mercuryMesh.castShadow = true;

const venusBase = new THREE.Object3D();
scene.add(venusBase);
const venus = new THREE.SphereGeometry(3, 20, 20)
const venusMesh = addGeometry(venusBase, venus,
                        textureLoader.load('./Venus.jpg'));
venusMesh.position.set(0, 0, -35);                        
venusMesh.castShadow = true;

const earthBase = new THREE.Object3D();
scene.add(earthBase);
const earth = new THREE.SphereGeometry(3.5, 20, 20)
const earthMesh = addGeometry(earthBase, earth,
                        textureLoader.load('./Earth.jpg'));
earthMesh.position.set(0, 0, -50);
earthMesh.castShadow = true;

const marsBase = new THREE.Object3D();
scene.add(marsBase);
const mars = new THREE.SphereGeometry(2.5, 20, 20)
const marsMesh = addGeometry(marsBase, mars,
                        textureLoader.load('./Mars.jpg'));
marsMesh.position.set(0, 0, -65);
marsMesh.castShadow = true;

const gui = new GUI();

const controls = new function () {
    this.mercuryRotationSpeed = 0.02;
    this.mercuryOrbitSpeed = 0.02;
    this.venusRotationSpeed = 0.015;
    this.venusOrbitSpeed = 0.015;
    this.earthRotationSpeed = 0.01;
    this.earthOrbitSpeed = 0.01;
    this.marsRotationSpeed = 0.008;
    this.marsOrbitSpeed = 0.008;

    this.perspective = "Perspective";
    this.switchCamera = function () {
        if (camera instanceof THREE.PerspectiveCamera) {
            scene.remove(camera);
            camera = null; // 기존의 camera 제거
            // OrthographicCamera(left, right, top, bottom, near, far)
            camera = new THREE.OrthographicCamera(window.innerWidth / -16, 
                window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            camera.position.x = 0;
            camera.position.y = 30;
            camera.position.z = 120;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Orthographic";
        } else {
            scene.remove(camera);
            camera = null; 
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.x = 0;
            camera.position.y = 30;
            camera.position.z = 120;
            camera.lookAt(scene.position);
            orbitControls.dispose(); // 기존의 orbitControls 제거
            orbitControls = null;
            orbitControls = new OrbitControls(camera, renderer.domElement);
            orbitControls.enableDamping = true;
            this.perspective = "Perspective";
        }
    };
};
const guiCamera = gui.addFolder('Camera');
guiCamera.add(controls, 'switchCamera');
guiCamera.add(controls, 'perspective').listen();

const guiMercury = gui.addFolder('Mercury');
guiMercury.add(controls, 'mercuryRotationSpeed', 0, 0.1).name('Rotation Speed');
guiMercury.add(controls, 'mercuryOrbitSpeed', 0, 0.1).name('Orbit Speed');

const guiVenus = gui.addFolder('Venus');
guiVenus.add(controls, 'venusRotationSpeed', 0, 0.1).name('Rotation Speed');
guiVenus.add(controls, 'venusOrbitSpeed', 0, 0.1).name('Orbit Speed');

const guiEarth = gui.addFolder('Earth');
guiEarth.add(controls, 'earthRotationSpeed', 0, 0.1).name('Rotation Speed');
guiEarth.add(controls, 'earthOrbitSpeed', 0, 0.1).name('Orbit Speed');

const guiMars = gui.addFolder('Mars');
guiMars.add(controls, 'marsRotationSpeed', 0, 0.1).name('Rotation Speed');
guiMars.add(controls, 'marsOrbitSpeed', 0, 0.1).name('Orbit Speed');

render();

function render() {
  stats.update();
  orbitControls.update();
  requestAnimationFrame(render);
  renderer.render(scene, camera);
  mercuryBase.rotation.y += controls.mercuryOrbitSpeed;
  mercuryMesh.rotation.y += controls.mercuryRotationSpeed;
  venusBase.rotation.y += controls.venusOrbitSpeed;
  venusMesh.rotation.y += controls.venusRotationSpeed;
  earthBase.rotation.y += controls.earthOrbitSpeed;
  earthMesh.rotation.y += controls.earthRotationSpeed;
  marsBase.rotation.y += controls.marsOrbitSpeed;
  marsMesh.rotation.y += controls.marsRotationSpeed;
}

