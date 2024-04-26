import { DieModel } from './components/die.js';
import { Floor } from './components/floor.js';

import { createCamera } from './components/camera.js';
import { createLights } from './components/lights.js';
import { createScene } from './components/scene.js';

import { createControls } from './systems/controls.js';
import { createRenderer } from './systems/renderer.js';
import { Resizer } from './systems/Resizer.js';
import { Loop } from './systems/Loop.js';

import * as CANNON from 'cannon-es';
import CannonDebugger from 'cannon-es-debugger';

let camera;
let controls;
let renderer;
let scene;
let loop;

class World {
  constructor(container) {
    this.diceWidth = 0.016;
    this.dieColor = 'white';
    this.diceMid = this.diceWidth/2;

    camera = createCamera();
    renderer = createRenderer();
    scene = createScene();
    loop = new Loop(camera, scene, renderer);
    container.append(renderer.domElement);
    controls = createControls(camera, renderer.domElement);

    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });

    const { ambientLight, mainLight } = createLights();

    loop.updatables.push(controls);
    scene.add(ambientLight, mainLight);

    const resizer = new Resizer(container, camera, renderer);

    this.floor = new Floor();
    this.dice = [];

    this.physics.addBody(this.floor.collider);
  }

  async init() {
    try {
      // const bgEnvMap = await loadEnvTexture(bgEnvMapPath);
      // scene.environment = bgEnvMap;

      controls.target.y = this.diceMid;
      scene.add(this.floor);
      this.setDiceNumber(1);

      const cannonDebugger = new CannonDebugger(scene, this.physics);

      const animate = () => {
        this.physics.fixedStep();
        cannonDebugger.update();
        window.requestAnimationFrame(animate);
      }
      animate();
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

  // methods for getting input values
  setDiceNumber(newNumber) {
    this.clearDice();

    // create new dice
    for (let i = 0; i < newNumber; i++) {
      const newDie = new DieModel(this.dieColor);
      newDie.collider.position.set(0, this.diceWidth + 0.1, 0);
      this.dice.push(newDie);
    }
  }

  setDieColor(newColor) {
    this.dieColor = newColor
    for (let i = 0; i < this.dice.length; i++) {
      this.dice[i].setColor(newColor);
    }
  }

  rollDice() {
    this.setDiceNumber(this.dice.length);

    for (let i = 0; i < this.dice.length; i++) {
      scene.add(this.dice[i]);
      loop.updatables.push(this.dice[i]);
      this.physics.addBody(this.dice[i].collider);
    }
  }

  // Clear scene, updatables, physics, and world dice array
  clearDice() {
    for (let i = 0; i < this.dice.length; i++) {
      scene.remove(this.dice[i]);
      this.physics.removeBody(this.dice[i].collider);
    }

    loop.updatables = loop.updatables.filter(obj => !this.dice.includes(obj));
    this.dice = [];
  }
}

export { World };
