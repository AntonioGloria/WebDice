import { Mesh, TextureLoader, MeshStandardMaterial, SRGBColorSpace, Object3D, Vector3 } from 'three';
import { Body, Box, Material, Vec3 } from 'cannon-es';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();
const modelPath = '/assets/models/die.glb';
const modelData = await gltfLoader.loadAsync(modelPath);

const texLoader = new TextureLoader();
const baseWhitePath = '/assets/textures/Die_BaseColor_White.png'
const baseBluePath = '/assets/textures/Die_BaseColor_Blue.png'
const baseBlackPath = '/assets/textures/Die_BaseColor_Black.png'
const baseRedPath = '/assets/textures/Die_BaseColor_Red.png'
const normalMapPath = '/assets/textures/Die_Normal.png'

const normalMap = await texLoader.loadAsync(normalMapPath);
const baseWhiteMap = await texLoader.loadAsync(baseWhitePath);
const baseBlueMap = await texLoader.loadAsync(baseBluePath);
const baseBlackMap = await texLoader.loadAsync(baseBlackPath);
const baseRedMap = await texLoader.loadAsync(baseRedPath);

baseWhiteMap.colorSpace = SRGBColorSpace;
baseBlueMap.colorSpace = SRGBColorSpace;
baseBlackMap.colorSpace = SRGBColorSpace;
baseRedMap.colorSpace = SRGBColorSpace;

class DieModel extends Mesh {
  constructor(color) {
    super();
    this.initRotX = this.getRandomRadian();
    this.initRotY = this.getRandomRadian();
    this.initRotZ = this.getRandomRadian();

    this.geometry = this.setModel();

    this.maxX = this.geometry.boundingBox.max.x;
    this.maxY = this.geometry.boundingBox.max.y;
    this.maxZ = this.geometry.boundingBox.max.z;

    this.minX = this.geometry.boundingBox.min.x;
    this.minY = this.geometry.boundingBox.min.y;
    this.minZ = this.geometry.boundingBox.min.z;

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

    this.material = new MeshStandardMaterial({
      normalMap: normalMap,
      roughness: 0.2,
    });

    this.castShadow = true;
    this.setColor(color);

    this.collider.quaternion.setFromEuler(
      this.initRotX,
      this.initRotY,
      this.initRotZ
    );
  }

  setModel() {
    const [model] = modelData.scene.children;
    const { geometry } = model;
    return geometry;
  }

  setColor(color) {
    switch(color) {
      case 'blue':
        this.material.map = baseBlueMap;
        break;

      case 'red':
        this.material.map = baseRedMap;
        break;

      case 'black':
        this.material.map = baseBlackMap;
        break;

      default:
        this.material.map = baseWhiteMap;
        break;
    }
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