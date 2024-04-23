import { DieModel } from './components/die.js';
import { Floor } from './components/floor.js';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    const { ambientLight, mainLight } = createLights();

    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);

    const resizer = new Resizer(container, camera, renderer);
  }

  async init() {
    try {
      const floorModel = new Floor();
      const dieModel = new DieModel('white');

      // const bgEnvMap = await loadEnvTexture(bgEnvMapPath);
      // scene.environment = bgEnvMap;

      dieModel.position.set(0, 0.008, 0);

      controls.target.copy(dieModel.position);
      scene.add(floorModel);
      scene.add(dieModel);
      loop.updatables.push(dieModel);
    }

    catch(error) {
      console.log(error);
    }
  }

  render() {
    renderer.render(scene, camera);
  }

  start() {
    loop.start();
  }

  stop() {
    loop.stop();
  }
}

export { World };
