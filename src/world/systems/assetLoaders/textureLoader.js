import { EquirectangularReflectionMapping, TextureLoader } from 'three';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';

const exrLoader = new EXRLoader();
const texLoader = new TextureLoader();

async function loadEnvTexture(filePath) {
  try {
    const exrMap = await exrLoader.loadAsync(filePath);
    exrMap.mapping = EquirectangularReflectionMapping;

    return exrMap;
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