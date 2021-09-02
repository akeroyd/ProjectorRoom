
declare module 'three-projected-material' {
  import { MeshPhysicalMaterial, Mesh } from 'three';

  export interface ProjectedMaterialParameters {
    camera: any,
    texture: any,
    color: string,
    transparent: boolean,
    opacity: number,
  }

  export default class ProjectedMaterial extends MeshPhysicalMaterial {
    constructor(parameters?: ProjectedMaterialParameters);
    project(mesh:Mesh): void;
  }
}



