import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { MathUtils } from 'three';

function createControls(camera, canvas) {
  const controls = new OrbitControls(camera, canvas);
  const orbitLimit = MathUtils.degToRad(45);

  controls.enableDamping = true;

  controls.minAzimuthAngle = -orbitLimit;
  controls.maxAzimuthAngle = orbitLimit;

  controls.minPolarAngle = orbitLimit;
  controls.maxPolarAngle = Math.PI - orbitLimit;

  controls.minDistance = 25;
  controls.maxDistance = 1000;

  // forward controls.update to our custom .tick method
  controls.tick = () => controls.update();

  return controls;
}

export { createControls };
