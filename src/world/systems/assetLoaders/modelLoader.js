import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const gltfLoader = new GLTFLoader();

async function loadModels(filePaths) {
  try {
    const models = await Promise.all(
      filePaths.map(async filePath => {
        const modelData = await gltfLoader.loadAsync(filePath);
        return modelData.scene.children[0];
      })
    );

    return models;
  }

  catch(error) {
    console.log(error);
  }
}

export { loadModels };
