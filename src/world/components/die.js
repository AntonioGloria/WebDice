import { Mesh, Object3D, Vector3 } from 'three';
import { Body, Box, Material, Vec3 } from 'cannon-es';

class DieModel extends Mesh {
  constructor(geometry, material, color) {
    super();
    this.geometry = geometry;
    this.material = material;

    this.maxX = this.geometry.boundingBox.max.x;
    this.maxY = this.geometry.boundingBox.max.y;
    this.maxZ = this.geometry.boundingBox.max.z;

    this.minX = this.geometry.boundingBox.min.x;
    this.minY = this.geometry.boundingBox.min.y;
    this.minZ = this.geometry.boundingBox.min.z;

    this.initRotX = this.getRandomRadian();
    this.initRotY = this.getRandomRadian();
    this.initRotZ = this.getRandomRadian();

    this.sidePositions = [
      [0, this.maxY, 0],
      [this.minX, 0, 0],
      [0, 0, this.maxZ],
      [this.maxX, 0, 0],
      [0, this.minY, 0],
      [0, 0, this.minZ],
    ];

    this.sides = this.sidePositions.map(coords => {
      const side = new Object3D();
      side.position.set(...coords);
      this.add(side);
      return side;
    });

    this.collider = new Body({
      mass: 0.005,
      shape: new Box(new Vec3(this.maxX, this.maxY, this.maxZ)),
      material: new Material({
        friction: 0.1,
        restitution: 0
      })
    });

    this.collider.allowSleep = true;
    this.collider.sleepSpeedLimit = 1;
    this.collider.sleepTimeLimit = 1;

    this.castShadow = true;
    this.setColor(color);

    this.collider.quaternion.setFromEuler(
      this.initRotX,
      this.initRotY,
      this.initRotZ
    );
  }

  setColor(color) {
    this.material.map = color;
  }

  getDieValue() {
    const worldYPositions = this.sides.map(side => {
      const posVec = new Vector3();
      return side.getWorldPosition(posVec).y;
    });

    const upY = Math.max(...worldYPositions);
    return worldYPositions.indexOf(upY) + 1;
  }

  getRandomRadian() {
    return Math.floor(Math.random()*2*Math.PI);
  }

  tick(delta) {
    this.seconds += delta;
    this.position.copy(this.collider.position);
    this.quaternion.copy(this.collider.quaternion);
  }
}

export { DieModel };