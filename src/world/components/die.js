import { Mesh, TextureLoader, MeshStandardMaterial, SRGBColorSpace } from 'three';
import { Body, Box, Trimesh, Vec3 } from 'cannon-es';
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
    this.geometry = this.setModel();

    this.collider = new Body({
      mass: 0.005,
      shape: new Box(new Vec3(0.008, 0.008, 0.008))
    });

    this.material = new MeshStandardMaterial({
      normalMap: normalMap,
      roughness: 0.2,
    });

    this.castShadow = true;
    this.setColor(color);
  }

  setModel() {
    const [model] = modelData.scene.children;
    const { geometry } = model;
    return geometry
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

  tick(delta) {
    this.seconds += delta;
    this.position.copy(this.collider.position);
    this.quaternion.copy(this.collider.quaternion);
  }
}

export { DieModel };