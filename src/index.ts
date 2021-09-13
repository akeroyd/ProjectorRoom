import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
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
// scene.add( cube );

const geometry2 = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const cube2 = new THREE.Mesh( geometry2, material );
cube2.position.set(0,0,0); 
scene.add( cube2 );
// TEMP



init(); 



window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}

function init() {
  const cameraPlacement1: CameraPlacement = {
    cameraJsonPath: './cameras/checkers1.json',
    texturePath: './images/checkers1.jpg',
  };

  const cameraPlacement2: CameraPlacement = {
    cameraJsonPath: './cameras/checkers2.json',
    texturePath: './images/checkers2.jpg',
  };

  const cameraPlacement3: CameraPlacement = {
    cameraJsonPath: './cameras/checkers3.json',
    texturePath: './images/checkers3.jpg',
  };

  const projectorRoom = new ProjectorRoom(
    scene,
    './models/shelf.glb',
    [cameraPlacement1, cameraPlacement2, cameraPlacement3],
  );
  
  (window as any).projectorRoom = projectorRoom; // for debug only

  controls.addEventListener('change', projectorRoom.highlightClosetCamera);
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
