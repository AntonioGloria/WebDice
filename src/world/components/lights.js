import { SpotLight, HemisphereLight, MathUtils } from 'three';


function createLights() {
  const ambientLight = new HemisphereLight(
    'white',
    'darkslategrey',
    1,
  );

  const mainLight = new SpotLight('white', 1);
  mainLight.position.set(0, 1, 0);
  mainLight.rotation.z = MathUtils.degToRad(30);
  mainLight.penumbra = 1;
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;

  return { ambientLight, mainLight };
}

export { createLights };
