import { Mesh, PlaneGeometry, MeshStandardMaterial, Color } from 'three';

class Floor extends Mesh {
  constructor() {
    super();
    this.geometry = new PlaneGeometry(100, 100);
    this.material = new MeshStandardMaterial({
      color: new Color("rgb(34, 102, 30)"),
      roughness: 0.9
    });
    this.rotation.x = -Math.PI / 2;
    this.receiveShadow = true;
  }
}

export { Floor };