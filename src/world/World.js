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

class World {
  constructor(container) {
    this.container = container;

    this.diceEvent = new CustomEvent("diceStopped", {
      detail: {
        name: "dice-stopped",
      },
    });

    this.camera = createCamera();
    this.renderer = createRenderer();
    this.scene = createScene();
    this.loop = new Loop(this.camera, this.scene, this.renderer);
    this.controls = createControls(this.camera, this.renderer.domElement);
    this.loop.updatables.push(this.controls);
    this.container.append(this.renderer.domElement);
    this.resizer = new Resizer(this.container, this.camera, this.renderer);

    this.physics = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });

    this.physics.allowSleep = true;

    this.runPhysics = this.runPhysics.bind(this);
    this.physDebugger = new CannonDebugger(this.scene, this.physics);

    const { ambientLight, mainLight } = createLights();
    this.scene.add(ambientLight, mainLight);

    this.floor = new Floor();

    this.diceWidth = 0.016;
    this.dieColor = 'white';
    this.diceMid = this.diceWidth/2;
    this.dice = [];
    this.totalValue = 0;
  }

  async init() {
    try {
      // const bgEnvMap = await loadEnvTexture(bgEnvMapPath);
      // scene.environment = bgEnvMap;

      this.controls.target.y = this.diceMid;

      this.scene.add(this.floor);
      this.physics.addBody(this.floor.collider);

      this.setDiceNumber(1);

      this.runPhysics();
    }

    catch(error) {
      console.log(error);
    }
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
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
      this.scene.add(this.dice[i]);
      this.loop.updatables.push(this.dice[i]);
      this.physics.addBody(this.dice[i].collider);
    }
  }

  // Clear scene, updatables, physics, and world dice array
  clearDice() {
    for (let i = 0; i < this.dice.length; i++) {
      this.scene.remove(this.dice[i]);
      this.physics.removeBody(this.dice[i].collider);
    }

    this.loop.updatables = this.loop.updatables.filter(obj => {
      return !this.dice.includes(obj)
    });

    this.dice = [];
  }

  runPhysics() {
    this.physics.fixedStep();
    this.physDebugger.update();
    window.requestAnimationFrame(this.runPhysics);

    // Check when collider sleepState is "sleepy"
    const diceStop = this.dice.every(die => die.collider.sleepState === 1);

    if (diceStop) {
      const diceTotal = this.dice.reduce((acc, current) => {
        return acc + current.getDieValue();
      }, 0);

      this.totalValue = diceTotal;
      this.container.dispatchEvent(this.diceEvent);
    }
  }
}

export { World };
