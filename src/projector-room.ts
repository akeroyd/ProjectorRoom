import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import ProjectedMaterial from 'three-projected-material';
import { extractGeometry } from './utils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';
import FSpyCameraLoader from "three-fspy-camera-loader";

const textureFallbackColor = '#dddddd';

export interface CameraPlacement {
  cameraJsonPath: string;
  texturePath: string;
}

export default class ProjectorRoom {
  scene:THREE.Scene;
  modelLoader:GLTFLoader;
  cameraPlacements:CameraPlacement[];
  mesh: THREE.Mesh;
  materials: ProjectedMaterial[];
  cameras: THREE.PerspectiveCamera[];
  highlightedCamera: number;

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
    this.highlightedCamera = 1;
    this.materials = [];
    this.cameras = [];
  }

  getNewFSpyLoader() {
    const loader = new FSpyCameraLoader();

    const targetCanvas = document.querySelector("#myCanvas");
    if (targetCanvas !== null && targetCanvas instanceof HTMLCanvasElement) {
      loader.setCanvas(targetCanvas)
    }
    return loader;
  }

  async init(gltf:GLTF) {
    const geometry = extractGeometry(gltf);
    geometry.clearGroups();

    const helpers: THREE.CameraHelper[] = [];
    let loader:FSpyCameraLoader;

    await Promise.all(this.cameraPlacements.map(async (placement, index) => {
      loader = this.getNewFSpyLoader();
      this.cameras[index] = await loader.loadAsync(placement.cameraJsonPath);
      this.scene.add(this.cameras[index]);

      helpers[index] = new THREE.CameraHelper(this.cameras[index]);
      this.scene.add(helpers[index]);
      
      this.materials.push(new ProjectedMaterial({
        camera: this.cameras[index],
        texture: new THREE.TextureLoader().load(placement.texturePath),
        color: textureFallbackColor,
        transparent: true,
        opacity: (index === this.highlightedCamera) ? 0.9 : 0.5,
      }));
      
      geometry.addGroup(0, Infinity, index);
    }));

    // add geometry to scene
    this.mesh = new THREE.Mesh(geometry, this.materials);
    this.mesh.position.set(0,2.3,0); // This is specific to shelf.glb
    this.mesh.rotateY(Math.PI / 2); // This is specific to shelf.glb
    this.scene.add(this.mesh);

    console.log('calling prooject')
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

  setHighlightCamera(cameraIndex:number) {
    this.highlightedCamera = cameraIndex;
    this.materials.forEach((material, index) => {
      material.opacity = (index === this.highlightedCamera) ? 0.9 : 0.5
    });
  }
  
  highlightClosetCamera(e:any) {
    const orbitCam = e.target?.object;
    console.log(this)
    // let closestCameraIndex = 0;
    // this.cameras.forEach((cam, index, arr) => {
    //   if (Math.abs(orbitCam.rotation.y - cam.rotation.y) < Math.abs(orbitCam.rotation.y - arr[closestCameraIndex].rotation.y)) {
    //     closestCameraIndex = index;
    //   }
    // })
    // this.setHighlightCamera(closestCameraIndex);
  }
}