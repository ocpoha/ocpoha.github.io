import * as THREE from 'three';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const scene = new THREE.Scene();

const aspect = window.innerWidth / window.innerHeight;
let camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
camera.position.set(4, 2, 5);
camera.lookAt(4, 0, 0);
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0x123456));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const directionalLight = new THREE.DirectionalLight(0xffffff, 3.0);
directionalLight.position.set(-20, 40, 60);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);

let isOrtho = false;
let isGameOver = false;
let gameOverReason = "";
const status = {
    gauge: 100
}

// 물리 변수
let velocity = new THREE.Vector3(0.03, 0, 0); // 자동 이동 속도 (X)
const GRAVITY = -0.01;
const JUMP_POWER = 0.2;
let isGrounded = true;

const gui = new GUI({ title: 'Game HUD' });
gui.add(status, 'gauge', 0, 100)
    .name('투영 게이지')
    .listen()
    .disable();

const mapPositions = [
    { x: 4, y: 0, z: 0 },
    { x: 5, y: 0, z: 0 },
    { x: 7, y: 0, z: 0 },
    { x: 8, y: 0, z: -10 },
    { x: 9, y: 0, z: -10 },
    { x: 10, y: 0, z: -10 },
    { x: 11, y: 0, z: -5 },
    { x: 11, y: 0, z: -10 },
    { x: 13, y: 0, z: -5 },
    { x: 14, y: 0, z: -5 },
    { x: 15, y: 0, z: -10 },
    { x: 16, y: 0, z: -10 },
    { x: 17, y: 0, z: -10 },
    { x: 18, y: 0, z: -15 },
    { x: 18, y: 0, z: -20 },
    { x: 18, y: 0, z: -25 },
    { x: 19, y: 0, z: -20 },
    { x: 20, y: 0, z: -20 },
    { x: 22, y: 0, z: -20 }
];

const cubeGeometry = new THREE.BoxGeometry(1, 0.5, 0.5);
const cubeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
const cubes = [];

mapPositions.forEach(pos => {
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(pos.x, pos.y, pos.z);

    cube.userData.originalZ = cube.position.z;
    // 바운딩 박스 (충돌 감지용)
    cube.geometry.computeBoundingBox();
    cube.bbox = new THREE.Box3().setFromObject(cube);

    scene.add(cube);
    cubes.push(cube);
});


// Sphere Character
const sphereGeometry = new THREE.SphereGeometry(0.25, 32, 32);
const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(4, 1.5, 0);
scene.add(sphere);

// goal
const icosahedronGeometry = new THREE.IcosahedronGeometry(0.5, 0);
const icosahedronMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
const goal = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial);
goal.position.set(22, 0.7, -20);
scene.add(goal);

function switchCamera() {
    isOrtho = !isOrtho;
    let previousPosition = camera.position.clone();
    let previousQuaternion = camera.quaternion.clone();

    scene.remove(camera);

    if (camera instanceof THREE.PerspectiveCamera) {
        camera = new THREE.OrthographicCamera(
            window.innerWidth / -256,
            window.innerWidth / 256,
            window.innerHeight / 256,
            window.innerHeight / -256,
            0.1, 1000);
    } else {
        camera = new THREE.PerspectiveCamera(
            60, window.innerWidth / window.innerHeight, 0.1, 1000);
    }
    camera.position.copy(previousPosition);
    camera.quaternion.copy(previousQuaternion);
    scene.add(camera);
}

window.addEventListener('keydown', function (event) {
    if (isGameOver && event.key === 'Enter') {
        resetGame();
        return;
    }
    if (event.key === 'Tab') {
        event.preventDefault();
        switchCamera();
    }
    if (event.code === 'Space') {
        if (isGrounded) {
            velocity.y = JUMP_POWER;
            isGrounded = false;
        }
    }
});

function updatePhysics() {
    // 중력 및 속도 적용
    velocity.y += GRAVITY;
    sphere.position.x += velocity.x;
    sphere.position.y += velocity.y;

    const playerBottomY = sphere.position.y - 0.25;
    const playerX = sphere.position.x;
    const playerZ = sphere.position.z;

    isGrounded = false;

    // 충돌 검사
    for (const cube of cubes) {
        const box = cube.bbox;
        const min = box.min;
        const max = box.max;

        // X축 판정
        const inX = playerX >= min.x - 0.2 && playerX <= max.x + 0.2;

        // Z축 판정
        let inZ = true;
        if (!isOrtho) {
            inZ = playerZ >= min.z - 0.1 && playerZ <= max.z + 0.1;
        }

        // Y축 판정 (착지)
        if (inX && inZ && velocity.y <= 0) {
            if (playerBottomY <= max.y && playerBottomY >= min.y - 0.5) {
                isGrounded = true;
                velocity.y = 0;
                sphere.position.y = max.y + 0.25; // 발판 위로 위치 보정

                // Ortho 모드에서 착지 시, 플레이어를 해당 발판의 깊이로 이동
                if (isOrtho) {
                    sphere.position.z = cube.position.z;
                }
                break;
            }
        }
    }

    // 3. 낙사 체크
    if (sphere.position.y < -10) {
        isGameOver = true;
        gameOverReason = "발을 헛디뎠습니다!";
    }
}

render();

function render() {
    if (isGameOver) {
        alert("Game Over: " + gameOverReason + "\n\n재시작하려면 Enter 키를 누르세요.");
        resetGame();
        requestAnimationFrame(render);
        return;
    }
    if (isOrtho) {
        status.gauge -= 1;
        if (status.gauge == 0) {
            isGameOver = true;
            gameOverReason = "투영 게이지가 0이 되었습니다.";
        }
    } else {
        status.gauge += 1;
    }
    if (Math.abs(sphere.position.x - goal.position.x) < 0.1 &&
        Math.abs(sphere.position.y - goal.position.y) < 0.5 &&
        Math.abs(sphere.position.z - goal.position.z) < 0.5) {
        alert("도착했습니다!");
        return;
    }

    updatePhysics();

    camera.position.x = sphere.position.x;
    if (isOrtho) camera.position.y = 0;
    else camera.position.y = 2;
    camera.lookAt(camera.position.x, 0, 0);

    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

function resetGame() {
    isGameOver = false;
    gameOverReason = "";

    if (isOrtho) switchCamera();

    status.gauge = 100;
    sphere.position.set(4, 1.5, 0);

    camera.position.set(4, 2, 5);
    camera.lookAt(4, 0, 0);

}
