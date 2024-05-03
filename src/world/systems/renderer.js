import { WebGLRenderer, PCFSoftShadowMap } from 'three';

function createRenderer() {
  const renderer = new WebGLRenderer({ antialias: true, alpha: true });
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;

  return renderer;
}

export { createRenderer };
