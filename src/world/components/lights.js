import { DirectionalLight, HemisphereLight, MathUtils } from 'three';


function createLights() {
  const ambientLight = new HemisphereLight(
    'white',
    'darkslategrey',
    1,
  );

  const mainLight = new DirectionalLight('white', 1);
  mainLight.position.set(0, 20, 10);
  mainLight.rotation.z = MathUtils.degToRad(30);

  return { ambientLight, mainLight };
}

export { createLights };
