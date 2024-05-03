import { EquirectangularReflectionMapping, TextureLoader } from 'three';
import { RGBELoader } from 'three/examples/jsm/Addons.js';

const hdrLoader = new RGBELoader();
const texLoader = new TextureLoader();

async function loadEnvTexture(filePath) {
  try {
    const envMap = await hdrLoader.loadAsync(filePath);
    envMap.mapping = EquirectangularReflectionMapping;

    return envMap;
  }

  catch(error) {
    console.log(error);
  }
}

async function loadTextures(filePaths) {
  try {
    const textures = await Promise.all(
      filePaths.map(async filePath => {
        const texture = await texLoader.loadAsync(filePath);
        return texture;
      })
    );

    return textures;
  }

  catch(error) {
    console.log(error);
  }
}

export { loadTextures, loadEnvTexture };