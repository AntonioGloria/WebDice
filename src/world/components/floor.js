import { Mesh, PlaneGeometry, MeshStandardMaterial, Color } from 'three';
import { Body, Plane } from 'cannon-es';

class Floor extends Mesh {
  constructor() {
    super();
    this.geometry = new PlaneGeometry(100, 100);

    this.collider = new Body({
      type: Body.STATIC,
      shape: new Plane()
    });

    this.material = new MeshStandardMaterial({
      color: new Color("rgb(34, 102, 30)"),
      roughness: 0.9
    });

    this.rotation.x = -Math.PI / 2;
    this.collider.quaternion.setFromEuler(-Math.PI / 2, 0, 0);

    this.receiveShadow = true;
  }
}

export { Floor };