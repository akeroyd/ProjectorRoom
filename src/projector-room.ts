import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ProjectedMaterial from 'three-projected-material';
import { extractGeometry } from './utils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

export interface CameraPlacement {
  camera: THREE.PerspectiveCamera;
  cameraPosition: [number, number, number],
  cameraLookAt: [number, number, number],
  texturePath: string;
  textureFallbackColor: string;
}

export default class ProjectorRoom {
  scene:THREE.Scene;
  modelLoader:GLTFLoader;
  cameraPlacements:CameraPlacement[];
  mesh: THREE.Mesh;

  constructor(
    scene:THREE.Scene,
    modelPath: string,
    cameraPlacements: CameraPlacement[],
  ) {
    this.scene = scene;
    this.modelLoader = new GLTFLoader();
    this.modelLoader.load(modelPath, (gltf) => this.init(gltf), undefined, console.error);
    this.cameraPlacements = cameraPlacements;
    this.mesh = new THREE.Mesh();
  }

  init(gltf:GLTF) {
    const geometry = extractGeometry(gltf);
    geometry.clearGroups()


    const texture1 = new THREE.TextureLoader().load('../images/shelf1.jpg');

    const helpers: THREE.CameraHelper[] = [];
    const materials:ProjectedMaterial[] = [];

    this.cameraPlacements.forEach((placement, index) => {

      helpers[index] = new THREE.CameraHelper(placement.camera);
      this.scene.add(helpers[index]);

      placement.camera.position.set(...placement.cameraPosition);
      placement.camera.lookAt(...placement.cameraLookAt);

      // define materials
      materials.push(new ProjectedMaterial({
        camera: placement.camera,
        texture: texture1,
        color: placement.textureFallbackColor,
        transparent: true,
      }));

      geometry.addGroup(0, Infinity, index);
    });

    // add geometry to scene
    this.mesh = new THREE.Mesh(geometry, materials);
    this.scene.add(this.mesh);

    this.project();

    // add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    this.scene.add(ambientLight)
  }

  project() {
    (this.mesh.material as ProjectedMaterial[]).forEach((material) => {
      material.project(this.mesh);
    });
  }

  lookAt(camera:number, x:number, y:number, z:number) {
    this.cameraPlacements[camera].camera.lookAt(x, y, z);
    this.project();
  }

  setProjector(camera:number, x: number, y:number, z:number) {
    this.cameraPlacements[camera].camera.position.set(x, y, z);
    this.project();
  };
}