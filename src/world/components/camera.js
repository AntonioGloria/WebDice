import { PerspectiveCamera } from 'three';

function createCamera() {
  const camera = new PerspectiveCamera(45, 1, 0.01, 100);

  camera.position.set(0, 0.1, 0.1);

  return camera;
}

export { createCamera };
