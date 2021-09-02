import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ProjectedMaterial from 'three-projected-material';
import { extractGeometry } from './utils';
import ProjectorRoom, { CameraPlacement } from './projector-room';

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x222222 );

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(4, 1, 2);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI - (Math.PI / 3);

// TEMP alignment guides
const geometry = new THREE.BoxGeometry(0.1, 0.1, 9);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
cube.position.set(-1.55,-2.3,0); 
scene.add( cube );
// TEMP

const cameraPlacement1: CameraPlacement = {
  camera: new THREE.PerspectiveCamera(45, 1, 0.01, 3),
  cameraPosition: [9, 4, 5],
  cameraLookAt: [0, -1.4, 1],
  texturePath: './images/shelf1.jpg',
  textureFallbackColor: '#37E140',
};

const cameraPlacement5: CameraPlacement = {
  camera: new THREE.PerspectiveCamera(45, 1, 0.01, 3),
  cameraPosition: [9, 4, 2],
  cameraLookAt: [0, -1.4, 0.5],
  texturePath: './images/shelf5.jpg',
  textureFallbackColor: '#37E140',
};

const projectorRoom = new ProjectorRoom(
  scene,
  './models/shelf.glb',
  [cameraPlacement1, cameraPlacement5],
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

controls.addEventListener('change', () => {
  projectorRoom.setHighlightCamera(camera.rotation.y > 1.1 ? 1 : 0)
});

function animate() {
    requestAnimationFrame(animate)

    controls.update()

    render()
}

function render() {
    renderer.render(scene, camera)
}
animate()
