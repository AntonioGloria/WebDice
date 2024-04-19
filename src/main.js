import { World } from './world/World';

async function main() {
  try {
    const container = document.querySelector('#scene-container');
    const world = new World(container);
    await world.init();

    world.start();
  }

  catch(error) {
    console.log(error);
  }
}

main();