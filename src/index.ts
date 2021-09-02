import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ProjectedMaterial from 'three-projected-material';
import { extractGeometry } from './utils';
import ProjectorRoom, { CameraPlacement } from './projector-room';

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x222222 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

const cameraPlacement1: CameraPlacement = {
  camera: new THREE.PerspectiveCamera(45, 1, 0.01, 3),
  cameraPosition: [9, 4, 5],
  cameraLookAt: [0, -1.4, 1],
  texturePath: '../images/shelf1.jpg',
  textureFallbackColor: '#37E140',
};

const cameraPlacement5: CameraPlacement = {
  camera: new THREE.PerspectiveCamera(45, 1, 0.01, 3),
  cameraPosition: [8, 4, 0],
  cameraLookAt: [-0.2, -1.2, 0.5],
  texturePath: '../images/shelf5.jpg',
  textureFallbackColor: '#37E140',
};

const projectorRoom = new ProjectorRoom(
  scene,
  './models/shelf.glb',
  [cameraPlacement1],
);

(window as any).projectorRoom = projectorRoom;
// projectorRoom.lookAt(1, 1, 1, 1);


window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
