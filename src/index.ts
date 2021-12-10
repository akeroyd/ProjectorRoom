import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import ProjectorRoom, { CameraPlacement } from './projector-room';

const scene = new THREE.Scene()
scene.background = new THREE.Color( 0x222222 );
scene.scale.set(0.4, 0.4, 0.4);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(4, 1, 2);

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI - (Math.PI / 3);

// Origin helper
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
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
    cameraJsonPath: './cameras/clean1.json',
    texturePath: './images/clean1.jpg',
  };

  const cameraPlacement2: CameraPlacement = {
    cameraJsonPath: './cameras/clean2.json',
    texturePath: './images/clean2.png',
  };

  const cameraPlacement3: CameraPlacement = {
    cameraJsonPath: './cameras/clean3.json',
    texturePath: './images/clean3.png',
  };

  const cameraPlacement5: CameraPlacement = {
    cameraJsonPath: './cameras/clean5.json',
    texturePath: './images/clean5.png',
  };

  const cameraPlacement6: CameraPlacement = {
    cameraJsonPath: './cameras/clean6.json',
    texturePath: './images/clean6.png',
  };

  const cameraPlacement7: CameraPlacement = {
    cameraJsonPath: './cameras/floor1.json',
    texturePath: './images/floor1.jpg',
  };


  const projectorRoom = new ProjectorRoom(
    scene,
    './models/marshal_no_table.glb',
    [cameraPlacement1, cameraPlacement2, cameraPlacement3, cameraPlacement5, cameraPlacement6, cameraPlacement7],
  );
  
  (window as any).projectorRoom = projectorRoom; // for debug only

  controls.addEventListener('change', projectorRoom.highlightClosetCamera.bind(projectorRoom));
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
