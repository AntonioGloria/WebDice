import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(1, 1, 10, 10000);

  camera.position.set(0, 0, 1000);

  return camera;
}

export { createCamera };
