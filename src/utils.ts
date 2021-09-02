import { BufferGeometry, Mesh } from 'three';
import { BufferGeometryUtils } from 'three/examples/jsm/utils/BufferGeometryUtils';
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader';

// extract all geometry from a gltf scene
export function extractGeometry(gltf:GLTF) {
  const geometries:BufferGeometry[] = [];

  gltf.scene.traverse((child) => {
    if (child instanceof Mesh) {
      geometries.push(child.geometry)
    }
  })

  return BufferGeometryUtils.mergeBufferGeometries(geometries)
}